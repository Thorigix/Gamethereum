// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Errors {
    error Unauthorized();
    error InvalidPrice();
    error InvalidQuantity();
    error InvalidPayment();
    error NotListed();
    error AlreadySold();
    error TransferFailed();
}
