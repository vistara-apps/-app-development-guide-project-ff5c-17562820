
"use client";

import { useState } from "react";
import { GroupCard } from "../components/GroupCard";
import { FrameHeader } from "../components/FrameHeader";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { useGroups } from "../hooks/useGroups";
import { currentUser } from "../utils/mockData";
import { Plus } from "lucide-react";

interface GroupsPageProps {
  onSelectGroup: (groupId: string) => void;
}

export function GroupsPage({ onSelectGroup }: GroupsPageProps) {
  const { groups, loading, calculateGroupBalance } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      // TODO: Implement group creation
      console.log("Creating group:", groupName);
      setGroupName("");
      setShowCreateModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <FrameHeader
        title="FlowSplit"
        subtitle="Your shared expenses"
        user={currentUser}
        showAdd
        onAdd={() => setShowCreateModal(true)}
      />
      
      <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-text-secondary mb-4">No groups yet</div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus size={16} className="mr-2" />
              Create Your First Group
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-heading">Your Groups</h2>
              <Button variant="outline" size="sm" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} className="mr-2" />
                New Group
              </Button>
            </div>
            
            <div className="space-y-3">
              {groups.map((group) => (
                <GroupCard
                  key={group.groupId}
                  group={group}
                  balance={calculateGroupBalance(group.groupId)}
                  onClick={() => onSelectGroup(group.groupId)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Group"
      >
        <div className="space-y-4">
          <Input
            label="Group Name"
            value={groupName}
            onChange={setGroupName}
            placeholder="e.g., Weekend Trip, Roommates"
          />
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={!groupName.trim()}
              className="flex-1"
            >
              Create Group
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
