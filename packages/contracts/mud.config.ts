import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      schema: "uint32",
    },
    CellulaLife:{
      keySchema: {
        tokenId:"uint256",
      },
      schema: {
        viewRange:"uint8",
        attack:"uint8",
        moveRule:"string",
      },
    },
    UserCoins:{
      keySchema: {
        ethAddress:"address",
      },
      schema: {
        coins:"uint16",
      },
    },
  },
});
