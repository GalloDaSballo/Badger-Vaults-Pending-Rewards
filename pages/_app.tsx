import type { AppProps } from "next/app";
import { Provider, Web3Provider } from "@ethersproject/providers";

import { Web3ReactProvider } from "@web3-react/core";
import Header from "../components/Header";
import { UserContextProvider } from "../context/UserContext";
import "../styles/globals.css";

const getLibrary = (provider: Provider): Web3Provider => {
  return new Web3Provider(provider as any); // this will vary according to whether you use e.g. ethers or web3.js
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <UserContextProvider>
        <Header />
        <Component {...pageProps} />
      </UserContextProvider>
    </Web3ReactProvider>
  );
}
export default MyApp;
