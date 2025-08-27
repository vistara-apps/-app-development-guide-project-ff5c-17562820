"use client";

import { cn, formatCurrency } from "../lib/utils";

interface ExpenseItemProps {
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  settled: boolean;
  className?: string;
}

export function ExpenseItem({ 
  description, 
  amount, 
  paidBy, 
  date, 
  settled,
  className 
}: ExpenseItemProps) {
  return (
    <div className={cn(
      "flex justify-between items-center py-3 border-b border-border last:border-b-0",
      className
    )}>
      <div className="flex-1">
        <h4 className="text-base leading-7 font-medium text-text-primary">{description}</h4>
        <p className="text-sm text-text-secondary">Paid by {paidBy} • {date}</p>
      </div>
      <div className="text-right">
        <p className="text-base leading-7 font-medium text-text-primary">
          {formatCurrency(amount)}
        </p>
        <p className={cn(
          "text-sm",
          settled ? "text-green-600" : "text-text-secondary"
        )}>
          {settled ? "Settled" : "Pending"}
        </p>
      </div>
    </div>
  );
}
