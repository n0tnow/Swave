# 🌊 SWAVE - Next-Generation DeFi Super-App on Stellar

[![Stellar](https://img.shields.io/badge/Stellar-Soroban-blue)](https://stellar.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB)](https://reactjs.org/)
[![Rust](https://img.shields.io/badge/Rust-Smart%20Contracts-orange)](https://www.rust-lang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Unifying fragmented DeFi services into one intelligent Stellar platform, solving inefficient swaps, poor risk management, and complex UX through AI-powered routing and intuitive design.**

## 🚀 Overview

SWAVE is a comprehensive DeFi ecosystem built on Stellar blockchain that combines intelligent swap routing, advanced credit scoring, liquidity mining, and risk management into a single, user-friendly platform. With 9 interconnected smart contracts and an intuitive frontend, SWAVE makes advanced DeFi accessible to everyone.

## 🎥 Demo

- **Live Demo**: [https://swave-defi.vercel.app](https://swave-sigma.vercel.app)
- **Demo Video**: [YouTube Link]()
- **Pitch Deck**: [View Presentation](https://www.canva.com/design/DAGrFeEKdSw/0LPL2W6ebiAXS0ZSOouNaQ/edit?utm_content=DAGrFeEKdSw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## ✨ Key Features

### 🔄 Intelligent Swap Engine
- **Dijkstra-based routing** for optimal swap paths
- Multi-hop swaps with minimal slippage
- Real-time price feeds via oracle integration
- Dynamic fee optimization

### 📊 Advanced Credit System
- **ML-inspired credit scoring** based on on-chain behavior
- 90+ day wallet age bonus system
- Asset diversity analysis (3+ assets = bonus points)
- Transaction volume-based tier system

### 💧 Liquidity Mining
- Multi-asset liquidity pools
- Automated yield farming strategies
- Compound rewards mechanism
- Real-time APY calculations

### ⚖️ Risk Management
- Portfolio diversification analysis
- Volatility scoring algorithms
- Real-time risk monitoring
- Liquidation protection mechanisms

## 🏗️ Architecture

### Smart Contracts (9 Modules)
All contracts deployed on **Stellar Soroban Testnet**:

```
📦 SWAVE Contract Network
├── 🔄 swave-swap          # Intelligent swap router
├── 📡 swave-oracle        # Price feed aggregator  
├── 💧 swave-liquidity     # Pool management
├── 🏦 swave-loan          # Lending protocol
├── 🔒 swave-collateral    # Multi-asset collateral
├── 📈 swave-credit-score  # Advanced scoring system
├── 💰 swave-fee-manager   # Dynamic fee optimization
├── 🗳️ swave-multisig      # Governance system
└── 💾 swave-storage-manager # Data management
```

### Frontend Stack
- **React.js/Next.js** with Material-UI
- **Framer Motion** for smooth animations
- **Chart.js/Recharts** for data visualization
- **Real-time analytics** dashboard
- **Mobile-responsive** design

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Stellar CLI (for contract interaction)

### Clone Repository
```bash
git clone https://github.com/your-username/swave-defi.git
cd swave-defi
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Smart Contract Setup
```bash
# Install Soroban CLI
cargo install --locked soroban-cli

# Build contracts
cd contracts
cargo build --target wasm32-unknown-unknown --release

# Deploy contracts (testnet)
soroban contract deploy --source account --network testnet --wasm target/wasm32-unknown-unknown/release/swave_swap.wasm
```

## 🌐 Deployed Contracts

**Network**: Stellar Soroban Testnet  
**Deployer**: `GCJC5WWUULXBEBUCTOLQ2S7NRCRX3X3IL75XMDKLAEJ5MUKT4XUFU4EU`

| Contract | Address |
|----------|---------|
| Swap | `CD5FDLAZX3VCDCIMDUB2D5EFWAQJ4IHV4HU66YK6R6CZWK4VZBZPJX5U` |
| Oracle | `CAN6CUQ5YOV3YKGOOB5WJCFAAJXOHQWIE6LTJGR22DSEVLJLQGXJAOLX` |
| Liquidity | `CBYIJBUIXV5JKJYYOUNCL3TNP2VRB3NPHPJPNRWVM4EN7FOZJWREH54U` |
| Loan | `CB5Q2J2LGHSHPPZGNHHQZ46Q3BTM5RTZWDMVOYQ7BMVSUOIH5OOOHXS3` |
| Credit Score | `CAMQZZ5FMDFKMBQ3M7DAGJBZ3F5FCBNUDBUGM3XHGCDD5BBA6VDNPTLH` |

*Full contract list available in `contract-addresses.json`*

## 🎯 Usage

### 1. Connect Wallet
- Support for Freighter, Albedo, and other Stellar wallets
- Testnet configuration for demo purposes

### 2. Swap Tokens
```javascript
// Example swap operation
const swapResult = await swapRouter.executeSwap({
  tokenIn: 'XLM',
  tokenOut: 'USDC', 
  amountIn: 100,
  slippage: 0.5
});
```

### 3. Provide Liquidity
- Choose from available pools
- Add liquidity with automatic optimal ratio calculation
- Start earning rewards immediately

### 4. Access Credit Services
- Check your credit score based on on-chain activity
- Apply for loans with competitive rates
- Manage collateral positions

## 📊 Demo Data

**Note**: This MVP uses mock data for demonstration purposes, which is standard practice for hackathon projects and prototypes. The smart contracts are fully functional on testnet.

### Sample Portfolio Data
- Total Value: $12,456
- Asset Allocation: XLM (40%), USDC (35%), AQUA (25%)
- Credit Score: 8.5/10
- Active Positions: 3 liquidity pools


## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run smart contract tests
cd contracts
cargo test
```


## 💡 Innovation Highlights

- **First comprehensive DeFi suite** on Stellar Soroban
- **AI-powered risk assessment** and credit scoring
- **Unified UX** for complex DeFi operations
- **Cross-contract optimization** algorithms
- **Real-time analytics** and insights


**Built with ❤️ on Stellar blockchain**

*Democratizing DeFi, one swap at a time.*
