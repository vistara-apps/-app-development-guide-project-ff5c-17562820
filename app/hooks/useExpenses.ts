"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, User } from "../types";
import { mockExpenses, mockUsers } from "../utils/mockData";

export function useExpenses(groupId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when groupId changes
    setLoading(true);
    setError(null);
    
    // Simulate API call
    const timer = setTimeout(() => {
      try {
        const filteredExpenses = groupId 
          ? mockExpenses.filter(exp => exp.groupId === groupId)
          : mockExpenses;
        
        // Sort expenses by date (newest first)
        const sortedExpenses = [...filteredExpenses].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setExpenses(sortedExpenses);
        setLoading(false);
      } catch (err) {
        setError("Failed to load expenses");
        setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [groupId]);

  const addExpense = useCallback((expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
    return expense;
  }, []);

  const updateExpense = useCallback((expenseId: string, updates: Partial<Expense>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.expenseId === expenseId ? { ...expense, ...updates } : expense
      )
    );
  }, []);

  const deleteExpense = useCallback((expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.expenseId !== expenseId));
  }, []);

  const settleExpense = useCallback((expenseId: string) => {
    updateExpense(expenseId, { settled: true });
  }, [updateExpense]);

  const getUserById = useCallback((userId: string): User | undefined => {
    return mockUsers.find(user => user.userId === userId);
  }, []);

  const getExpenseById = useCallback((expenseId: string): Expense | undefined => {
    return expenses.find(expense => expense.expenseId === expenseId);
  }, [expenses]);

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    settleExpense,
    getUserById,
    getExpenseById,
  };
}
