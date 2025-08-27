"use client";

import { useState, useEffect } from "react";
import { Expense, User, Settlement, PaymentStatus } from "../lib/types";
import { mockExpenses, mockUsers, mockSettlements } from "../utils/mockData";
import { generateId } from "../lib/utils";

export function useExpenses(groupId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const filteredExpenses = groupId 
        ? mockExpenses.filter(exp => exp.groupId === groupId)
        : mockExpenses;
      
      const filteredSettlements = groupId
        ? mockSettlements.filter(s => s.groupId === groupId)
        : mockSettlements;
      
      setExpenses(filteredExpenses);
      setSettlements(filteredSettlements);
      setLoading(false);
    }, 300);
  }, [groupId]);

  const addExpense = (expense: Omit<Expense, 'expenseId' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      expenseId: `exp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const getUserById = (userId: string): User | undefined => {
    return mockUsers.find(user => user.userId === userId);
  };

  const addSettlement = (settlement: Omit<Settlement, 'settlementId' | 'createdAt'>) => {
    const newSettlement: Settlement = {
      ...settlement,
      settlementId: `settlement_${generateId()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSettlements(prev => [newSettlement, ...prev]);
    
    // If this settlement is for an expense, mark the expense as settled
    if (settlement.expenseId) {
      setExpenses(prev => 
        prev.map(exp => 
          exp.expenseId === settlement.expenseId
            ? { ...exp, settled: true }
            : exp
        )
      );
    }
    
    return newSettlement;
  };

  const updateSettlementStatus = (
    settlementId: string, 
    status: PaymentStatus, 
    updates: Partial<Settlement> = {}
  ) => {
    setSettlements(prev => 
      prev.map(s => 
        s.settlementId === settlementId
          ? { 
              ...s, 
              status, 
              updatedAt: new Date().toISOString(),
              ...updates 
            }
          : s
      )
    );
  };

  const getSettlementsByExpenseId = (expenseId: string): Settlement[] => {
    return settlements.filter(s => s.expenseId === expenseId);
  };

  const hasUserSettledExpense = (expenseId: string, userId: string): boolean => {
    return settlements.some(
      s => s.expenseId === expenseId && 
           s.fromUserId === userId && 
           s.status === 'completed'
    );
  };

  return {
    expenses,
    settlements,
    loading,
    addExpense,
    getUserById,
    addSettlement,
    updateSettlementStatus,
    getSettlementsByExpenseId,
    hasUserSettledExpense,
  };
}
