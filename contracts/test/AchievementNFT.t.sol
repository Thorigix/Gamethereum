// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {AchievementNFT} from "../src/AchievementNFT.sol";

contract AchievementNFTTest is Test {
    AchievementNFT ach;
    address admin = address(this);
    address player = address(0xBEEF);

    function setUp() public {
        ach = new AchievementNFT("Game Achievements", "ACHV", admin);
    }

    function test_SetUriAndMint() public {
        // 1) Admin başarı URI'ını tanımlar
        ach.setAchievementURI(1, "ipfs://QmDemoHash/1.json");

        // 2) Admin oyuncuya mint eder
        uint256 tokenId = ach.mintAchievement(player, 1);

        // 3) Beklentiler
        assertEq(ach.ownerOf(tokenId), player);
        assertEq(ach.tokenURI(tokenId), "ipfs://QmDemoHash/1.json");
    }
}
