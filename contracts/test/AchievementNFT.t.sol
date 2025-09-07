// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {AchievementNFT} from "../src/AchievementNFT.sol";

contract AchievementNFTTest is Test {
    AchievementNFT ach;
    address admin = address(this);

    // Signer private key for platform
    uint256 signerPk;
    address signer;

    address player = address(0xBEEF);

    // EIP-712 helpers
    bytes32 constant CLAIM_TYPEHASH = keccak256("Claim(address player,uint256 achievementId,uint32 timeSec)");
    bytes32 constant EIP712DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    function setUp() public {
        signerPk = 0xA11CE; // arbitrary test private key
        signer = vm.addr(signerPk);
        ach = new AchievementNFT("Game Achievements", "ACHV", admin, signer);
    }

    function _digest(address _player, uint256 achievementId, uint32 timeSec) internal view returns (bytes32) {
        bytes32 structHash = keccak256(abi.encode(CLAIM_TYPEHASH, _player, achievementId, timeSec));
        bytes32 domainSeparator = keccak256(
            abi.encode(
                EIP712DOMAIN_TYPEHASH,
                keccak256(bytes("Game Achievements")),
                keccak256(bytes("1")),
                block.chainid,
                address(ach)
            )
        );
        return keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
    }

    function test_MintMyAchievement_WithValidSignature() public {
        uint256 achievementId = 1;
        uint32 timeSec = 30; // < default 60

        bytes32 digest = _digest(player, achievementId, timeSec);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, digest);
        bytes memory sig = abi.encodePacked(r, s, v);

        vm.prank(player);
        uint256 tokenId = ach.mintMyAchievement(achievementId, timeSec, sig);

        assertEq(ach.ownerOf(tokenId), player);
        assertTrue(ach.claimed(achievementId, player));

        // Calling again should fail due to single-claim rule
        vm.prank(player);
        vm.expectRevert(bytes("already claimed"));
        ach.mintMyAchievement(achievementId, timeSec, sig);
    }
}
