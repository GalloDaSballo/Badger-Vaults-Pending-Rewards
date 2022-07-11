import { useCallback, useEffect, useState } from "react";
import { Contract, BigNumber, utils } from "ethers";
import { User } from "../context/UserContext";

const VAULT_ABI = [
  // Accounts
  "function strategy() external view returns (address)",
  "function name() external view returns (string)",

  // Harvest info stuff
  "function balance() external view returns (uint256)",
  "function assetsAtLastHarvest() external view returns (uint256)",
  "function lastHarvestAmount() external view returns (uint256)",
  "function lastHarvestedAt() external view returns (uint256)",
];

const STRAT_ABI = [
  // Rewards
  "function balanceOfRewards() external view override returns (tuple(address token, uint256 amount)[]  rewards)",
];

const useVaultData = (
  user: User,
  address: string
): [boolean, string | null, any[], any[], () => Promise<void>] => {
  const [error, setError] = useState<boolean>(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [vaultData, setVaultData] = useState<any[]>([]);

  const fetchVaultData = useCallback(async () => {
    if (!user) {
      return; // Cannot do anything
    }
    try {
      const { provider } = user;

      const vaultContract = new Contract(address, VAULT_ABI, provider);
      console.log("vaultContract", vaultContract);
      const strat = await vaultContract.strategy();
      console.log("strat", strat);
      setStrategy(strat);

      const name = await vaultContract.name();
      const balance: BigNumber = await vaultContract.balance();
      const assetsAtLastHarvest: BigNumber = await vaultContract.assetsAtLastHarvest();
      const lastHarvestAmount: BigNumber = await vaultContract.lastHarvestAmount();
      const lastHarvestedAt: BigNumber = await vaultContract.lastHarvestedAt();
      const tempVaultData = [
        name,
        `Current Balance ${balance}`,
        `lastHarvestedAt ${lastHarvestedAt}`,
        `lastHarvestAmount ${lastHarvestAmount}`,
        `assetsAtLastHarvest ${assetsAtLastHarvest}`,
      ];
      setVaultData(tempVaultData);

      const stratContract = new Contract(strat, STRAT_ABI, provider);
      const res = await stratContract.balanceOfRewards();
      setRewards(res);
      setError(false);
      console.log("res", res);
    } catch (err) {
      console.log("Exception");
      setStrategy(null);
      setRewards([]);
      setVaultData([]);
      setError(true);
    }
  }, [user, address]);

  useEffect(() => {
    fetchVaultData();
  }, [fetchVaultData]);

  return [error, strategy, rewards, vaultData, fetchVaultData];
};

export default useVaultData;
