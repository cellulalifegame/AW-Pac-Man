import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { BrowserRouter } from "react-router-dom";
import GetRouters from "./router"
import "./App.scss"
import './styles/font-family/font.css'
import 'amfe-flexible/index.js'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { optimismGoerli } from "wagmi/chains"
import { configureChains, createConfig, WagmiConfig, Chain } from 'wagmi'

export const nexi = {
    id: 42_42,
    name: 'Nexi',
    network: 'nexi',
    nativeCurrency: {
        decimals: 18,
        name: 'Nexi',
        symbol: 'NEXI',
    },
    rpcUrls: {
        public: { http: ['https://follower.testnet-chain.linfra.xyz'] },
        default: { http: ['https://chain.nexilix.com'] },
    },
    blockExplorers: {
        etherscan: { name: 'Otterscan', url: 'https://explorer.testnet-chain.linfra.xyz' },
        default: { name: 'Otterscan', url: 'https://explorer.testnet-chain.linfra.xyz' },
    }
} as const satisfies Chain
export const App = () => {
  const {
    components: { Counter },
    systemCalls: { increment },
  } = useMUD();
    const chains = [optimismGoerli]
    const projectId = '8b3fa7c95ab1c2257bfe4a9cd850ca57'

    const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
    const wagmiConfig = createConfig({
        autoConnect: true,
        connectors: w3mConnectors({ projectId, chains }),
        publicClient
    })
    const ethereumClient = new EthereumClient(wagmiConfig, chains)
  const counter = useComponentValue(Counter, singletonEntity);

  return (
      <>
          <WagmiConfig config={wagmiConfig}>
              <div>
                  <BrowserRouter>
                      <GetRouters />
                  </BrowserRouter>
              </div>
          </WagmiConfig>
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </>
  );
};
