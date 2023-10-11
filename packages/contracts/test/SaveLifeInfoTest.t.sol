// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/store/src/MudTest.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { CellulaLife, CellulaLifeData } from "../src/codegen/Tables.sol";

contract SaveLifeInfoTest is MudTest {
    IWorld world;

    function setUp() public override {
        super.setUp();
        world = IWorld(worldAddress);
    }

    function testAddData() public {

        world.saveLifeInfo(1,2,3,"A&1,B&2,C&3");

        CellulaLifeData memory lifeData = CellulaLife.get(1);
        console.log("attack",lifeData.attack);
        console.log("viewRange",lifeData.viewRange);
        console.log("moveRule",lifeData.moveRule);
        world.saveLifeInfo(1,5,8,"A&1,B&2,C&3");
        CellulaLifeData memory lifeData2 = CellulaLife.get(1);
        console.log("new-attack",lifeData2.attack);
        console.log("new-viewRange",lifeData2.viewRange);
        console.log("new-moveRule",lifeData2.moveRule);

        CellulaLifeData memory data11=world.lifeInfo(1);
        console.log("dataInfo-attack",data11.attack);
    }

}
