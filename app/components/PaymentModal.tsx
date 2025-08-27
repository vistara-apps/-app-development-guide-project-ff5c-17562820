"use client";

import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { UserAvatar } from "./ui/UserAvatar";
import { useX402Payment } from "../hooks/useX402Payment";
import { User, Expense, PaymentStatus } from "../lib/types";
import { formatCurrency } from "../utils/formatting";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense;
  paidByUser: User;
  currentUser: User;
  userSplitAmount: number;
  onPaymentComplete: (paymentData: {
    approvalTxHash: string;
    paymentTxHash: string;
  }) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  expense,
  paidByUser,
  currentUser,
  userSplitAmount,
  onPaymentComplete,
}: PaymentModalProps) {
  const {
    paymentState,
    resetPaymentState,
    checkUSDCBalance,
    completePayment,
  } = useX402Payment();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset payment state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetPaymentState();
      setBalance(null);
      setIsLoading(false);
    }
  }, [isOpen, resetPaymentState]);

  // Check USDC balance when modal opens
  useEffect(() => {
    if (isOpen && currentUser.baseWalletAddress) {
      const fetchBalance = async () => {
        try {
          setIsLoading(true);
          const userBalance = await checkUSDCBalance(currentUser.baseWalletAddress);
          setBalance(userBalance);
        } catch (error) {
          console.error("Error fetching balance:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBalance();
    }
  }, [isOpen, currentUser.baseWalletAddress, checkUSDCBalance]);

  // Handle payment
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const result = await completePayment(
        userSplitAmount,
        paidByUser.baseWalletAddress
      );
      
      onPaymentComplete(result);
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render payment status
  const renderPaymentStatus = () => {
    switch (paymentState.status) {
      case 'initial':
        return (
          <div className="text-center py-2">
            Ready to make payment
          </div>
        );
      case 'approving':
        return (
          <div className="flex items-center justify-center space-x-2 py-2 text-primary">
            <Loader2 className="animate-spin" size={20} />
            <span>Approving USDC...</span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center justify-center space-x-2 py-2 text-primary">
            <CheckCircle size={20} />
            <span>USDC Approved</span>
          </div>
        );
      case 'paying':
        return (
          <div className="flex items-center justify-center space-x-2 py-2 text-primary">
            <Loader2 className="animate-spin" size={20} />
            <span>Processing payment...</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center justify-center space-x-2 py-2 text-green-500">
            <CheckCircle size={20} />
            <span>Payment completed!</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center py-2 text-red-500">
            <div className="flex items-center space-x-2">
              <XCircle size={20} />
              <span>Payment failed</span>
            </div>
            {paymentState.errorMessage && (
              <div className="text-sm mt-1">{paymentState.errorMessage}</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const insufficientBalance = balance !== null && balance < userSplitAmount;
  const canPay = !isLoading && 
                 !insufficientBalance && 
                 paymentState.status !== 'approving' && 
                 paymentState.status !== 'paying' &&
                 paymentState.status !== 'completed';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pay Expense">
      <div className="space-y-4">
        <div className="bg-bg p-4 rounded-md">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">{expense.description}</div>
            <div className="text-heading">{formatCurrency(expense.amount)}</div>
          </div>
          
          <div className="flex items-center space-x-3 mb-3">
            <UserAvatar user={paidByUser} size="sm" />
            <div>
              <div className="text-sm font-medium">{paidByUser.displayName}</div>
              <div className="text-xs text-text-secondary">Paid the bill</div>
            </div>
          </div>
          
          <div className="border-t border-border pt-3">
            <div className="flex justify-between items-center">
              <div className="text-sm">Your share:</div>
              <div className="font-medium">{formatCurrency(userSplitAmount)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-bg p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Your USDC Balance:</div>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <div className="font-medium">
                {balance !== null ? formatCurrency(balance) : "Not available"}
              </div>
            )}
          </div>
          
          {insufficientBalance && (
            <div className="flex items-center space-x-2 text-red-500 text-sm mt-2">
              <AlertCircle size={16} />
              <span>Insufficient balance for this payment</span>
            </div>
          )}
        </div>
        
        {renderPaymentStatus()}
        
        <div className="flex space-x-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading && paymentState.status !== 'completed' && paymentState.status !== 'failed'}
          >
            {paymentState.status === 'completed' ? 'Close' : 'Cancel'}
          </Button>
          
          {paymentState.status !== 'completed' && (
            <Button
              variant="primary"
              onClick={handlePayment}
              disabled={!canPay}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay ${formatCurrency(userSplitAmount)}`
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

