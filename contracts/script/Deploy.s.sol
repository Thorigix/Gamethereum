// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {FixedPriceMarketplace} from "../src/FixedPriceMarketplace.sol";

contract Deploy is Script {
    function run() external {
        uint16 feeBps = 250; // %2.5
        address feeRecipient = msg.sender;

        vm.startBroadcast();
        new FixedPriceMarketplace(feeBps, feeRecipient);
        vm.stopBroadcast();
    }
}
