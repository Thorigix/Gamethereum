// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {Errors} from "./libs/Errors.sol";
import {Events} from "./libs/Events.sol";
import {Constants} from "./libs/Constants.sol";

contract FixedPriceMarketplace is Ownable, ReentrancyGuard {
    struct Listing {
        address seller;
        address collection;
        uint256 tokenId;
        uint256 quantity;
        uint256 priceWei;
        bool sold;
    }

    uint16 public feeBps;
    address public feeRecipient;
    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings;

constructor(uint16 _feeBps, address _feeRecipient) Ownable(msg.sender) {
    feeBps = _feeBps;
    feeRecipient = _feeRecipient;
}


    // --- LIST ---
    function list721(address collection, uint256 tokenId, uint256 priceWei) external {
        // gövde sonra
    }

    function list1155(address collection, uint256 tokenId, uint256 quantity, uint256 priceWei) external {
        // gövde sonra
    }

    // --- BUY ---
    function buy(uint256 listingId) external payable nonReentrant {
        // gövde sonra
    }

    // --- CANCEL ---
    function cancel(uint256 listingId) external {
        // gövde sonra
    }

    // --- UPDATE PRICE ---
    function updatePrice(uint256 listingId, uint256 newPriceWei) external {
        // gövde sonra
    }

    // --- ADMIN ---
    function setFee(uint16 _feeBps) external onlyOwner {
        feeBps = _feeBps;
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
    }
}
