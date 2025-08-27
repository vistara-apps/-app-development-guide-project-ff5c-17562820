"use client";

import { Expense, User } from "../types";
import { UserAvatar } from "./ui/UserAvatar";
import { Button } from "./ui/Button";
import { formatCurrency } from "../utils/formatting";
import { formatDistanceToNow } from "date-fns";
import { Receipt, Check, CreditCard } from "lucide-react";
import { clsx } from "clsx";

interface ExpenseItemProps {
  expense: Expense;
  paidByUser: User;
  currentUserId: string;
  onSettle?: () => void;
  className?: string;
}

export function ExpenseItem({ 
  expense, 
  paidByUser, 
  currentUserId, 
  onSettle,
  className
}: ExpenseItemProps) {
  const userSplit = expense.splits.find(split => split.userId === currentUserId);
  const isPaidByCurrentUser = expense.paidByUserId === currentUserId;
  
  // Calculate if the current user is owed money
  const isOwed = isPaidByCurrentUser && !expense.settled;
  
  // Calculate if the current user owes money
  const owes = !isPaidByCurrentUser && userSplit && !expense.settled;
  
  return (
    <div className={clsx(
      "card transition-all duration-base",
      expense.settled ? "opacity-80" : "hover:shadow-md",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 w-full">
          <div className={clsx(
            "p-2 rounded-md flex-shrink-0",
            expense.settled ? "bg-success/10" : "bg-primary/10"
          )}>
            {expense.settled ? (
              <Check size={20} className="text-success" />
            ) : (
              <Receipt size={20} className="text-primary" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-text-primary truncate">{expense.description}</h4>
              <div className={clsx(
                "text-lg font-semibold ml-2",
                isOwed ? "text-accent" : owes ? "text-error" : "text-text-primary"
              )}>
                {formatCurrency(expense.amount)}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-2 mt-1">
              <div className="flex items-center">
                <UserAvatar user={paidByUser} size="sm" />
                <span className="text-caption ml-1.5">
                  Paid by {isPaidByCurrentUser ? 'you' : paidByUser.displayName}
                </span>
              </div>
              <span className="text-caption text-text-secondary">•</span>
              <span className="text-caption text-text-secondary">
                {formatDistanceToNow(expense.createdAt, { addSuffix: true })}
              </span>
              
              {expense.settled && (
                <>
                  <span className="text-caption text-text-secondary">•</span>
                  <span className="text-caption text-success flex items-center">
                    <Check size={14} className="mr-1" /> Settled
                  </span>
                </>
              )}
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              {userSplit && (
                <div className={clsx(
                  "px-2.5 py-1 rounded-md text-sm",
                  isOwed ? "bg-accent/10 text-accent" : 
                  owes ? "bg-error/10 text-error" : 
                  "bg-gray-100 text-text-secondary"
                )}>
                  {isPaidByCurrentUser ? (
                    <>You paid <span className="font-medium">{formatCurrency(expense.amount)}</span></>
                  ) : (
                    <>Your share: <span className="font-medium">{formatCurrency(userSplit.amount)}</span></>
                  )}
                </div>
              )}
              
              {owes && (
                <Button 
                  size="sm" 
                  variant="primary"
                  onClick={onSettle}
                  leftIcon={<CreditCard size={16} />}
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
