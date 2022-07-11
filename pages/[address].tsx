import { useRouter } from "next/dist/client/router";
import { useUser } from "../context/UserContext";
import useVaultData from "../hooks/UseVaultData";

const SingleVaultPage: React.FC = () => {
  const router = useRouter();
  const { address } = router.query;
  const user = useUser();
  const chainId = user?.chainId;

  const [strategyAddress, rewards, refresher] = useVaultData(
    user,
    address as string
  );

  if (!user) {
    return <div>Pls Connect Metamask</div>;
  }

  return (
    <div>
      <h1>Single Vault</h1>
      <h1>ChainId: {chainId}</h1>
      <h1>Address: {address}</h1>
      <button onClick={refresher}>Reload</button>
      {strategyAddress && (
        <div>
          <h2>Found Data for Strategy {strategyAddress}</h2>
          {rewards.map((r) => (
            <div>
              <b>{r[0]}</b>: {String(r[1])}
            </div>
          ))}
        </div>
      )}

      <hr />

      <em>All data RAW, all data from onChain, all data requires metamask</em>
      <em>Note: Update Periodically to be able to figure out APR over time</em>
    </div>
  );
};

export default SingleVaultPage;