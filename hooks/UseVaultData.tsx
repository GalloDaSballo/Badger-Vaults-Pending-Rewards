import { useCallback, useEffect, useState } from "react";
import { Contract, BigNumber, utils } from "ethers";
import { User } from "../context/UserContext";

const VAULT_ABI = [
  // Accounts
  "function strategy() external view returns (address)",
  "function name() external view returns (string)",
  "function token() external view returns (address)",

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

const TOKEN_ABI = ["function decimals() external view returns (uint256)"];

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
      const strat = await vaultContract.strategy();
      setStrategy(strat);

      // Get Basic Vault Data
      const name = await vaultContract.name();
      const balance: BigNumber = await vaultContract.balance();

      // Get Want Decimals
      const token = await vaultContract.token();
      const tokenContract = new Contract(token, TOKEN_ABI, provider);
      const wantDecimals = await tokenContract.decimals();

      // Get harvest data
      const assetsAtLastHarvest: BigNumber = await vaultContract.assetsAtLastHarvest();
      const lastHarvestAmount: BigNumber = await vaultContract.lastHarvestAmount();
      const lastHarvestedAt: BigNumber = await vaultContract.lastHarvestedAt();
      const tempVaultData = [
        name,
        `Current Balance ${utils.formatUnits(balance, wantDecimals)}`,
        `lastHarvestedAt ${lastHarvestedAt}`,
        `lastHarvestAmount ${utils.formatUnits(
          lastHarvestAmount,
          wantDecimals
        )}`,
        `assetsAtLastHarvest ${utils.formatUnits(
          assetsAtLastHarvest,
          wantDecimals
        )}`,
      ];
      setVaultData(tempVaultData);

      const stratContract = new Contract(strat, STRAT_ABI, provider);
      let res = await stratContract.balanceOfRewards();

      res = await Promise.all(
        res.map(async ([addy, amount]) => {
          const tC = new Contract(addy, TOKEN_ABI, provider);
          const decimals = await tC.decimals();

          return [addy, utils.formatUnits(amount, decimals)];
        })
      );

      setRewards(res);
      setError(false);
    } catch (err) {
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
