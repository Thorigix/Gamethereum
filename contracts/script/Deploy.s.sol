// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {FixedPriceMarketplace} from "../src/FixedPriceMarketplace.sol";

contract Deploy is Script {
    function run() external {
        // Konfig
        uint16 feeBps = 250; // %2.5
        // feeRecipient → deployer adresi olsun
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address feeRecipient = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);
        FixedPriceMarketplace market = new FixedPriceMarketplace(feeBps, feeRecipient);
        vm.stopBroadcast();

        console.log("Marketplace deployed at:", address(market));
    }
}
