// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AchievementNFT
 * @notice Demo amaçlı başarı NFT'leri. Admin (owner) başarı URI'larını tanımlar ve mint eder.
 */
contract AchievementNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    // achievementId => metadata URI (ipfs://.../id.json)
    mapping(uint256 => string) public achievementURI;

    event AchievementURISet(uint256 indexed achievementId, string uri);
    event AchievementMinted(address indexed to, uint256 indexed tokenId, uint256 indexed achievementId);

    constructor(string memory name_, string memory symbol_, address initialOwner)
        ERC721(name_, symbol_)           // <-- ERC721 kurucusu çağrısı
        Ownable(initialOwner)            // <-- OZ v5: initial owner parametreli
    {}

    /// @dev Admin başarı URI'ını tanımlar/günceller (ör. 1 → ipfs://Qm.../1.json)
    function setAchievementURI(uint256 achievementId, string calldata uri) external onlyOwner {
        require(bytes(uri).length > 0, "empty uri");
        achievementURI[achievementId] = uri;
        emit AchievementURISet(achievementId, uri);
    }

    /// @dev Admin bir kullanıcıya başarı NFT'si mint eder.
    function mintAchievement(address to, uint256 achievementId) external onlyOwner returns (uint256 tokenId) {
        string memory uri = achievementURI[achievementId];
        require(bytes(uri).length > 0, "uri not set");

        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit AchievementMinted(to, tokenId, achievementId);
    }

    /// @dev Anyone can mint with a custom tokenURI. Useful for user-generated metadata flows.
    function mintAchievementWithURI(address to, uint256 achievementId, string calldata uri)
        external
        returns (uint256 tokenId)
    {
        require(to != address(0), "invalid to");
        require(bytes(uri).length > 0, "empty uri");

        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit AchievementMinted(to, tokenId, achievementId);
    }
}
