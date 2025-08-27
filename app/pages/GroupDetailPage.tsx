
"use client";

import { useState } from "react";
import { FrameHeader } from "../components/FrameHeader";
import { ExpenseItem } from "../components/ExpenseItem";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Tabs } from "../components/ui/Tabs";
import { UserAvatar } from "../components/ui/UserAvatar";
import { useExpenses } from "../hooks/useExpenses";
import { useGroups } from "../hooks/useGroups";
import { mockGroups, currentUser } from "../utils/mockData";
import { formatCurrency } from "../utils/formatting";
import { Plus, Users, DollarSign } from "lucide-react";

interface GroupDetailPageProps {
  groupId: string;
  onBack: () => void;
}

export function GroupDetailPage({ groupId, onBack }: GroupDetailPageProps) {
  const { expenses, loading, addExpense, getUserById } = useExpenses(groupId);
  const { calculateGroupBalance } = useGroups();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  
  const group = mockGroups.find(g => g.groupId === groupId);
  const groupBalance = calculateGroupBalance(groupId);

  const handleAddExpense = () => {
    if (expenseDescription.trim() && expenseAmount) {
      const amount = parseFloat(expenseAmount);
      const splitAmount = amount / group!.members.length;
      
      addExpense({
        groupId,
        description: expenseDescription,
        amount,
        paidByUserId: currentUser.userId,
        splitType: 'equal',
        settled: false,
        splits: group!.members.map(member => ({
          userId: member.userId,
          amount: splitAmount
        }))
      });
      
      setExpenseDescription("");
      setExpenseAmount("");
      setShowAddExpense(false);
    }
  };

  const handleSettle = (expenseId: string) => {
    // TODO: Implement settlement
    console.log("Settling expense:", expenseId);
  };

  if (!group) {
    return <div>Group not found</div>;
  }

  const tabs = [
    {
      id: 'expenses',
      label: 'Expenses',
      content: (
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-text-secondary">Loading expenses...</div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-text-secondary mb-4">No expenses yet</div>
              <Button onClick={() => setShowAddExpense(true)}>
                <Plus size={16} className="mr-2" />
                Add First Expense
              </Button>
            </div>
          ) : (
            expenses.map((expense) => (
              <ExpenseItem
                key={expense.expenseId}
                expense={expense}
                paidByUser={getUserById(expense.paidByUserId)!}
                currentUserId={currentUser.userId}
                onSettle={() => handleSettle(expense.expenseId)}
              />
            ))
          )}
        </div>
      )
    },
    {
      id: 'balances',
      label: 'Balances',
      content: (
        <div className="space-y-3">
          <div className="card">
            <div className="text-center">
              <div className="text-heading mb-2">Your Balance</div>
              <div className={`text-display ${groupBalance > 0 ? 'text-accent' : groupBalance < 0 ? 'text-red-500' : 'text-text-secondary'}`}>
                {formatCurrency(Math.abs(groupBalance))}
              </div>
              <div className="text-caption">
                {groupBalance > 0 ? 'You are owed' : groupBalance < 0 ? 'You owe' : 'All settled up'}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {group.members
              .filter(member => member.userId !== currentUser.userId)
              .map((member) => (
                <div key={member.userId} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={member} />
                      <span className="font-medium">{member.displayName}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-text-secondary">
                        Settled up
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )
    },
    {
      id: 'members',
      label: 'Members',
      content: (
        <div className="space-y-3">
          {group.members.map((member) => (
            <div key={member.userId} className="card">
              <div className="flex items-center space-x-3">
                <UserAvatar user={member} />
                <div>
                  <div className="font-medium">{member.displayName}</div>
                  {member.farcasterId && (
                    <div className="text-caption">@{member.farcasterId}</div>
                  )}
                </div>
                {member.userId === currentUser.userId && (
                  <span className="ml-auto text-caption bg-primary/10 text-primary px-2 py-1 rounded">
                    You
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  const [activeTab, setActiveTab] = useState('expenses');

  return (
    <div className="min-h-screen bg-bg">
      <FrameHeader
        title={group.groupName}
        subtitle={`${group.members.length} members`}
        showBack
        onBack={onBack}
        showAdd
        onAdd={() => setShowAddExpense(true)}
      />
      
      {/* Group Summary */}
      <div className="bg-surface border-b border-border p-4">
        <div className="max-w-xl mx-auto grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <Users size={20} />
            </div>
            <div className="text-caption">Members</div>
            <div className="font-semibold">{group.members.length}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <DollarSign size={20} />
            </div>
            <div className="text-caption">Total Expenses</div>
            <div className="font-semibold">
              {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <Modal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        title="Add Expense"
      >
        <div className="space-y-4">
          <Input
            label="Description"
            value={expenseDescription}
            onChange={setExpenseDescription}
            placeholder="e.g., Dinner, Gas, Hotel"
          />
          <Input
            label="Amount (USD)"
            value={expenseAmount}
            onChange={setExpenseAmount}
            type="number"
            placeholder="0.00"
          />
          <div className="bg-bg p-3 rounded-md">
            <div className="text-caption mb-2">Split equally among {group.members.length} members</div>
            <div className="text-sm">
              Each person pays: {expenseAmount ? formatCurrency(parseFloat(expenseAmount) / group.members.length) : "$0.00"}
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowAddExpense(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddExpense}
              disabled={!expenseDescription.trim() || !expenseAmount}
              className="flex-1"
            >
              Add Expense
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
