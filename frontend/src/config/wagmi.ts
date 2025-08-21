import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, sepolia } from '@reown/appkit/networks'

// Configuration du réseau Monad Testnet
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    public: { http: ['https://testnet-rpc.monad.xyz'] },
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { 
      name: 'Monad Explorer', 
      url: 'https://testnet-explorer.monad.xyz' 
    },
  },
  testnet: true,
}

// Project ID (tu peux utiliser un ID de test pour l'instant)
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'test-project-id'

// Réseaux supportés
const networks = [monadTestnet, mainnet, sepolia]

// Métadonnées de l'app
const metadata = {
  name: 'Spin Brigade',
  description: 'Join the culinary revolution on Monad!',
  url: 'https://spin-brigade.monad.app',
  icons: ['https://spin-brigade.monad.app/logo.png']
}

// Créer l'adaptateur Ethers
const ethersAdapter = new EthersAdapter()

// Créer l'instance AppKit
export const appKit = createAppKit({
  adapters: [ethersAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'x', 'github', 'discord'],
    emailShowWallets: true,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#FF6B35',
    '--w3m-color-mix-strength': 20,
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-border-radius-master': '12px',
  }
})

// Adresse du contrat déployé sur Monad Testnet
export const SPIN_BRIGADE_ADDRESS = '0x510e0b6EE3a2b6E2e9647cC4E295e0FD7081854B' as const

// ABI du contrat SpinBrigade
export const SPIN_BRIGADE_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "recipeName", "type": "string"}],
    "name": "spinRoulette",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserSpins",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "recipeId", "type": "uint256"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "address", "name": "user", "type": "address"},
          {"internalType": "string", "name": "recipeName", "type": "string"}
        ],
        "internalType": "struct SpinBrigade.SpinResult[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "recipeId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "recipeName", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "RecipeSpun",
    "type": "event"
  }
] as const
