import { useRouter } from "next/dist/client/router";
import { useUser } from "../context/UserContext";
import useVaultData from "../hooks/UseVaultData";
import styles from "../styles/SingleVaultPage.module.css";

const SingleVaultPage: React.FC = () => {
  const router = useRouter();
  const { address } = router.query;
  const user = useUser();
  const chainId = user?.chainId;

  const [error, strategyAddress, rewards, vaultData, refresher] = useVaultData(
    user,
    address as string
  );

  if (!user) {
    return <div>Pls Connect Metamask</div>;
  }

  return (
    <div className={styles.main}>
      <h1>Vault Info</h1>
      <h1>ChainId: {chainId}</h1>
      <h1>Vault: {address}</h1>
      <button onClick={refresher}>Reload</button>
      {error && <p>Something went wrong, try again</p>}
      {vaultData?.length > 0 && (
        <section className={styles.container}>
          {vaultData.map((data) => (
            <p>{data}</p>
          ))}
        </section>
      )}
      {strategyAddress && (
        <div className={styles.container}>
          <h2>Found Data for Strategy {strategyAddress}</h2>
          <h3>Raw Pending Rewards Data</h3>
          <p>
            <i>These are rewards the strategy will claim at next harvest</i>
          </p>
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
      <em>Data with a Dot is Formatted by token decimals</em>
    </div>
  );
};

export default SingleVaultPage;
