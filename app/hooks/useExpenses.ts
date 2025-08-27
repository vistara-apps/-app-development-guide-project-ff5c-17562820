
"use client";

import { useState, useEffect } from "react";
import { Expense, User } from "../types";
import { mockExpenses, mockUsers } from "../utils/mockData";

export function useExpenses(groupId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const filteredExpenses = groupId 
        ? mockExpenses.filter(exp => exp.groupId === groupId)
        : mockExpenses;
      setExpenses(filteredExpenses);
      setLoading(false);
    }, 300);
  }, [groupId]);

  const addExpense = (expense: Omit<Expense, 'expenseId' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      expenseId: `exp_${Date.now()}`,
      createdAt: new Date(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const getUserById = (userId: string): User | undefined => {
    return mockUsers.find(user => user.userId === userId);
  };

  return {
    expenses,
    loading,
    addExpense,
    getUserById,
  };
}
