
"use client";

import { Expense, User } from "../types";
import { UserAvatar } from "./ui/UserAvatar";
import { Button } from "./ui/Button";
import { formatCurrency } from "../utils/formatting";
import { formatDistanceToNow } from "date-fns";
import { Receipt } from "lucide-react";

interface ExpenseItemProps {
  expense: Expense;
  paidByUser: User;
  currentUserId: string;
  onSettle?: () => void;
}

export function ExpenseItem({ expense, paidByUser, currentUserId, onSettle }: ExpenseItemProps) {
  const userSplit = expense.splits.find(split => split.userId === currentUserId);
  const isPaidByCurrentUser = expense.paidByUserId === currentUserId;
  
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
                {formatDistanceToNow(expense.createdAt, { addSuffix: true })}
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
              {!expense.settled && userSplit && !isPaidByCurrentUser && (
                <Button 
                  size="sm" 
                  variant="primary"
                  onClick={onSettle}
                >
                  Pay {formatCurrency(userSplit.amount)}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
