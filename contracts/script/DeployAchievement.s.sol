// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {AchievementNFT} from "../src/AchievementNFT.sol";

contract DeployAchievement is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        string memory name_ = "Game Achievements";
        string memory symbol_ = "ACHV";
        address initialOwner = vm.addr(pk); // deployer owner olsun

        vm.startBroadcast(pk);
        AchievementNFT ach = new AchievementNFT(name_, symbol_, initialOwner);
        vm.stopBroadcast();

        console.log("AchievementNFT deployed at:", address(ach));
    }
}
