"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  sendFriendRequest,
  FriendRequest,
} from "@/api/FriendRequestApi";
import { searchUsers, User } from "@/api/UserApi";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSent: () => void;
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  onStatusUpdate: (requestId: number, action: "accepted" | "declined" | "cancelled") => Promise<void>;
}

export default function AddFriendModal({
  isOpen,
  onClose,
  onRequestSent,
  incomingRequests,
  outgoingRequests,
  onStatusUpdate,
}: AddFriendModalProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchActionStatus, setSearchActionStatus] = useState<{
    [username: string]: { success?: string; error?: string; loading?: boolean };
  }>({});

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setSearchQuery("");
        setSearchResults([]);
        setSearchActionStatus({});
        setIsSearching(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Debounced search logic
  useEffect(() => {
    if (!user) return;
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const delayDebounce = setTimeout(async () => {
      try {
        const results = await searchUsers(trimmed);
        // Exclude current user from search results
        const filtered = results.filter((u) => u.id !== user.id);
        setSearchResults(filtered);
      } catch {
        // Ignore search errors (e.g. typing rapid updates)
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce buffer

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, user]);

  // Handle sending friend request from modal
  const handleSendFriendRequestFromModal = async (targetUser: User) => {
    if (!user) return;

    setSearchActionStatus((prev) => ({
      ...prev,
      [targetUser.username]: { loading: true },
    }));

    try {
      await sendFriendRequest(user.id, targetUser.username);
      setSearchActionStatus((prev) => ({
        ...prev,
        [targetUser.username]: { success: "Sent!", loading: false },
      }));
      onRequestSent();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to send request.";
      setSearchActionStatus((prev) => ({
        ...prev,
        [targetUser.username]: { error: errMsg, loading: false },
      }));
    }
  };

  // Check relationship status for search results
  const getRelationshipStatus = (targetUser: User) => {
    const isOutgoing = outgoingRequests.find((r) => r.receiverId === targetUser.id);
    if (isOutgoing) return { status: "pending_outgoing", id: isOutgoing.id };

    const isIncoming = incomingRequests.find((r) => r.senderId === targetUser.id);
    if (isIncoming) return { status: "pending_incoming", id: isIncoming.id };

    return null;
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-sentry-card border border-black/25 w-full max-w-[500px] rounded-lg shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150 text-left">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-black/15 pb-3">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2 select-none">
              <svg className="w-5 h-5 text-[#23A55A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235A10.107 10.107 0 0112.5 15c2.203 0 4.256.705 5.932 1.905" />
              </svg>
              Add Friend
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-sentry-text-muted hover:text-white transition-all cursor-pointer p-1.5 hover:bg-zinc-800 rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[10px] font-bold text-sentry-text-muted uppercase tracking-wider select-none">
            Search Users
          </label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Type a username or display name..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim()) {
                  setIsSearching(true);
                } else {
                  setIsSearching(false);
                  setSearchResults([]);
                }
              }}
              className="w-full bg-sentry-input border border-black/20 text-zinc-200 placeholder:text-zinc-600 rounded pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-sentry-primary transition-all"
              autoFocus
            />
            {isSearching && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 text-sentry-text-muted" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Search Results Display Area */}
        <div className="flex-1 flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
          {searchQuery.trim() === "" ? (
            <div className="text-center py-6 text-xs text-sentry-text-muted select-none">
              Type something to search for users...
            </div>
          ) : isSearching && searchResults.length === 0 ? (
            <div className="text-center py-6 text-xs text-sentry-text-muted select-none">
              Searching Sentry network...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-6 text-xs text-sentry-text-muted select-none">
              No users matched &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            searchResults.map((targetUser) => {
              const relationship = getRelationshipStatus(targetUser);
              const actionState = searchActionStatus[targetUser.username];
              const isLoading = actionState?.loading;
              const isSuccess = actionState?.success;
              const isError = actionState?.error;

              return (
                <div
                  key={targetUser.id}
                  className="bg-sentry-input/40 border border-black/10 hover:bg-sentry-input/70 rounded p-3 flex items-center justify-between transition-all gap-2"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {targetUser.displayName}
                    </span>
                    <span className="text-[10px] text-sentry-text-muted font-mono truncate">
                      @{targetUser.username}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {relationship ? (
                      relationship.status === "pending_outgoing" ? (
                        <span className="text-[10px] font-bold text-sentry-text-muted bg-zinc-800/80 border border-zinc-700/30 px-2 py-1 rounded">
                          Pending Outgoing
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                            Incoming Request
                          </span>
                          <button
                            onClick={() => onStatusUpdate(relationship.id, "accepted")}
                            className="bg-[#23A55A] hover:bg-[#1a7e44] text-white px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Accept
                          </button>
                        </div>
                      )
                    ) : isSuccess ? (
                      <span className="text-[10px] font-bold text-[#23A55A] bg-[#23A55A]/10 border border-[#23A55A]/20 px-2 py-1 rounded animate-in fade-in duration-100">
                        ✓ {isSuccess}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendFriendRequestFromModal(targetUser)}
                        disabled={isLoading}
                        className="bg-[#23A55A] hover:bg-[#1a7e44] disabled:opacity-50 text-white px-3 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {isLoading ? "Sending..." : "Add Friend"}
                      </button>
                    )}
                  </div>

                  {isError && (
                    <div className="w-full text-[9px] font-semibold text-red-400 mt-1 block">
                      ⚠️ {isError}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
