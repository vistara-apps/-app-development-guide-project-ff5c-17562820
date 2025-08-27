"use client";

import { useState, useEffect, useCallback } from "react";
import { Group, Expense, Balance } from "../types";
import { mockGroups, mockExpenses, currentUser } from "../utils/mockData";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setGroups(mockGroups);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const addGroup = useCallback((newGroup: Group) => {
    setGroups(prevGroups => [...prevGroups, newGroup]);
    return newGroup;
  }, []);

  const updateGroup = useCallback((groupId: string, updates: Partial<Group>) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.groupId === groupId ? { ...group, ...updates } : group
      )
    );
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    setGroups(prevGroups => prevGroups.filter(group => group.groupId !== groupId));
    // Also remove associated expenses
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.groupId !== groupId));
  }, []);

  const calculateGroupBalance = useCallback((groupId: string): number => {
    const groupExpenses = expenses.filter(exp => exp.groupId === groupId);
    let balance = 0;

    groupExpenses.forEach(expense => {
      if (expense.paidByUserId === currentUser.userId) {
        // User paid, so they are owed money from others
        const userSplit = expense.splits.find(split => split.userId === currentUser.userId);
        balance += expense.amount - (userSplit?.amount || 0);
      } else {
        // Someone else paid, user owes their share
        const userSplit = expense.splits.find(split => split.userId === currentUser.userId);
        balance -= userSplit?.amount || 0;
      }
    });

    return balance;
  }, [expenses]);

  return {
    groups,
    loading,
    addGroup,
    updateGroup,
    deleteGroup,
    calculateGroupBalance,
  };
}
