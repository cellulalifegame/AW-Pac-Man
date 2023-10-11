// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {System} from "@latticexyz/world/src/System.sol";
import {CellulaLife, CellulaLifeData} from "../codegen/tables/CellulaLife.sol";

contract SaveLifeInfoSystem is System {
    uint256 public savePrice = 0; //1000000000000000000;
    function saveLifeInfo(uint256 tokenId, uint8 viewRange, uint8 attack, string memory moveRule) public payable {
        require(msg.value >= savePrice, " Price must be greater than 1 ETH");
        CellulaLife.set(tokenId, viewRange, attack, moveRule);
    }

    function lifeInfo(uint256 tokenId) public returns (CellulaLifeData memory dataInfo) {
        return CellulaLife.get(tokenId);
    }

    function getAttack(uint256 tokenId) public returns (uint8 attack) {
        return CellulaLife.getAttack(tokenId);
    }

    function getMoveRule(uint256 tokenId) public returns (string memory moveRule) {
        return CellulaLife.getMoveRule(tokenId);
    }

    function getViewRange(uint256 tokenId) public returns (uint8 viewRange) {
        return CellulaLife.getViewRange(tokenId);
    }
}