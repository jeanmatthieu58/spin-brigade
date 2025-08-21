'use client'

import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { SPIN_BRIGADE_ADDRESS, SPIN_BRIGADE_ABI, SPIN_PRICES } from '@/config/contracts'
import { useState } from 'react'

export function useSpinBrigade() {
  const { address, isConnected, chainId } = useAccount()
  const [isSpinning, setIsSpinning] = useState(false)
  
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, error } = useWaitForTransactionReceipt({ hash })

  const { data: userSpins } = useReadContract({
    address: SPIN_BRIGADE_ADDRESS,
    abi: SPIN_BRIGADE_ABI,
    functionName: 'getUserSpins',
    args: address ? [address] : undefined,
  }) as { data: bigint | undefined }

  const { data: canFreeSpin } = useReadContract({
    address: SPIN_BRIGADE_ADDRESS,
    abi: SPIN_BRIGADE_ABI,
    functionName: 'canDailyFreeSpin',
    args: address ? [address] : undefined,
  }) as { data: boolean | undefined }

  const isOnMonadTestnet = chainId === 10143

  const spinStandard = async (recipeName: string) => {
    if (!isConnected || !isOnMonadTestnet) return
    
    try {
      setIsSpinning(true)
      await writeContract({
        address: SPIN_BRIGADE_ADDRESS,
        abi: SPIN_BRIGADE_ABI,
        functionName: 'spinRoulette',
        args: [recipeName],
        value: parseEther(SPIN_PRICES.STANDARD),
      })
    } catch (error) {
      console.error('Spin error:', error)
      setIsSpinning(false)
    }
  }

  const spinPremium = async (recipeName: string) => {
    if (!isConnected || !isOnMonadTestnet) return
    
    try {
      setIsSpinning(true)
      await writeContract({
        address: SPIN_BRIGADE_ADDRESS,
        abi: SPIN_BRIGADE_ABI,
        functionName: 'spinPremiumRoulette',
        args: [recipeName],
        value: parseEther(SPIN_PRICES.PREMIUM),
      })
    } catch (error) {
      console.error('Premium spin error:', error)
      setIsSpinning(false)
    }
  }

  const spinFree = async (recipeName: string) => {
    if (!isConnected || !isOnMonadTestnet || !canFreeSpin) return
    
    try {
      setIsSpinning(true)
      await writeContract({
        address: SPIN_BRIGADE_ADDRESS,
        abi: SPIN_BRIGADE_ABI,
        functionName: 'dailyFreeSpin',
        args: [recipeName],
      })
    } catch (error) {
      console.error('Free spin error:', error)
      setIsSpinning(false)
    }
  }

  if (isSuccess && isSpinning) {
    setIsSpinning(false)
  }

  if (error && isSpinning) {
    setIsSpinning(false)
  }

  return {
    address,
    isConnected,
    isOnMonadTestnet,
    isSpinning: isSpinning || isPending || isConfirming,
    hash,
    isSuccess,
    error,
    userSpins: userSpins ? Number(userSpins) : 0,
    canFreeSpin: canFreeSpin ?? true,
    spinStandard,
    spinPremium,
    spinFree,
  }
}
