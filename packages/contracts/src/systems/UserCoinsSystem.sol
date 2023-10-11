// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {System} from "@latticexyz/world/src/System.sol";
import {UserCoins} from "../codegen/tables/UserCoins";
import "../codegen/tables/UserCoins.sol";

contract UserCoinsSystem is System {

    //At present, omit the verification first
    function saveUserCoins(address userAddress, uint16 coins) public {
        require(coins > 0, "Coins must be greater than 0.");
        uint16 currentCoins = UserCoins.get(userAddress);
        UserCoins.set(userAddress, currentCoins + coins);
    }

}