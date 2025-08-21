#!/bin/bash

echo "🚀 INSTALLATION DE SPIN BRIGADE"
echo "==============================="

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé !"
    echo "📥 Télécharge-le ici : https://nodejs.org"
    echo "🎯 Choisis la version LTS"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé !"
    exit 1
fi

echo "✅ Node.js et npm détectés !"

# Créer la structure
echo "📁 Création des dossiers..."
mkdir -p contracts/{src,script,test}
mkdir -p frontend/src/{app,components,hooks,config,data}
mkdir -p scripts

# Créer le smart contract
echo "📝 Création du smart contract..."
cat > contracts/src/SpinBrigade.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SpinBrigade {
    struct SpinResult {
        uint256 recipeId;
        uint256 timestamp;
        address user;
        string recipeName;
    }
    
    mapping(address => SpinResult[]) public userSpins;
    mapping(address => uint256) public spinCount;
    
    uint256 public totalRecipes = 5000;
    uint256 public spinPrice = 0.001 ether;
    uint256 public totalSpins = 0;
    
    event RecipeSpun(
        address indexed user, 
        uint256 recipeId, 
        string recipeName,
        uint256 timestamp
    );
    
    function spinRoulette(string memory recipeName) external payable {
        require(msg.value >= spinPrice, "Insufficient payment");
        
        uint256 recipeId = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            blockhash(block.number - 1),
            totalSpins
        ))) % totalRecipes + 1;
        
        SpinResult memory newSpin = SpinResult({
            recipeId: recipeId,
            timestamp: block.timestamp,
            user: msg.sender,
            recipeName: recipeName
        });
        
        userSpins[msg.sender].push(newSpin);
        spinCount[msg.sender]++;
        totalSpins++;
        
        emit RecipeSpun(msg.sender, recipeId, recipeName, block.timestamp);
    }
    
    function getUserSpins(address user) external view returns (SpinResult[] memory) {
        return userSpins[user];
    }
}
EOF

# Créer package.json racine
echo "📦 Création package.json..."
cat > package.json << 'EOF'
{
  "name": "spin-brigade",
  "version": "1.0.0",
  "description": "Join the culinary revolution on Monad!",
  "scripts": {
    "setup": "echo '✅ Projet créé avec succès !'",
    "frontend:install": "cd frontend && npm install",
    "frontend:dev": "cd frontend && npm run dev"
  }
}
EOF

# Créer le package.json frontend
echo "🎨 Création frontend..."
cat > frontend/package.json << 'EOF'
{
  "name": "spin-brigade-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "wagmi": "^2.0.0",
    "viem": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0"
  }
}
EOF

# Créer une page d'accueil simple
mkdir -p frontend/src/app
cat > frontend/src/app/page.tsx << 'EOF'
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          ⚡ Spin Brigade
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Join the culinary revolution on Monad!
        </p>
        <div className="text-4xl mb-4">🍳</div>
        <p className="text-gray-500">
          Frontend en cours de développement...
        </p>
      </div>
    </div>
  )
}
EOF

# Instructions finales
echo ""
echo "🎉 INSTALLATION TERMINÉE !"
echo "========================="
echo ""
echo "📋 Prochaines étapes :"
echo "1️⃣  cd frontend && npm install"
echo "2️⃣  npm run dev"
echo "3️⃣  Ouvrir http://localhost:3000"
echo ""
echo "🚀 Ton projet Spin Brigade est prêt !"

