# Spin Brigade 🍽️

> **Gamified recipe discovery dApp on Monad blockchain**

Spin Brigade is a Web3 application that brings culinary exploration on-chain. Users discover, collect, and engage with professional recipes through a gamified spin mechanic — rewarding curiosity, building food culture, and connecting chefs with their audience in a decentralized way.

---

## What It Does

Spin Brigade turns recipe discovery into an interactive experience:

- **Spin to discover** — users spin to unlock a random professional recipe from the curated database
- **Collect recipes** — discovered recipes are minted as on-chain collectibles, owned by the user
- **Chef reputation system** — chefs earn on-chain reputation based on engagement with their recipes
- **Brigade mechanics** — users form brigades (groups) around culinary themes, competing for leaderboard positions

---

## Why Monad

Monad's high-throughput, EVM-compatible architecture makes it ideal for a recipe dApp where every spin, every collection, and every brigade interaction needs to be fast and cheap enough for real consumer use. Gas costs on Ethereum mainnet would kill the UX. Monad makes micro-interactions viable.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart contracts | Solidity (EVM-compatible, deployed on Monad testnet) |
| Frontend | TypeScript, React |
| Blockchain interaction | ethers.js |
| Deployment | Shell scripts (Monad testnet) |

**Repository breakdown:** TypeScript 70% · Solidity 22.5% · Shell 6.6%

---

## Project Structure

```
spin-brigade/
├── contracts/          # Solidity smart contracts
├── frontend/           # TypeScript/React frontend
├── scripts/            # Deployment and utility scripts
└── src/
    └── components/     # UI components
```

---

## Contracts

The core smart contract handles:
- Recipe NFT minting on discovery
- Spin mechanics with randomness
- Brigade formation and membership
- On-chain chef reputation scoring

---

## Part of a Larger Ecosystem

Spin Brigade is the on-chain discovery layer of a broader food × AI × Web3 project.

The complementary piece is **My Chef Agent Cooker** — an AI agent running on Venice.ai, trained on a private database of 215 professional French haute cuisine recipes developed over 20 years in Michelin-starred kitchens and Parisian palace hotels.

Together, the two projects form a complete stack:
- **My Chef Agent Cooker** → AI layer (precise culinary knowledge, private inference)
- **Spin Brigade** → on-chain layer (ownership, gamification, community)

The long-term vision: recipes discovered through Spin Brigade can be queried in depth through the AI agent, creating a loop between on-chain ownership and professional culinary knowledge.

---

## Status

- Smart contracts: developed and tested on Monad testnet
- Frontend: functional prototype
- Live testnet deployment: in progress

---

## Builder

Senior Chef de Cuisine, 20+ years in Michelin-starred restaurants and Parisian palace hotels. Building at the intersection of professional culinary knowledge, AI, and Web3.

- AI Agent: [My Chef Agent Cooker on Venice.ai](https://app.venice.ai)
- Contact: grahamkeyssel@gmail.com

---

*Built on Monad — Fast enough for a kitchen.*
