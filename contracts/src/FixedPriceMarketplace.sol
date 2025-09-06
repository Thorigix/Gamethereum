// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";
import {ERC165Checker} from "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {Errors} from "./libs/Errors.sol";
import {Events} from "./libs/Events.sol";
import {Constants} from "./libs/Constants.sol";

contract FixedPriceMarketplace is Ownable, ReentrancyGuard {
    using ERC165Checker for address;

    struct Listing {
        address seller;
        address collection;
        uint256 tokenId;
        uint256 quantity;   // 721 için 1
        uint256 priceWei;   // toplam fiyat (1155 için tüm quantity)
        bool sold;          // satıldı/iptal edildi
        bool is1155;        // standart
    }

    uint16 public feeBps;
    address public feeRecipient;
    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings;

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    constructor(uint16 _feeBps, address _feeRecipient) Ownable(msg.sender) {
        feeBps = _feeBps;
        feeRecipient = _feeRecipient;
    }

    // --- LIST ---
    function list721(address collection, uint256 tokenId, uint256 priceWei) external {
        if (priceWei == 0) revert Errors.InvalidPrice();

        IERC721 nft = IERC721(collection);
        if (nft.ownerOf(tokenId) != msg.sender) revert Errors.Unauthorized();

        // onay kontrolü (tekil ya da operator)
        if (nft.getApproved(tokenId) != address(this) && !nft.isApprovedForAll(msg.sender, address(this))) {
            revert Errors.Unauthorized();
        }

        uint256 id = ++nextListingId;
        listings[id] = Listing({
            seller: msg.sender,
            collection: collection,
            tokenId: tokenId,
            quantity: 1,
            priceWei: priceWei,
            sold: false,
            is1155: false
        });

        emit Events.Listed(id, msg.sender, collection, tokenId, 1, priceWei);
    }

    function list1155(address collection, uint256 tokenId, uint256 quantity, uint256 priceWei) external {
        if (priceWei == 0) revert Errors.InvalidPrice();
        if (quantity == 0) revert Errors.InvalidQuantity();

        IERC1155 nft = IERC1155(collection);
        // sahiplik ve onay (1155'te balance + isApprovedForAll)
        if (nft.balanceOf(msg.sender, tokenId) < quantity) revert Errors.Unauthorized();
        if (!nft.isApprovedForAll(msg.sender, address(this))) revert Errors.Unauthorized();

        uint256 id = ++nextListingId;
        listings[id] = Listing({
            seller: msg.sender,
            collection: collection,
            tokenId: tokenId,
            quantity: quantity,
            priceWei: priceWei, // toplam fiyat
            sold: false,
            is1155: true
        });

        emit Events.Listed(id, msg.sender, collection, tokenId, quantity, priceWei);
    }

    // --- BUY (tamamını alır) ---
    function buy(uint256 listingId) external payable nonReentrant {
        Listing storage L = listings[listingId];
        if (L.seller == address(0)) revert Errors.NotListed();
        if (L.sold) revert Errors.AlreadySold();
        if (msg.value != L.priceWei) revert Errors.InvalidPayment();

        L.sold = true;

        // ücret hesapları
        uint256 fee = (L.priceWei * feeBps) / Constants.BPS_DENOMINATOR;
        uint256 royalty;
        address royaltyReceiver;

        if (L.collection.supportsInterface(_INTERFACE_ID_ERC2981)) {
            (royaltyReceiver, royalty) = IERC2981(L.collection).royaltyInfo(L.tokenId, L.priceWei);
        }

        uint256 sellerProceeds = L.priceWei - fee - royalty;

        // transfer NFT
        if (L.is1155) {
            IERC1155(L.collection).safeTransferFrom(L.seller, msg.sender, L.tokenId, L.quantity, "");
        } else {
            IERC721(L.collection).safeTransferFrom(L.seller, msg.sender, L.tokenId);
        }

        // ödemeler
        if (fee > 0 && feeRecipient != address(0)) {
            (bool okF,) = payable(feeRecipient).call{value: fee}("");
            if (!okF) revert Errors.TransferFailed();
        }
        if (royalty > 0 && royaltyReceiver != address(0)) {
            (bool okR,) = payable(royaltyReceiver).call{value: royalty}("");
            if (!okR) revert Errors.TransferFailed();
        }
        if (sellerProceeds > 0) {
            (bool okS,) = payable(L.seller).call{value: sellerProceeds}("");
            if (!okS) revert Errors.TransferFailed();
        }

        emit Events.Bought(listingId, msg.sender, L.quantity, L.priceWei);
    }

    // --- CANCEL ---
    function cancel(uint256 listingId) external {
        Listing storage L = listings[listingId];
        if (L.seller == address(0)) revert Errors.NotListed();
        if (L.sold) revert Errors.AlreadySold();
        if (L.seller != msg.sender && msg.sender != owner()) revert Errors.Unauthorized();

        L.sold = true; // iptal edildi işareti için satır (ayrı durum tutmuyoruz)

        emit Events.Cancelled(listingId);
    }

    // --- UPDATE PRICE ---
    function updatePrice(uint256 listingId, uint256 newPriceWei) external {
        if (newPriceWei == 0) revert Errors.InvalidPrice();

        Listing storage L = listings[listingId];
        if (L.seller == address(0)) revert Errors.NotListed();
        if (L.sold) revert Errors.AlreadySold();
        if (L.seller != msg.sender) revert Errors.Unauthorized();

        L.priceWei = newPriceWei;
        emit Events.PriceUpdated(listingId, newPriceWei);
    }

    // --- ADMIN ---
    function setFee(uint16 _feeBps) external onlyOwner {
        feeBps = _feeBps;
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
    }
}
