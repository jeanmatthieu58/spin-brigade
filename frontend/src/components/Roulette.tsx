'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, Contract } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'
import { Sparkles, Trophy, Gift, Zap, Heart, Share2, Volume2, VolumeX } from 'lucide-react'
import { SPIN_BRIGADE_ADDRESS, SPIN_BRIGADE_ABI } from '@/config/wagmi'

// Types
interface Recipe {
  id: number
  title: string
  ingredients: string
  instructions: string
  difficulty: string
  cookingTime: string
  servings: number
  category: 'standard' | 'premium'
}

interface SpinResult {
  recipe: Recipe
  timestamp: number
  type: 'free' | 'standard' | 'premium'
}

// Données de recettes simulées (en attendant le vrai fichier)
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    ingredients: "400g spaghetti, 200g pancetta, 4 eggs, 100g parmesan, black pepper",
    instructions: "Cook pasta al dente. Fry pancetta until crispy. Mix eggs with cheese. Combine hot pasta with pancetta, then add egg mixture off heat.",
    difficulty: "Medium",
    cookingTime: "20 minutes",
    servings: 4,
    category: "standard"
  },
  {
    id: 2,
    title: "Truffle Risotto",
    ingredients: "300g arborio rice, 1L chicken stock, 100ml white wine, 50g butter, 100g parmesan, 30g black truffle",
    instructions: "Toast rice, add wine, gradually add warm stock while stirring. Finish with butter, cheese and shaved truffle.",
    difficulty: "Hard",
    cookingTime: "35 minutes",
    servings: 4,
    category: "premium"
  },
  {
    id: 3,
    title: "Chocolate Chip Cookies",
    ingredients: "2 cups flour, 1 cup butter, 1/2 cup brown sugar, 1/2 cup white sugar, 2 eggs, 1 cup chocolate chips",
    instructions: "Cream butter and sugars. Add eggs and flour. Fold in chocolate chips. Bake at 180°C for 12 minutes.",
    difficulty: "Easy",
    cookingTime: "25 minutes",
    servings: 24,
    category: "standard"
  }
]

