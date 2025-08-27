
"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useState, useCallback } from "react";
import { FrameHeader } from "./components/FrameHeader";
import { GroupCard } from "./components/GroupCard";
import { ExpenseItem } from "./components/ExpenseItem";
import { Button } from "./components/ui/Button";
import { Tabs } from "./components/ui/Tabs";
import { AddExpenseModal } from "./components/AddExpenseModal";
import { CreateGroupModal } from "./components/CreateGroupModal";
import { mockGroups, mockExpenses, currentUser } from "./lib/mock-data";
import { Group, Expense } from "./lib/types";
import { generateId } from "./lib/utils";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const handleCreateGroup = (groupName: string) => {
    const newGroup: Group = {
      groupId: generateId(),
      groupName,
      createdAt: new Date().toISOString(),
      active: true,
      members: [currentUser],
      totalExpenses: 0,
      myBalance: 0,
    };
    setGroups([newGroup, ...groups]);
  };

  const handleAddExpense = (expenseData: {
    description: string;
    amount: number;
    paidByUserId: string;
    splitType: 'equal' | 'custom';
  }) => {
    if (!selectedGroup) return;

    const splitAmount = expenseData.amount / selectedGroup.members.length;
    
    const newExpense: Expense = {
      expenseId: generateId(),
      groupId: selectedGroup.groupId,
      description: expenseData.description,
      amount: expenseData.amount,
      paidByUserId: expenseData.paidByUserId,
      paidByUser: selectedGroup.members.find(m => m.userId === expenseData.paidByUserId)!,
      splitType: expenseData.splitType,
      splits: selectedGroup.members.map(member => ({
        userId: member.userId,
        user: member,
        amount: splitAmount,
        settled: member.userId === expenseData.paidByUserId,
      })),
      createdAt: new Date().toISOString(),
      settled: false,
    };

    setExpenses([newExpense, ...expenses]);
    
    // Update group totals
    setGroups(groups.map(group => 
      group.groupId === selectedGroup.groupId
        ? { 
            ...group, 
            totalExpenses: group.totalExpenses + expenseData.amount,
            myBalance: expenseData.paidByUserId === currentUser.userId 
              ? group.myBalance + (expenseData.amount - splitAmount)
              : group.myBalance - splitAmount
          }
        : group
    ));
  };

  const handleSettle = (expenseId: string, userId: string) => {
    // In a real app, this would trigger an on-chain transaction
    setExpenses(expenses.map(expense => 
      expense.expenseId === expenseId
        ? {
            ...expense,
            splits: expense.splits.map(split =>
              split.userId === userId ? { ...split, settled: true } : split
            )
          }
        : expense
    ));
    
    // Update group balance
    const expense = expenses.find(e => e.expenseId === expenseId);
    if (expense && selectedGroup) {
      const userSplit = expense.splits.find(s => s.userId === userId);
      if (userSplit) {
        setGroups(groups.map(group => 
          group.groupId === selectedGroup.groupId
            ? { ...group, myBalance: group.myBalance + userSplit.amount }
            : group
        ));
      }
    }
  };

  const saveFrameButton = context && !context.client.added ? (
    <Button variant="outline" size="sm" onClick={handleAddFrame}>
      {frameAdded ? "✓ Saved" : "+ Save"}
    </Button>
  ) : null;

  const groupExpenses = selectedGroup 
    ? expenses.filter(e => e.groupId === selectedGroup.groupId)
    : [];

  const allExpenses = expenses.filter(e => 
    groups.some(g => g.groupId === e.groupId)
  );

  if (selectedGroup) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedGroup(null)}
              >
                ← Back
              </Button>
              <div>
                <h1 className="heading">{selectedGroup.groupName}</h1>
                <p className="caption">{selectedGroup.members.length} members</p>
              </div>
            </div>
            {saveFrameButton}
          </div>

          <div className="mb-6">
            <Button
              variant="primary"
              onClick={() => setShowAddExpense(true)}
              className="w-full"
            >
              Add Expense
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="heading">Recent Expenses</h2>
            {groupExpenses.length > 0 ? (
              groupExpenses.map((expense) => (
                <ExpenseItem
                  key={expense.expenseId}
                  expense={expense}
                  currentUserId={currentUser.userId}
                  onSettle={handleSettle}
                />
              ))
            ) : (
              <div className="card text-center py-8">
                <p className="text-text-secondary">No expenses yet</p>
                <p className="caption mt-1">Add an expense to get started</p>
              </div>
            )}
          </div>

          <AddExpenseModal
            isOpen={showAddExpense}
            onClose={() => setShowAddExpense(false)}
            groupMembers={selectedGroup.members}
            currentUserId={currentUser.userId}
            onAddExpense={handleAddExpense}
          />
        </div>
      </div>
    );
  }

  const dashboardTabs = [
    {
      id: "groups",
      label: "Groups",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="heading">Your Groups</h2>
            <Button variant="primary" size="sm" onClick={() => setShowCreateGroup(true)}>
              Create Group
            </Button>
          </div>
          {groups.length > 0 ? (
            groups.map((group) => (
              <GroupCard
                key={group.groupId}
                group={group}
                variant="compact"
                onClick={() => setSelectedGroup(group)}
              />
            ))
          ) : (
            <div className="card text-center py-8">
              <p className="text-text-secondary">No groups yet</p>
              <p className="caption mt-1">Create a group to start splitting expenses</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "activity",
      label: "Activity",
      content: (
        <div className="space-y-4">
          <h2 className="heading">Recent Activity</h2>
          {allExpenses.length > 0 ? (
            allExpenses.slice(0, 5).map((expense) => (
              <ExpenseItem
                key={expense.expenseId}
                expense={expense}
                currentUserId={currentUser.userId}
                onSettle={handleSettle}
              />
            ))
          ) : (
            <div className="card text-center py-8">
              <p className="text-text-secondary">No activity yet</p>
              <p className="caption mt-1">Add expenses to see them here</p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-xl mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Wallet>
              <ConnectWallet>
                <Avatar />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
          {saveFrameButton}
        </header>

        <FrameHeader
          title="FlowSplit"
          subtitle="Split bills and manage shared expenses"
        />

        <Tabs tabs={dashboardTabs} defaultTab="groups" />

        <CreateGroupModal
          isOpen={showCreateGroup}
          onClose={() => setShowCreateGroup(false)}
          onCreateGroup={handleCreateGroup}
        />

        <footer className="mt-8 pt-6 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openUrl("https://base.org/builders/minikit")}
            className="text-text-secondary"
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
