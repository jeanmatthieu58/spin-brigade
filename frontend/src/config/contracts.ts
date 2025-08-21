export const SPIN_BRIGADE_ADDRESS = '0x510e0b6EE3a2b6E2e9647cC4E295e0FD7081854B' as const

export const SPIN_BRIGADE_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "recipeName", "type": "string"}],
    "name": "spinRoulette",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "recipeName", "type": "string"}],
    "name": "spinPremiumRoulette", 
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "recipeName", "type": "string"}],
    "name": "dailyFreeSpin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserSpins",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "canDailyFreeSpin",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const SPIN_PRICES = {
  STANDARD: '0.001',
  PREMIUM: '0.01'
} as const

