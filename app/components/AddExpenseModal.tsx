
"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { User } from "@/app/lib/types";
import { UserAvatar } from "./ui/UserAvatar";
import { generateId } from "@/app/lib/utils";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupMembers: User[];
  currentUserId: string;
  onAddExpense: (expense: {
    description: string;
    amount: number;
    paidByUserId: string;
    splitType: 'equal' | 'custom';
  }) => void;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  groupMembers,
  currentUserId,
  onAddExpense,
}: AddExpenseModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidByUserId, setPaidByUserId] = useState(currentUserId);
  const [splitType] = useState<'equal' | 'custom'>('equal');

  const handleSubmit = () => {
    if (!description || !amount || !paidByUserId) return;

    onAddExpense({
      description,
      amount: parseFloat(amount),
      paidByUserId,
      splitType,
    });

    // Reset form
    setDescription("");
    setAmount("");
    setPaidByUserId(currentUserId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Description
          </label>
          <Input
            placeholder="What was this expense for?"
            value={description}
            onChange={setDescription}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Amount (USDC)
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={setAmount}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Who paid?
          </label>
          <div className="space-y-2">
            {groupMembers.map((member) => (
              <label
                key={member.userId}
                className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-bg"
              >
                <input
                  type="radio"
                  name="paidBy"
                  value={member.userId}
                  checked={paidByUserId === member.userId}
                  onChange={() => setPaidByUserId(member.userId)}
                  className="text-primary"
                />
                <UserAvatar user={member} size="sm" />
                <span className="text-sm text-text-primary">
                  {member.displayName}
                  {member.userId === currentUserId && " (you)"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!description || !amount}
            className="flex-1"
          >
            Add Expense
          </Button>
        </div>
      </div>
    </Modal>
  );
}
