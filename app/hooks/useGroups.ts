
"use client";

import { useState, useEffect } from "react";
import { Group, Expense, Balance } from "../types";
import { mockGroups, mockExpenses, currentUser } from "../utils/mockData";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGroups(mockGroups);
      setLoading(false);
    }, 500);
  }, []);

  const calculateGroupBalance = (groupId: string): number => {
    const groupExpenses = mockExpenses.filter(exp => exp.groupId === groupId);
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
  };

  return {
    groups,
    loading,
    calculateGroupBalance,
  };
}
