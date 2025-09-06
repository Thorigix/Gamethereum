// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Events {
    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed collection,
        uint256 tokenId,
        uint256 quantity,
        uint256 priceWei
    );

    event Bought(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice
    );

    event Cancelled(uint256 indexed listingId);
    event PriceUpdated(uint256 indexed listingId, uint256 newPrice);
}
