"use client";

import { Expense, User, Settlement } from "../lib/types";
import { UserAvatar } from "./ui/UserAvatar";
import { Button } from "./ui/Button";
import { formatCurrency } from "../utils/formatting";
import { formatDistanceToNow } from "date-fns";
import { Receipt, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";

interface ExpenseItemProps {
  expense: Expense;
  paidByUser: User;
  currentUserId: string;
  onSettle?: () => void;
  userSettlement?: Settlement;
  isSettling?: boolean;
}

export function ExpenseItem({ 
  expense, 
  paidByUser, 
  currentUserId, 
  onSettle,
  userSettlement,
  isSettling = false
}: ExpenseItemProps) {
  const userSplit = expense.splits.find(split => split.userId === currentUserId);
  const isPaidByCurrentUser = expense.paidByUserId === currentUserId;
  
  // Render payment status button based on settlement status
  const renderPaymentButton = () => {
    // If user is the one who paid, they don't need to pay
    if (isPaidByCurrentUser) {
      return null;
    }
    
    // If expense is already settled
    if (expense.settled) {
      return (
        <div className="flex items-center space-x-1 text-green-500">
          <CheckCircle size={16} />
          <span className="text-xs">Settled</span>
        </div>
      );
    }
    
    // If there's an active settlement
    if (userSettlement) {
      switch (userSettlement.status) {
        case 'initial':
          return (
            <Button 
              size="sm" 
              variant="primary"
              onClick={onSettle}
            >
              Pay {formatCurrency(userSplit?.amount || 0)}
            </Button>
          );
        case 'approving':
        case 'paying':
          return (
            <div className="flex items-center space-x-1 text-primary">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs">Processing...</span>
            </div>
          );
        case 'approved':
          return (
            <div className="flex items-center space-x-1 text-primary">
              <Clock size={16} />
              <span className="text-xs">Approved</span>
            </div>
          );
        case 'completed':
          return (
            <div className="flex items-center space-x-1 text-green-500">
              <CheckCircle size={16} />
              <span className="text-xs">Paid</span>
            </div>
          );
        case 'failed':
          return (
            <div className="flex items-center space-x-1 text-red-500">
              <AlertCircle size={16} />
              <span className="text-xs">Failed</span>
            </div>
          );
        default:
          return null;
      }
    }
    
    // Default: show pay button if user has a split and hasn't paid
    if (userSplit && !isPaidByCurrentUser) {
      return (
        <Button 
          size="sm" 
          variant="primary"
          onClick={onSettle}
          disabled={isSettling}
        >
          {isSettling ? (
            <div className="flex items-center space-x-1">
              <Loader2 size={16} className="animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            `Pay ${formatCurrency(userSplit.amount)}`
          )}
        </Button>
      );
    }
    
    return null;
  };
  
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Receipt size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-text-primary">{expense.description}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <UserAvatar user={paidByUser} size="sm" />
              <span className="text-caption">
                Paid by {isPaidByCurrentUser ? 'you' : paidByUser.displayName}
              </span>
              <span className="text-caption">•</span>
              <span className="text-caption">
                {formatDistanceToNow(new Date(expense.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="text-heading">{formatCurrency(expense.amount)}</div>
                {userSplit && (
                  <div className="text-caption">
                    Your share: {formatCurrency(userSplit.amount)}
                  </div>
                )}
              </div>
              {renderPaymentButton()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
