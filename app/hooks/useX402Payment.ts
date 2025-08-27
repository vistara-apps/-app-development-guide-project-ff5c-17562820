"use client";

import { useState, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { createX402Client } from 'x402-axios';
import { base } from 'wagmi/chains';
import { PaymentStatus } from '../lib/types';

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

interface PaymentState {
  status: PaymentStatus;
  approvalTxHash?: string;
  paymentTxHash?: string;
  errorMessage?: string;
}

export function useX402Payment() {
  const { data: walletClient } = useWalletClient();
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: 'initial',
  });

  // Reset payment state
  const resetPaymentState = useCallback(() => {
    setPaymentState({
      status: 'initial',
    });
  }, []);

  // Check USDC balance
  const checkUSDCBalance = useCallback(async (address: string): Promise<number> => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      // Create x402 client
      const x402Client = createX402Client({
        chainId: base.id,
        walletClient,
      });

      // Get USDC balance
      const balanceResponse = await x402Client.getTokenBalance({
        tokenAddress: USDC_CONTRACT_ADDRESS,
        walletAddress: address,
      });

      // Convert from wei to USDC (6 decimals)
      return Number(balanceResponse) / 1_000_000;
    } catch (error) {
      console.error('Error checking USDC balance:', error);
      throw error;
    }
  }, [walletClient]);

  // Approve USDC spending
  const approveUSDC = useCallback(async (amount: number, recipientAddress: string): Promise<string> => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      setPaymentState({
        status: 'approving',
      });

      // Create x402 client
      const x402Client = createX402Client({
        chainId: base.id,
        walletClient,
      });

      // Convert amount to wei (USDC has 6 decimals)
      const amountInWei = BigInt(Math.floor(amount * 1_000_000));

      // Approve USDC spending
      const approvalTx = await x402Client.approveToken({
        tokenAddress: USDC_CONTRACT_ADDRESS,
        spenderAddress: recipientAddress,
        amount: amountInWei,
      });

      setPaymentState({
        status: 'approved',
        approvalTxHash: approvalTx.hash,
      });

      return approvalTx.hash;
    } catch (error) {
      console.error('Error approving USDC:', error);
      setPaymentState({
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Failed to approve USDC',
      });
      throw error;
    }
  }, [walletClient]);

  // Make USDC payment
  const payUSDC = useCallback(async (amount: number, recipientAddress: string): Promise<string> => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    try {
      setPaymentState({
        ...paymentState,
        status: 'paying',
      });

      // Create x402 client
      const x402Client = createX402Client({
        chainId: base.id,
        walletClient,
      });

      // Convert amount to wei (USDC has 6 decimals)
      const amountInWei = BigInt(Math.floor(amount * 1_000_000));

      // Transfer USDC
      const paymentTx = await x402Client.transferToken({
        tokenAddress: USDC_CONTRACT_ADDRESS,
        recipientAddress,
        amount: amountInWei,
      });

      setPaymentState({
        status: 'completed',
        approvalTxHash: paymentState.approvalTxHash,
        paymentTxHash: paymentTx.hash,
      });

      return paymentTx.hash;
    } catch (error) {
      console.error('Error paying with USDC:', error);
      setPaymentState({
        ...paymentState,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Failed to make USDC payment',
      });
      throw error;
    }
  }, [walletClient, paymentState]);

  // Complete payment flow (approve and pay)
  const completePayment = useCallback(async (amount: number, recipientAddress: string): Promise<{
    approvalTxHash: string;
    paymentTxHash: string;
  }> => {
    try {
      // First approve the spending
      const approvalTxHash = await approveUSDC(amount, recipientAddress);
      
      // Then make the payment
      const paymentTxHash = await payUSDC(amount, recipientAddress);
      
      return {
        approvalTxHash,
        paymentTxHash,
      };
    } catch (error) {
      console.error('Error completing payment:', error);
      throw error;
    }
  }, [approveUSDC, payUSDC]);

  return {
    paymentState,
    resetPaymentState,
    checkUSDCBalance,
    approveUSDC,
    payUSDC,
    completePayment,
  };
}

