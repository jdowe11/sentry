import { BASE_URL } from "./config";
import { User } from "./UserApi";

export interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: "pending" | "accepted" | "declined" | "cancelled";
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
}

export interface FriendRequestResponse {
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
}

/**
 * Sends a friend request to another user by their username.
 * POST /friend-requests
 */
export async function sendFriendRequest(userId: number, receiverUsername: string): Promise<FriendRequest> {
  const response = await fetch(`${BASE_URL}/friend-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userId}`,
    },
    body: JSON.stringify({ receiverUsername }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to send friend request.");
  }

  return response.json();
}

/**
 * Retrieves all pending friend requests for the user.
 * GET /friend-requests/pending
 */
export async function getPendingRequests(userId: number): Promise<FriendRequestResponse> {
  const response = await fetch(`${BASE_URL}/friend-requests/pending`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${userId}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load pending friend requests.");
  }

  return response.json();
}

/**
 * Updates a friend request status (accept, decline, or cancel).
 * PATCH /friend-requests/{id}/status
 */
export async function updateFriendRequestStatus(
  userId: number,
  requestId: number,
  status: "accepted" | "declined" | "cancelled"
): Promise<FriendRequest> {
  const response = await fetch(`${BASE_URL}/friend-requests/${requestId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userId}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to update request status to ${status}.`);
  }

  return response.json();
}
