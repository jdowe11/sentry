"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/api/UserApi";
import {
  getPendingRequests,
  updateFriendRequestStatus,
} from "@/api/FriendRequestApi";
import {
  getFriends,
  removeFriend,
} from "@/api/FriendshipApi";
import AddFriendModal from "./AddFriendModal";
import UnfriendConfirmModal from "./UnfriendConfirmModal";
import SkeletonLoader from "./SkeletonLoader";
import Button from "./Button";
import { useDataLoader } from "@/hooks/useDataLoader";

type TabType = "friends" | "incoming" | "outgoing";

export default function FriendsList() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("friends");
  
  // Modal visibility states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUnfriendModalOpen, setIsUnfriendModalOpen] = useState(false);
  const [unfriendTarget, setUnfriendTarget] = useState<User | null>(null);

  // Loading state trackers for button disablers
  const [processingActionId, setProcessingActionId] = useState<number | null>(null);
  const [isUnfriendLoading, setIsUnfriendLoading] = useState(false);

  // Fetch pending requests and friends list in parallel
  const fetchAllData = useCallback(async () => {
    if (!user) throw new Error("No authenticated user session.");
    const [pendingRes, friendsRes] = await Promise.all([
      getPendingRequests(user.id),
      getFriends(user.id),
    ]);
    return {
      pending: pendingRes,
      friends: friendsRes,
    };
  }, [user]);

  // Reuse our custom data loader hook
  const { data, isLoading: isInitialLoad, isRefreshing, reloadData: loadData } = useDataLoader(fetchAllData, [user]);

  const friends = data?.friends || [];
  const incomingRequests = data?.pending.incoming || [];
  const outgoingRequests = data?.pending.outgoing || [];

  // Handle updating status (accept, decline, cancel)
  const handleStatusUpdate = async (requestId: number, action: "accepted" | "declined" | "cancelled") => {
    if (!user || processingActionId !== null) return;
    setProcessingActionId(requestId);
    try {
      await updateFriendRequestStatus(user.id, requestId, action);
      await loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update request.");
    } finally {
      setProcessingActionId(null);
    }
  };

  // Trigger unfriend modal
  const triggerRemoveFriend = (target: User) => {
    setUnfriendTarget(target);
    setIsUnfriendModalOpen(true);
  };

  // Handle removing a friend relationship from confirmation modal
  const handleRemoveConfirm = async () => {
    if (!user || !unfriendTarget || isUnfriendLoading) return;
    setIsUnfriendLoading(true);
    try {
      await removeFriend(user.id, unfriendTarget.id);
      await loadData();
      setIsUnfriendModalOpen(false);
      setUnfriendTarget(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to unfriend user.");
    } finally {
      setIsUnfriendLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full h-full min-h-[480px] flex flex-col justify-start items-stretch gap-6 self-start max-w-none animate-in fade-in duration-200">
      
      {/* Top Header Navigation & Action Bar - Stretched all the way */}
      <div className="bg-sentry-card p-4 rounded-lg shadow-lg border border-black/20 flex flex-row items-center justify-between gap-4 w-full">
        
        {/* Top Left Categories / Filters against the Sidebar */}
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={() => setActiveTab("friends")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "friends"
                ? "bg-zinc-700/50 text-white"
                : "text-sentry-text-muted hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            <span>Friends</span>
            {friends.length > 0 && (
              <span className="bg-zinc-800 text-zinc-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                {friends.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("incoming")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "incoming"
                ? "bg-zinc-700/50 text-white"
                : "text-sentry-text-muted hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            <span>Incoming Requests</span>
            {incomingRequests.length > 0 && (
              <span className="bg-[#F23F43] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("outgoing")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "outgoing"
                ? "bg-zinc-700/50 text-white"
                : "text-sentry-text-muted hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            <span>Outgoing Requests</span>
            {outgoingRequests.length > 0 && (
              <span className="bg-sentry-primary text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                {outgoingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Top Right Add Friend Action Button all the way to the right */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap bg-[#23A55A] hover:bg-[#1c8448] text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235A10.107 10.107 0 0112.5 15c2.203 0 4.256.705 5.932 1.905" />
          </svg>
          Add Friend
        </button>
      </div>

      {/* Main Content Area - Stretched */}
      <div className="bg-sentry-card p-6 rounded-lg shadow-lg border border-black/20 flex-1 flex flex-col gap-4 relative min-h-[360px]">
        
        {isRefreshing && (
          <div className="absolute top-4 right-4 text-[10px] text-sentry-text-muted animate-pulse select-none">
            Refreshing...
          </div>
        )}

        {isInitialLoad ? (
          <div className="flex flex-col gap-3 flex-1">
            <div className="h-4 bg-zinc-800/80 rounded w-28 animate-pulse mb-2"></div>
            <SkeletonLoader type="list" count={3} />
          </div>
        ) : (
          <>
            {/* 1. Friends Tab Content */}
        {activeTab === "friends" && (
          <div className="flex flex-col gap-3 flex-1 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sentry-text-muted select-none border-b border-black/10 pb-2">
              All Friends ({friends.length})
            </h3>

            {friends.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-12 animate-in fade-in duration-150">
                <div className="w-16 h-16 bg-zinc-800/60 rounded-full flex items-center justify-center mb-4 text-zinc-600 border border-zinc-700/40">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20M3 11.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM4 19.235v-.11a11.375 11.375 0 019.29-11.233m-1.53 12.37a9.27 9.27 0 01-2.29-.285m12-5.44V12a3 3 0 00-3-3h-.375a6 6 0 00-5.72 4.5" />
                  </svg>
                </div>
                <h3 className="text-zinc-200 font-semibold text-base">Your friends list is empty</h3>
                <p className="text-sentry-text-muted text-xs mt-1.5 max-w-[280px]">
                  No friends have been added yet. Click the <span className="text-[#23A55A] font-bold">Add Friend</span> button above to request connections.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="bg-sentry-input/40 hover:bg-sentry-input/70 border border-black/10 rounded p-4 flex items-center justify-between transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-200">
                        {friend.displayName || "Unknown User"}
                      </span>
                      <span className="text-xs text-sentry-text-muted font-mono">
                        @{friend.username}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => triggerRemoveFriend(friend)}
                      disabled={processingActionId !== null || isUnfriendLoading}
                    >
                      Unfriend
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Incoming Tab Content */}
        {activeTab === "incoming" && (
          <div className="flex flex-col gap-3 flex-1 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sentry-text-muted select-none border-b border-black/10 pb-2">
              Incoming Friend Requests ({incomingRequests.length})
            </h3>

            {incomingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-12 text-sentry-text-muted text-xs">
                No incoming pending friend requests.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-sentry-input/40 hover:bg-sentry-input/70 border border-black/10 rounded p-4 flex items-center justify-between transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-200">
                        {req.sender?.displayName || "Unknown User"}
                      </span>
                      <span className="text-xs text-sentry-text-muted font-mono">
                        @{req.sender?.username}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleStatusUpdate(req.id, "accepted")}
                        isLoading={processingActionId === req.id}
                        disabled={processingActionId !== null && processingActionId !== req.id || isUnfriendLoading}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatusUpdate(req.id, "declined")}
                        disabled={processingActionId !== null || isUnfriendLoading}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Outgoing Tab Content */}
        {activeTab === "outgoing" && (
          <div className="flex flex-col gap-3 flex-1 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sentry-text-muted select-none border-b border-black/10 pb-2">
              Outgoing Friend Requests ({outgoingRequests.length})
            </h3>

            {outgoingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-12 text-sentry-text-muted text-xs">
                No outgoing pending friend requests.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-sentry-input/40 hover:bg-sentry-input/70 border border-black/10 rounded p-4 flex items-center justify-between transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-200">
                        {req.receiver?.displayName || "Unknown User"}
                      </span>
                      <span className="text-xs text-sentry-text-muted font-mono">
                        @{req.receiver?.username}
                      </span>
                    </div>
                    <Button
                      variant="danger-outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(req.id, "cancelled")}
                      isLoading={processingActionId === req.id}
                      disabled={processingActionId !== null && processingActionId !== req.id || isUnfriendLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
          </>
        )}

      </div>

      {/* Add Friend Modal Component */}
      <AddFriendModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRequestSent={loadData}
        incomingRequests={incomingRequests}
        outgoingRequests={outgoingRequests}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Custom Confirmation Modal for Unfriending */}
      <UnfriendConfirmModal
        isOpen={isUnfriendModalOpen}
        onClose={() => {
          if (!isUnfriendLoading) {
            setIsUnfriendModalOpen(false);
            setUnfriendTarget(null);
          }
        }}
        onConfirm={handleRemoveConfirm}
        friendName={unfriendTarget?.displayName || ""}
        friendUsername={unfriendTarget?.username || ""}
        isLoading={isUnfriendLoading}
      />

    </div>
  );
}
