import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldContract, waitForTransaction }: SetupNetworkResult,
  { Counter, CellulaLife }: ClientComponents
) {
  const increment = async () => {
    const tx = await worldContract.write.increment();
    await waitForTransaction(tx);
    return getComponentValue(Counter, singletonEntity);
  };
  const saveLifeInfo = async (tokenId: number, viewRange: number, attack: number, moveRule: string) => {
    console.log(tokenId);
    const tx = await worldContract.write.saveLifeInfo([tokenId,viewRange,attack,moveRule]);
    await waitForTransaction(tx);
    return getComponentValue(CellulaLife, singletonEntity);
  }
  return {
    increment,
    saveLifeInfo
  };
}