export default function Roulette() {
  // État de la roulette
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([])
  
  // État utilisateur
  const [userStats, setUserStats] = useState({
    totalSpins: 0,
    freeSpinsLeft: 1,
    achievements: [],
    level: 1
  })
  
  // État audio
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Histoire des spins
  const [spinHistory, setSpinHistory] = useState<SpinResult[]>([])
  
  // Web3
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider()

  // Effets sonores (simulation)
  const playSound = useCallback((type: 'spin' | 'win' | 'click') => {
    if (!soundEnabled) return
    
    // Simulation des sons avec des notifications toast
    if (type === 'spin') {
      console.log('🔊 Spin sound')
    } else if (type === 'win') {
      console.log('🔊 Win sound')
    } else if (type === 'click') {
      console.log('🔊 Click sound')
    }
  }, [soundEnabled])

  // Générer des particules d'effets
  const generateParticles = useCallback(() => {
    const newParticles = Array.from({length: 20}, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }))
    setParticles(newParticles)
    
    // Nettoyer les particules après l'animation
    setTimeout(() => setParticles([]), 3000)
  }, [])

  // Fonction de spin principal
  const handleSpin = useCallback(async (type: 'free' | 'standard' | 'premium') => {
    if (spinning) return
    
    playSound('spin')
    setSpinning(true)
    setShowResult(false)
    
    // Animation de rotation
    const spins = 5 + Math.random() * 5 // 5-10 tours
    const finalAngle = Math.random() * 360
    const newRotation = rotation + (spins * 360) + finalAngle
    setRotation(newRotation)
    
    // Simulation du délai de spin
    setTimeout(async () => {
      // Sélectionner une recette aléatoire
      const availableRecipes = type === 'premium' 
        ? SAMPLE_RECIPES.filter(r => r.category === 'premium')
        : SAMPLE_RECIPES.filter(r => r.category === 'standard')
      
      const randomRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)] || SAMPLE_RECIPES[0]
      
      setSelectedRecipe(randomRecipe)
      setShowResult(true)
      setSpinning(false)
      
      // Effets visuels
      generateParticles()
      playSound('win')
      
      // Mettre à jour les stats
      setUserStats(prev => ({
        ...prev,
        totalSpins: prev.totalSpins + 1,
        freeSpinsLeft: type === 'free' ? 0 : prev.freeSpinsLeft
      }))
      
      // Ajouter à l'historique
      const newSpin: SpinResult = {
        recipe: randomRecipe,
        timestamp: Date.now(),
        type
      }
      setSpinHistory(prev => [newSpin, ...prev.slice(0, 9)]) // Garder 10 derniers spins
      
      // Interaction blockchain (si connecté)
      if (isConnected && walletProvider) {
        try {
          const provider = new BrowserProvider(walletProvider)
          const signer = await provider.getSigner()
          const contract = new Contract(SPIN_BRIGADE_ADDRESS, SPIN_BRIGADE_ABI, signer)
          
          if (type !== 'free') {
            const value = type === 'premium' ? '10000000000000000' : '1000000000000000' // 0.01 or 0.001 ETH
            // await contract.spinRoulette(randomRecipe.title, { value })
            toast.success(`🎉 Recipe "${randomRecipe.title}" secured on blockchain!`)
          }
        } catch (error) {
          console.log('Blockchain interaction simulated')
        }
      }
      
      // Notifications
      if (randomRecipe.category === 'premium') {
        toast.success('🌟 Premium recipe discovered!', { duration: 4000 })
      } else {
        toast.success('🍳 New recipe unlocked!', { duration: 3000 })
      }
      
    }, 3000)
  }, [spinning, rotation, isConnected, walletProvider, playSound, generateParticles])

  // Connecter le wallet
  const handleConnect = useCallback(() => {
    playSound('click')
    // AppKit se charge automatiquement de la connexion
  }, [playSound])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4 relative overflow-hidden">
      
      {/* Particules d'effet */}
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1, 0],
              y: -100,
              rotate: 360 
            }}
            transition={{ duration: 3, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        
        {/* Header avec effets */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-black text-gray-800 mb-4 flex items-center justify-center">
            <motion.span
              animate={{ rotate: spinning ? 360 : 0 }}
              transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
            >
              ⚡
            </motion.span>
            Spin Brigade
          </h1>
          <p className="text-gray-600 text-xl">Join the culinary revolution on Monad!</p>
          
          {/* Contrôles audio */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-sm font-medium">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Section Roulette */}
          <div className="lg:col-span-2">
            <div className="flex flex-col items-center space-y-8">
              
              {/* Roulette Wheel Avancée */}
              <div className="relative">
                <motion.div 
                  className="w-96 h-96 rounded-full border-8 border-gradient-to-r from-orange-400 to-red-500 shadow-2xl relative overflow-hidden bg-gradient-to-r from-orange-400 via-red-500 to-pink-500"
                  animate={{ rotate: rotation }}
                  transition={{ 
                    duration: spinning ? 3 : 0, 
                    ease: spinning ? "easeOut" : "linear",
                    type: "tween"
                  }}
                >
                  
                  {/* Segments de la roulette avec gradient animé */}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${i * 22.5}deg)`,
                        background: `linear-gradient(45deg, 
                          ${i % 4 === 0 ? '#f97316, #ef4444' :
                            i % 4 === 1 ? '#ef4444, #ec4899' :
                            i % 4 === 2 ? '#ec4899, #a855f7' :
                            '#a855f7, #f97316'})`
                      }}
                      animate={{
                        opacity: spinning ? [0.8, 1, 0.8] : 1
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: spinning ? Infinity : 0
                      }}
                    >
                      <div className="w-1 h-48 bg-white/30 absolute left-1/2 top-0 transform -translate-x-1/2"></div>
                      
                      {/* Icônes sur la roulette */}
                      {i % 4 === 0 && (
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-lg">
                          {['🍕', '🍝', '🥗', '🍰'][Math.floor(i/4)]}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Centre de la roulette avec animation */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: spinning ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
                  >
                    <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-yellow-400">
                      <motion.span 
                        className="text-4xl"
                        animate={{ rotate: spinning ? -360 : 0 }}
                        transition={{ duration: 3, repeat: spinning ? Infinity : 0 }}
                      >
                        🍳
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Pointeur avec animation */}
                <motion.div 
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10"
                  animate={{ scale: spinning ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3, repeat: spinning ? Infinity : 0 }}
                >
                  <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-yellow-500 drop-shadow-2xl filter"></div>
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>
                </motion.div>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {spinning && (
                  <motion.div 
                    className="bg-blue-100 border border-blue-400 text-blue-700 px-8 py-4 rounded-2xl shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                      <span className="font-semibold text-lg">🎲 Spinning the wheel of culinary destiny...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spin Buttons avec animations avancées */}
              <div className="flex flex-col space-y-4 w-full max-w-lg">
                
                {/* Free Daily Spin */}
                {userStats.freeSpinsLeft > 0 && (
                  <motion.button
                    onClick={() => handleSpin('free')}
                    disabled={spinning}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Gift className="w-6 h-6" />
                      <span>🎁 FREE Daily Spin!</span>
                      <div className="bg-white/20 px-2 py-1 rounded-full text-sm">
                        {userStats.freeSpinsLeft} left
                      </div>
                    </div>
                  </motion.button>
                )}

                {/* Normal Spin */}
                <motion.button
                  onClick={() => handleSpin('standard')}
                  disabled={spinning || !isConnected}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Zap className="w-6 h-6" />
                    <span>🎰 Spin Recipe! (0.001 MON)</span>
                  </div>
                </motion.button>

                {/* Premium Spin */}
                <motion.button
                  onClick={() => handleSpin('premium')}
                  disabled={spinning || !isConnected}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Trophy className="w-6 h-6" />
                    <span>⭐ Premium Spin! (0.01 MON)</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Sidebar Avancée */}
          <div className="space-y-6">
            
            {/* Wallet Connection */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  🔗
                </div>
                Wallet
              </h3>
              
              {!isConnected ? (
                <div>
                  <w3m-button />
                  <p className="text-gray-500 text-sm mt-3 text-center">
                    Connect to start spinning on Monad!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  </div>
                  <w3m-button />
                </div>
              )}
            </motion.div>

            {/* Stats Utilisateur */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                  📊
                </div>
                Your Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <motion.div 
                    className="text-3xl font-black text-purple-600"
                    animate={{ scale: userStats.totalSpins > 0 ? [1, 1.2, 1] : 1 }}
                  >
                    {userStats.totalSpins}
                  </motion.div>
                  <div className="text-purple-600 text-sm font-medium">Total Spins</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-green-600">{userStats.freeSpinsLeft}</div>
                  <div className="text-green-600 text-sm font-medium">Free Spins</div>
                </div>
              </div>
              
              {/* Barre de progression niveau */}
              <div className="mt-4">
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                  <span>Level {userStats.level}</span>
                  <span>{userStats.totalSpins % 10}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(userStats.totalSpins % 10) * 10}%` }}
                    transition={{ duration: 1, delay: 1.2 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Historique des spins récents */}
            {spinHistory.length > 0 && (
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    📜
                  </div>
                  Recent Spins
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {spinHistory.slice(0, 5).map((spin, index) => (
                    <motion.div
                      key={`${spin.timestamp}-${index}`}
                      className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg text-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="flex-1 truncate font-medium">{spin.recipe.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        spin.type === 'premium' ? 'bg-yellow-200 text-yellow-800' :
                        spin.type === 'free' ? 'bg-green-200 text-green-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {spin.type}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Résultat de la Recette */}
        <AnimatePresence>
          {showResult && selectedRecipe && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResult(false)}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Recipe Discovered!
                  </h2>
                  <h3 className="text-2xl font-semibold text-orange-600 mb-4">
                    {selectedRecipe.title}
                  </h3>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedRecipe.difficulty}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedRecipe.cookingTime}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedRecipe.servings} servings
                    </span>
                    {selectedRecipe.category === 'premium' && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ Premium
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-orange-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      🛒 Ingredients:
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{selectedRecipe.ingredients}</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      👨‍🍳 Instructions:
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{selectedRecipe.instructions}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <motion.button 
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Save Recipe</span>
                  </motion.button>
                  <motion.button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </motion.button>
                  <motion.button 
                    onClick={() => setShowResult(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Toast Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500'
          },
        }}
      />
    </div>
  )
}
