import { useCallback, useEffect, useState } from "react";
import { Contract, BigNumber } from "ethers";
import { User } from "../context/UserContext";

const VAULT_ABI = [
  // Accounts
  "function strategy() external view returns (address)",

  // Harvest info stuff
];

const STRAT_ABI = [
  // Rewards
  "function balanceOfRewards() external view override returns (tuple(address token, uint256 amount)[]  rewards)",
];

const useVaultData = (
  user: User,
  address: string
): [string | null, any[], () => Promise<void>] => {
  const [strategy, setStrategy] = useState<string | null>(null);
  const [rewards, setRewards] = useState<any[]>([]);

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

      const stratContract = new Contract(strat, STRAT_ABI, provider);
      const res = await stratContract.balanceOfRewards();
      setRewards(res);
      console.log("res", res);
    } catch (err) {
      console.log("Exception");
      setStrategy(null);
      setRewards([]);
    }
  }, [user, address]);

  useEffect(() => {
    fetchVaultData();
  }, [fetchVaultData]);

  return [strategy, rewards, fetchVaultData];
};

export default useVaultData;
