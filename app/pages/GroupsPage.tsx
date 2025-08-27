"use client";

import { useState } from "react";
import { GroupCard } from "../components/GroupCard";
import { FrameHeader } from "../components/FrameHeader";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { FormField, Form } from "../components/ui/FormField";
import { useGroups } from "../hooks/useGroups";
import { currentUser } from "../utils/mockData";
import { Plus, Users, Search } from "lucide-react";
import { LoadingState } from "../components/ui/LoadingState";
import { EmptyState } from "../components/ui/EmptyState";
import { SkeletonCard } from "../components/ui/Skeleton";
import { Input } from "../components/ui/Input";
import { clsx } from "clsx";

interface GroupsPageProps {
  onSelectGroup: (groupId: string) => void;
}

export function GroupsPage({ onSelectGroup }: GroupsPageProps) {
  const { groups, loading, calculateGroupBalance, addGroup } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      setGroupNameError("Group name is required");
      return;
    }
    
    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      // TODO: Replace with actual API call
      addGroup({
        groupId: `group-${Date.now()}`,
        groupName: groupName.trim(),
        members: [currentUser],
        createdAt: new Date(),
      });
      
      setGroupName("");
      setIsCreating(false);
      setShowCreateModal(false);
      
      // Show success toast (would use useToastContext in a real implementation)
      console.log("Group created successfully!");
    }, 1000);
  };

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <FrameHeader
          title="FlowSplit"
          subtitle="Your shared expenses"
          user={currentUser}
        />
        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-heading">Your Groups</h2>
            <div className="w-24 h-10 skeleton"></div>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
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
          <EmptyState
            icon={<Users size={48} className="text-primary/50" />}
            title="No expense groups yet"
            description="Create your first group to start tracking shared expenses with friends, roommates, or travel buddies."
            action={{
              label: "Create Your First Group",
              onClick: () => setShowCreateModal(true),
              variant: "primary"
            }}
          />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-heading">Your Groups</h2>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setShowCreateModal(true)}
                leftIcon={<Plus size={16} />}
              >
                New Group
              </Button>
            </div>
            
            {groups.length > 3 && (
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search groups..."
                  leftIcon={<Search size={16} />}
                  className="mb-4"
                />
              </div>
            )}
            
            {filteredGroups.length === 0 && searchQuery && (
              <EmptyState
                title="No matching groups"
                description={`No groups found matching "${searchQuery}"`}
                action={{
                  label: "Clear Search",
                  onClick: () => setSearchQuery(""),
                  variant: "secondary"
                }}
              />
            )}
            
            <div className={clsx(
              "space-y-3",
              filteredGroups.length > 0 && "animate-fade-in"
            )}>
              {filteredGroups.map((group) => (
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
        onClose={() => !isCreating && setShowCreateModal(false)}
        title="Create New Group"
        description="Create a group to track and split expenses with friends, family, or colleagues."
        size="md"
      >
        <Form onSubmit={handleCreateGroup} className="space-y-4">
          <FormField
            label="Group Name"
            name="groupName"
            value={groupName}
            onChange={(value) => {
              setGroupName(value);
              if (value.trim()) setGroupNameError("");
            }}
            placeholder="e.g., Weekend Trip, Roommates"
            error={groupNameError}
            hint="Choose a descriptive name that everyone will recognize"
            required
          />
          
          <div className="flex space-x-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
              disabled={isCreating}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={!groupName.trim() || isCreating}
              isLoading={isCreating}
              type="submit"
            >
              Create Group
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
