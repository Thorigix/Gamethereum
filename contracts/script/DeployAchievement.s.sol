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

        // Optional envs: SIGNER, DEFAULT_THRESHOLD
        address signer;
        try vm.envAddress("SIGNER") returns (address s) { signer = s; } catch { signer = initialOwner; }
        uint256 defaultThreshold;
        try vm.envUint("DEFAULT_THRESHOLD") returns (uint256 t) { defaultThreshold = t; } catch { defaultThreshold = 0; }

        vm.startBroadcast(pk);
        AchievementNFT ach = new AchievementNFT(name_, symbol_, initialOwner, signer);
        if (defaultThreshold > 0) {
            ach.setDefaultThreshold(defaultThreshold);
        }
        vm.stopBroadcast();

        console.log("AchievementNFT deployed at:", address(ach));
    }
}
