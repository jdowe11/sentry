"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getPendingRequests,
  updateFriendRequestStatus,
  FriendRequest,
} from "@/api/FriendRequestApi";
import AddFriendModal from "./AddFriendModal";

type TabType = "friends" | "incoming" | "outgoing";

export default function FriendsList() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("friends");
  
  // Pending lists states
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Modal visibility state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load pending list
  const fetchPending = useCallback(async () => {
    if (!user) return;
    setIsLoadingList(true);
    try {
      const res = await getPendingRequests(user.id);
      setIncomingRequests(res.incoming);
      setOutgoingRequests(res.outgoing);
    } catch {
      // Ignore background load failures
    } finally {
      setIsLoadingList(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      fetchPending();
    }, 0);
    return () => clearTimeout(timer);
  }, [user, fetchPending]);

  // Handle updating status (accept, decline, cancel)
  const handleStatusUpdate = async (requestId: number, action: "accepted" | "declined" | "cancelled") => {
    if (!user) return;
    try {
      await updateFriendRequestStatus(user.id, requestId, action);
      fetchPending();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update request.");
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
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "friends"
                ? "bg-zinc-700/50 text-white"
                : "text-sentry-text-muted hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            Friends
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
        
        {isLoadingList && (
          <div className="absolute top-4 right-4 text-[10px] text-sentry-text-muted animate-pulse">
            Refreshing...
          </div>
        )}

        {/* 1. Friends Tab Content */}
        {activeTab === "friends" && (
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
                      <button
                        onClick={() => handleStatusUpdate(req.id, "accepted")}
                        className="bg-[#23A55A] hover:bg-[#1a7e44] text-white px-3 py-1.5 rounded text-xs font-bold transition-all active:scale-[0.97] cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req.id, "declined")}
                        className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-3 py-1.5 rounded text-xs font-bold transition-all active:scale-[0.97] cursor-pointer"
                      >
                        Decline
                      </button>
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
                    <button
                      onClick={() => handleStatusUpdate(req.id, "cancelled")}
                      className="border border-[#F23F43]/40 text-[#F23F43] hover:bg-[#F23F43]/10 px-3 py-1.5 rounded text-xs font-bold transition-all active:scale-[0.97] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Add Friend Modal Component */}
      <AddFriendModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRequestSent={fetchPending}
        incomingRequests={incomingRequests}
        outgoingRequests={outgoingRequests}
        onStatusUpdate={handleStatusUpdate}
      />

    </div>
  );
}
