// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {FixedPriceMarketplace} from "../src/FixedPriceMarketplace.sol";

contract MarketplaceTest is Test {
    FixedPriceMarketplace market;

    function setUp() public {
        market = new FixedPriceMarketplace(250, address(this));
    }

    function testInitialConfig() public {
        assertEq(market.feeBps(), 250);
        assertEq(market.feeRecipient(), address(this));
    }
}
