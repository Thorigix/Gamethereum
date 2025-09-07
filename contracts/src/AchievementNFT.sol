// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title AchievementNFT
 * @notice Permissionless but signature-gated minting. Any player can mint after the game by submitting
 *         an EIP-712 signature from the platform signer. One NFT per player per achievement. Metadata on-chain.
 */
contract AchievementNFT is ERC721, Ownable, EIP712 {
    using Strings for uint256;

    // -----------------------------------------------------------------------
    // Storage
    // -----------------------------------------------------------------------

    uint256 private _nextTokenId = 1;

    // Platform signer for EIP-712 claims
    address public signer;

    // Thresholds
    uint256 public defaultThreshold = 60; // seconds
    mapping(uint256 => uint256) public achievementThreshold; // 0 => default

    // Optional per-achievement display name
    mapping(uint256 => string) public achievementName;

    // One-time claim: achievementId => player => claimed
    mapping(uint256 => mapping(address => bool)) public claimed;

    // Per-token data for on-chain metadata
    struct TokenData {
        uint256 achievementId;
        uint32 timeSec;
        address player;
    }
    mapping(uint256 => TokenData) public tokenData;

    // EIP-712 typehash
    bytes32 private constant CLAIM_TYPEHASH =
        keccak256("Claim(address player,uint256 achievementId,uint32 timeSec)");

    // -----------------------------------------------------------------------
    // Events
    // -----------------------------------------------------------------------
    event SignerUpdated(address indexed newSigner);
    event DefaultThresholdUpdated(uint256 newThreshold);
    event AchievementThresholdUpdated(uint256 indexed achievementId, uint256 newThreshold);
    event AchievementNameUpdated(uint256 indexed achievementId, string name);
    event AchievementMinted(address indexed to, uint256 indexed tokenId, uint256 indexed achievementId, uint32 timeSec);

    // -----------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------
    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner,
        address initialSigner
    ) ERC721(name_, symbol_) Ownable(initialOwner) EIP712(name_, "1") {
        signer = initialSigner;
        emit SignerUpdated(initialSigner);
    }

    // -----------------------------------------------------------------------
    // Admin setters
    // -----------------------------------------------------------------------
    function setSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "zero signer");
        signer = newSigner;
        emit SignerUpdated(newSigner);
    }

    function setDefaultThreshold(uint256 thresholdSec) external onlyOwner {
        require(thresholdSec > 0, "invalid threshold");
        defaultThreshold = thresholdSec;
        emit DefaultThresholdUpdated(thresholdSec);
    }

    function setAchievementThreshold(uint256 achievementId, uint256 thresholdSec) external onlyOwner {
        // thresholdSec == 0 → defaultThreshold used
        achievementThreshold[achievementId] = thresholdSec;
        emit AchievementThresholdUpdated(achievementId, thresholdSec);
    }

    function setAchievementName(uint256 achievementId, string calldata name_) external onlyOwner {
        achievementName[achievementId] = name_;
        emit AchievementNameUpdated(achievementId, name_);
    }

    // -----------------------------------------------------------------------
    // Minting (Permissionless + Signature gated)
    // -----------------------------------------------------------------------
    function _thresholdOf(uint256 achievementId) internal view returns (uint256) {
        uint256 t = achievementThreshold[achievementId];
        return t == 0 ? defaultThreshold : t;
    }

    function _verifyClaim(
        address player,
        uint256 achievementId,
        uint32 timeSec,
        bytes calldata signature
    ) internal view returns (bool) {
        bytes32 structHash = keccak256(abi.encode(CLAIM_TYPEHASH, player, achievementId, timeSec));
        bytes32 digest = _hashTypedDataV4(structHash);
        address recovered = ECDSA.recover(digest, signature);
        return recovered == signer;
    }

    /// @notice Anyone can submit a valid platform-signed claim to mint for themselves.
    function mintMyAchievement(
        uint256 achievementId,
        uint32 timeSec,
        bytes calldata signature
    ) external returns (uint256 tokenId) {
        address player = msg.sender;
        require(!claimed[achievementId][player], "already claimed");
        require(_verifyClaim(player, achievementId, timeSec, signature), "bad signature");

        // success condition
        require(timeSec < _thresholdOf(achievementId), "not successful");

        tokenId = _nextTokenId++;
        _safeMint(player, tokenId);
        tokenData[tokenId] = TokenData({achievementId: achievementId, timeSec: timeSec, player: player});
        claimed[achievementId][player] = true;

        emit AchievementMinted(player, tokenId, achievementId, timeSec);
    }

    // -----------------------------------------------------------------------
    // On-chain metadata
    // -----------------------------------------------------------------------
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "nonexistent");
        TokenData memory td = tokenData[tokenId];

        // Name
        string memory baseName = bytes(achievementName[td.achievementId]).length > 0
            ? achievementName[td.achievementId]
            : string.concat("Achievement #", td.achievementId.toString());
        string memory name_ = string.concat(baseName, " - ", uint256(td.timeSec).toString(), "s");

        // Description
        string memory desc = string.concat(
            "Player ",
            _toHexStringNoPrefix(td.player),
            " achieved ",
            baseName,
            " in ",
            uint256(td.timeSec).toString(),
            " seconds."
        );

        // Simple SVG
        string memory svg = _buildSVG(baseName, td.timeSec);
        string memory image = string.concat("data:image/svg+xml;base64,", Base64.encode(bytes(svg)));

        // Attributes
        string memory attrs = string.concat(
            "[",
            "{\"trait_type\":\"Achievement ID\",\"value\":\"", td.achievementId.toString(), "\"},",
            "{\"trait_type\":\"Time Seconds\",\"value\":\"", uint256(td.timeSec).toString(), "\"},",
            "{\"trait_type\":\"Player\",\"value\":\"0x", _toHexStringNoPrefix(td.player), "\"},",
            "{\"trait_type\":\"Threshold\",\"value\":\"", _thresholdOf(td.achievementId).toString(), "\"}",
            "]"
        );

        // JSON
        string memory json = string.concat(
            "{",
            "\"name\":\"", name_, "\",",
            "\"description\":\"", desc, "\",",
            "\"image\":\"", image, "\",",
            "\"attributes\":", attrs,
            "}"
        );

        return string.concat("data:application/json;base64,", Base64.encode(bytes(json)));
    }

    function _buildSVG(string memory title, uint32 timeSec) internal pure returns (string memory) {
        string memory timeStr = uint256(timeSec).toString();
        return string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">',
            '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
            '<stop offset="0%" stop-color="#2b2d42"/><stop offset="100%" stop-color="#1b998b"/>',
            '</linearGradient></defs>',
            '<rect width="1024" height="1024" fill="url(#g)"/>',
            '<g font-family="monospace" fill="#ffffff" text-anchor="middle">',
            '<text x="512" y="360" font-size="56" opacity="0.9">', title, '</text>',
            '<text x="512" y="560" font-size="120" font-weight="bold">', timeStr, 's</text>',
            '</g>'
            '</svg>'
        );
    }

    function _toHexStringNoPrefix(address a) internal pure returns (string memory) {
        bytes20 data = bytes20(a);
        bytes memory hexChars = "0123456789abcdef";
        bytes memory str = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            str[i * 2] = hexChars[uint8(data[i] >> 4)];
            str[i * 2 + 1] = hexChars[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }
}
