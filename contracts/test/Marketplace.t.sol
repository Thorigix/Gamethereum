// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {FixedPriceMarketplace} from "../src/FixedPriceMarketplace.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract ERC721Mock is Test {
    string public name = "Mock721";
    string public symbol = "M721";
    mapping(uint256 => address) public ownerOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    function mint(address to, uint256 id) external {
        ownerOf[id] = to;
    }

    function approve(address to, uint256 id) external {
        require(ownerOf[id] == msg.sender, "not owner");
        getApproved[id] = to;
    }

    function setApprovalForAll(address op, bool ok) external {
        isApprovedForAll[msg.sender][op] = ok;
    }

    function safeTransferFrom(address from, address to, uint256 id) external {
        require(msg.sender == getApproved[id] || isApprovedForAll[from][msg.sender], "not approved");
        require(ownerOf[id] == from, "not owner");
        ownerOf[id] = to;
    }
}

contract MarketplaceTest is Test {
    FixedPriceMarketplace market;
    ERC721Mock nft721;

	// test sözleşmesi fee'yi alabilsin diye:
	receive() external payable {}


    address seller = address(0xA11CE);
    address buyer  = address(0xB0B);

    function setUp() public {
        market = new FixedPriceMarketplace(250, address(this)); // %2.5 fee, recipient test sözleşmesi
        nft721 = new ERC721Mock();

        // mint ve approval
        vm.prank(address(this));
        nft721.mint(seller, 1);

        vm.startPrank(seller);
        nft721.setApprovalForAll(address(market), true);
        vm.stopPrank();
    }

    function test_ListAndBuy721() public {
        // list
        vm.prank(seller);
        market.list721(address(nft721), 1, 1 ether);

        // buyer bakiyesi
        vm.deal(buyer, 1 ether);

        // buy
        vm.prank(buyer);
        market.buy{value: 1 ether}(1);

        // owner değişti mi?
        assertEq(nft721.ownerOf(1), buyer);
    }

    function test_CancelBySeller() public {
        vm.prank(seller);
        market.list721(address(nft721), 1, 0.5 ether);

        vm.prank(seller);
        market.cancel(1);
    }
}
