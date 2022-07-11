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
        <h1>Step 2: Add a Vault Address to Visualize Vault Info</h1>

        <p>
          Ideally we can build the query for you here, or you know, just create
          the url
        </p>
      </main>
    </div>
  );
};

export default Home;
