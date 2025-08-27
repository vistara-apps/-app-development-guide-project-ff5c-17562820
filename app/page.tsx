
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
import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "./components/ui/Button";
import { GroupsPage } from "./pages/GroupsPage";
import { GroupDetailPage } from "./pages/GroupDetailPage";
import { currentUser } from "./utils/mockData";
import { UserCircle, Plus } from "lucide-react";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [currentView, setCurrentView] = useState<'groups' | 'group-detail'>('groups');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

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

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentView('group-detail');
  };

  const handleBackToGroups = () => {
    setCurrentView('groups');
    setSelectedGroupId(null);
  };

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddFrame}
          className="text-primary"
        >
          <Plus size={16} className="mr-1" />
          Save
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-accent animate-fade-in">
          <span>✓ Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'group-detail':
        return selectedGroupId ? (
          <GroupDetailPage
            groupId={selectedGroupId}
            onBack={handleBackToGroups}
          />
        ) : null;
      default:
        return <GroupsPage onSelectGroup={handleSelectGroup} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-text-primary bg-bg">
      <div className="w-full max-w-xl mx-auto">
        {currentView === 'groups' && (
          <header className="flex justify-between items-center p-4 bg-surface border-b border-border">
            <div className="flex items-center space-x-3">
              <Wallet className="z-10">
                <ConnectWallet>
                  <div className="flex items-center space-x-2">
                    <UserCircle size={20} />
                    <Name className="text-inherit font-medium" />
                  </div>
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
            <div>{saveFrameButton}</div>
          </header>
        )}

        <main className="flex-1">
          {renderCurrentView()}
        </main>

        <footer className="mt-auto p-4 flex justify-center bg-surface border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="text-text-secondary text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
