"use client";

import { useState } from "react";
import { FrameHeader } from "../components/FrameHeader";
import { ExpenseItem } from "../components/ExpenseItem";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { FormField, Form } from "../components/ui/FormField";
import { Tabs } from "../components/ui/Tabs";
import { UserAvatar } from "../components/ui/UserAvatar";
import { useExpenses } from "../hooks/useExpenses";
import { useGroups } from "../hooks/useGroups";
import { mockGroups, currentUser } from "../utils/mockData";
import { formatCurrency } from "../utils/formatting";
import { 
  Plus, 
  Users, 
  DollarSign, 
  Receipt, 
  ArrowRight, 
  ArrowLeft,
  CreditCard,
  Search
} from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";
import { SkeletonCard, SkeletonText } from "../components/ui/Skeleton";
import { Input } from "../components/ui/Input";
import { clsx } from "clsx";

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
  const [descriptionError, setDescriptionError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const group = mockGroups.find(g => g.groupId === groupId);
  const groupBalance = calculateGroupBalance(groupId);

  const handleAddExpense = () => {
    // Validate inputs
    let hasError = false;
    
    if (!expenseDescription.trim()) {
      setDescriptionError("Description is required");
      hasError = true;
    }
    
    if (!expenseAmount) {
      setAmountError("Amount is required");
      hasError = true;
    } else if (isNaN(parseFloat(expenseAmount)) || parseFloat(expenseAmount) <= 0) {
      setAmountError("Amount must be a positive number");
      hasError = true;
    }
    
    if (hasError) return;
    
    setIsAddingExpense(true);
    
    // Simulate API call
    setTimeout(() => {
      const amount = parseFloat(expenseAmount);
      const splitAmount = amount / group!.members.length;
      
      addExpense({
        expenseId: `expense-${Date.now()}`,
        groupId,
        description: expenseDescription,
        amount,
        paidByUserId: currentUser.userId,
        splitType: 'equal',
        settled: false,
        createdAt: new Date(),
        splits: group!.members.map(member => ({
          userId: member.userId,
          amount: splitAmount
        }))
      });
      
      setExpenseDescription("");
      setExpenseAmount("");
      setIsAddingExpense(false);
      setShowAddExpense(false);
      
      // Show success toast (would use useToastContext in a real implementation)
      console.log("Expense added successfully!");
    }, 1000);
  };

  const handleSettle = (expenseId: string) => {
    // TODO: Implement settlement
    console.log("Settling expense:", expenseId);
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <EmptyState
          title="Group not found"
          description="The group you're looking for doesn't exist or has been deleted."
          action={{
            label: "Back to Groups",
            onClick: onBack,
            variant: "primary"
          }}
        />
      </div>
    );
  }

  // Filter expenses based on search query
  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    {
      id: 'expenses',
      label: 'Expenses',
      icon: <Receipt size={16} />,
      content: (
        <div className="space-y-4">
          {expenses.length > 0 && (
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search expenses..."
                leftIcon={<Search size={16} />}
                className="mb-4"
              />
            </div>
          )}
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <EmptyState
              icon={<Receipt size={48} className="text-primary/50" />}
              title="No expenses yet"
              description="Add your first expense to start tracking shared costs in this group."
              action={{
                label: "Add First Expense",
                onClick: () => setShowAddExpense(true),
                variant: "primary"
              }}
            />
          ) : filteredExpenses.length === 0 ? (
            <EmptyState
              title="No matching expenses"
              description={`No expenses found matching "${searchQuery}"`}
              action={{
                label: "Clear Search",
                onClick: () => setSearchQuery(""),
                variant: "secondary"
              }}
            />
          ) : (
            <div className="space-y-3 animate-fade-in">
              {filteredExpenses.map((expense) => (
                <ExpenseItem
                  key={expense.expenseId}
                  expense={expense}
                  paidByUser={getUserById(expense.paidByUserId)!}
                  currentUserId={currentUser.userId}
                  onSettle={() => handleSettle(expense.expenseId)}
                />
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'balances',
      label: 'Balances',
      icon: <DollarSign size={16} />,
      content: (
        <div className="space-y-4">
          <div className="card hover:shadow-md transition-all duration-base">
            <div className="text-center">
              <div className="text-heading mb-2">Your Balance</div>
              <div className={clsx(
                "text-display",
                groupBalance > 0 ? "text-accent" : 
                groupBalance < 0 ? "text-error" : 
                "text-text-secondary"
              )}>
                {formatCurrency(Math.abs(groupBalance))}
              </div>
              <div className={clsx(
                "text-sm px-3 py-1 rounded-full inline-block mt-2",
                groupBalance > 0 ? "bg-accent/10 text-accent" : 
                groupBalance < 0 ? "bg-error/10 text-error" : 
                "bg-gray-100 text-text-secondary"
              )}>
                {groupBalance > 0 ? 'You are owed' : groupBalance < 0 ? 'You owe' : 'All settled up'}
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mt-6 mb-3">Member Balances</h3>
          
          <div className="space-y-2">
            {group.members
              .filter(member => member.userId !== currentUser.userId)
              .map((member) => (
                <div key={member.userId} className="card hover:shadow-md transition-all duration-base">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={member} />
                      <div>
                        <div className="font-medium">{member.displayName}</div>
                        {member.farcasterId && (
                          <div className="text-caption">@{member.farcasterId}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-success flex items-center">
                        <span className="bg-success/10 text-success px-2 py-1 rounded-full text-sm">
                          Settled up
                        </span>
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
      icon: <Users size={16} />,
      content: (
        <div className="space-y-3">
          {group.members.map((member) => (
            <div key={member.userId} className="card hover:shadow-md transition-all duration-base">
              <div className="flex items-center space-x-3">
                <UserAvatar user={member} size="md" />
                <div>
                  <div className="font-medium">{member.displayName}</div>
                  {member.farcasterId && (
                    <div className="text-caption">@{member.farcasterId}</div>
                  )}
                </div>
                {member.userId === currentUser.userId && (
                  <span className="ml-auto badge badge-primary">
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
        showAdd={activeTab === 'expenses'}
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
        onClose={() => !isAddingExpense && setShowAddExpense(false)}
        title="Add Expense"
        description="Add a new expense to split among group members."
        size="md"
      >
        <Form onSubmit={handleAddExpense} className="space-y-4">
          <FormField
            label="Description"
            name="description"
            value={expenseDescription}
            onChange={(value) => {
              setExpenseDescription(value);
              if (value.trim()) setDescriptionError("");
            }}
            placeholder="e.g., Dinner, Gas, Hotel"
            error={descriptionError}
            required
          />
          
          <FormField
            label="Amount (USD)"
            name="amount"
            value={expenseAmount}
            onChange={(value) => {
              setExpenseAmount(value);
              if (value && !isNaN(parseFloat(value)) && parseFloat(value) > 0) {
                setAmountError("");
              }
            }}
            type="number"
            placeholder="0.00"
            error={amountError}
            required
            leftIcon={<DollarSign size={16} />}
          />
          
          <div className="bg-bg p-4 rounded-md border border-border mt-2">
            <div className="text-sm font-medium mb-2">Split Summary</div>
            <div className="flex items-center justify-between text-caption mb-2">
              <span>Split type</span>
              <span className="badge badge-primary">Equal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption">Each person pays</span>
              <span className="font-medium">
                {expenseAmount && !isNaN(parseFloat(expenseAmount)) && parseFloat(expenseAmount) > 0
                  ? formatCurrency(parseFloat(expenseAmount) / group.members.length)
                  : "$0.00"
                }
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowAddExpense(false)}
              className="flex-1"
              disabled={isAddingExpense}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={!expenseDescription.trim() || !expenseAmount || isAddingExpense}
              isLoading={isAddingExpense}
              type="submit"
            >
              Add Expense
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
