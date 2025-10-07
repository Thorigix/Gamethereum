# Gamethereum

**Gamethereum** is next-gen achievement minting platform built on the Ethereum network. It enables people to mint their game achievements as NFT's and make them unforgettable memories with transparency and blockchain-backed trust. With our new Gallery section, smart contract support and wallet integration; users can interact with real on-chain achievements m in a simple, user-friendly interface.

## 🚀 Purpose
Gamethereum turns your in-game achievements into forever NFTs, giving gamers a way to own, showcase, and trade their milestones on the blockchain. No more screenshots or temporary bragging—every victory becomes a verifiable, on-chain memory.

---

# 🏗️ Core Technologies

#### Frontend: 
<code> React + CSS + HTML </code>

#### Smart Contracts: 
<code> Solidity </code>

# 🔑 How to Connect Your Wallet

#### 1- Install the Metamask
#### 2- Disable all other wallets. (You cant connect wallet if you dont disable other wallets.)
#### 3- Click on Connect Wallet. 
#### 4- Grant permission using Metamask pop-up.
<hr> 

#### You'll see a live mock-up of our:

- Live stats in the website.

- Gallery minted nft usernames.

- Some example games and your inventory (half mock up, you are able to see your real nfts)


# 🧪 Development
### 📦 Install dependencies
#### You have to install dependencies and set an .env file for getting ready.
```bash
cd frontend
npm install
```
#### Create .env file
```bash
touch .env
```
#### After creating an .env file 
```bash
source .env
```

# 🚀 Run the project

```bash
cd frontend
```
```bash
npm run dev
```

# 🛠️ Build & deploy on Ethereum network (using Foundry)

### Prepare

Prepare an .env file including ```bash YOUR_PRIVATE_KEY ``` and ```bash YOUR_RPC_URL ```

```bash
forge init MyProject
cd MyProject
```
### Build
#### use src/ to put your contract in it.

```bash
forge build
```

### Deploy
#### Create a script for deploy example:
```bash
script/Deploy.s.sol
```





# 📌 Future Work

- ####   🏆 Mintable achievements from other games.

- ####   🔍 Advenced user, NFT, price, rarity searching system.

- ####   🌍 Deploy to Ethereum mainnet + crosschain service for other networks.

- ####   💸 Rarity selling and buying system based on the number of purchases.

# 🔗 Links:
- 🌐 [Ethereum Developer Docs](https://ethereum.org/developers/docs/)
- 🔧 [Metamask Developer Docs](https://metamask.io/developer)
- 💼 [React Developer Docs](https://react.dev/)

<hr>

##### Gamethereum is developed by the Cony team at ETHIstanbul Hackathon with ❤️,☕ and 🤖.

##### This project awarded from ETHİstanbul prize pool. 💫
