import { BASE_URL } from "./config";
import { User } from "./UserApi";

/**
 * Retrieves the list of friends for the user.
 * GET /friends
 */
export async function getFriends(userId: number): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/friends`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${userId}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load friends list.");
  }

  return response.json();
}

/**
 * Removes a friendship relationship.
 * DELETE /friends/{friendId}
 */
export async function removeFriend(userId: number, friendId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/friends/${friendId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${userId}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to remove friend.");
  }
}
