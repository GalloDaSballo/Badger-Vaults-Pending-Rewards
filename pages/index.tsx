import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>
          Step 1: Unlock Metamask (Data is directly from your RPC, no
          intermediaries)
        </h1>
        <h1>Step 2: Add the address of the vault to the url</h1>
      </main>
    </div>
  );
};

export default Home;
