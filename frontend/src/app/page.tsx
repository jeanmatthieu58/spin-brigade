'use client'

import { useState } from 'react'
import { useWalletConnection } from '../components/Web3Provider'

const RECIPES = [
  { id: 1, name: "Spaghetti Carbonara", emoji: "🍝" },
  { id: 2, name: "Chocolate Chip Cookies", emoji: "🍪" },
  { id: 3, name: "Beef Tacos", emoji: "🌮" },
  { id: 4, name: "Caesar Salad", emoji: "🥗" }
]

export default function Home() {
  const [spinning, setSpinning] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const { address, isConnected, isConnecting, connectWallet } = useWalletConnection()

  const handleSpin = () => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }
    
    setSpinning(true)
    setShowResult(false)
    
    setTimeout(() => {
      const randomRecipe = RECIPES[Math.floor(Math.random() * RECIPES.length)]
      setSelectedRecipe(randomRecipe)
      setShowResult(true)
      setSpinning(false)
    }, 3000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff7ed, #fce7e7)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>
        ⚡ Spin Brigade
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '3rem', color: '#6b7280' }}>
        Join the culinary revolution on Monad!
      </p>

      <div style={{ marginBottom: '3rem' }}>
        {!isConnected ? (
          <div>
            <p>🔓 Wallet not connected</p>
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              style={{
                background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: isConnecting ? 'not-allowed' : 'pointer',
                opacity: isConnecting ? 0.7 : 1
              }}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: '#22c55e' }}>
              ✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        )}
      </div>

      <div style={{
        width: '300px',
        height: '300px',
        background: 'linear-gradient(45deg, #fb923c, #ef4444)',
        borderRadius: '50%',
        margin: '0 auto 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '4rem'
      }}>
        🍳
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || !isConnected}
        style={{
          background: isConnected ? 'linear-gradient(90deg, #9333ea, #ec4899)' : 'gray',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '2rem',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: (spinning || !isConnected) ? 'not-allowed' : 'pointer',
          opacity: (spinning || !isConnected) ? 0.7 : 1
        }}
      >
        {spinning ? 'Spinning...' : 'Spin Recipe!'}
      </button>

      {showResult && selectedRecipe && (
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '1rem',
          maxWidth: '400px',
          margin: '3rem auto 0'
        }}>
          <h2>🎉 Recipe Discovered!</h2>
          <div style={{ fontSize: '3rem', margin: '1rem 0' }}>
            {selectedRecipe.emoji}
          </div>
          <h3>{selectedRecipe.name}</h3>
        </div>
      )}
    </div>
  )
}
