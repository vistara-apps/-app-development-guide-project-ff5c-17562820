
"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupName: string) => void;
}

export function CreateGroupModal({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = () => {
    if (!groupName.trim()) return;
    
    onCreateGroup(groupName.trim());
    setGroupName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Group">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Group Name
          </label>
          <Input
            placeholder="e.g., Trip to Europe, Roommate Expenses"
            value={groupName}
            onChange={setGroupName}
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!groupName.trim()}
            className="flex-1"
          >
            Create Group
          </Button>
        </div>
      </div>
    </Modal>
  );
}
