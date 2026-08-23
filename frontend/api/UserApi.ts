const BASE_URL = "http://localhost:8080/api/v1.0";

export interface User {
  id: number;
  username: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
}

export interface CreateUserPayload {
  username: string;
  displayName: string;
  passwordHash: string;
}

export interface UpdateUsernameRequest {
  newUsername: string;
}

export interface UpdateDisplayNameRequest {
  newDisplayName: string;
}

/**
 * Registers a new user.
 * POST /users
 */
export async function createUser(payload: CreateUserPayload): Promise<User> {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create account. Username might already exist.");
  }

  return response.json();
}

/**
 * Resolves a user's details by their username.
 * GET /users/username/{username}
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  const response = await fetch(`${BASE_URL}/users/username/${username}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Server error occurred while checking username availability.");
  }

  return response.json();
}

/**
 * Retrieves the currently logged in user profile details.
 * GET /users/me
 */
export async function getMe(userId: number): Promise<User> {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${userId}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load user profile session.");
  }

  return response.json();
}

/**
 * Patches the currently logged in user's username.
 * PATCH /users/me/username
 */
export async function updateUsername(userId: number, newUsername: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/users/me/username`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userId}`,
    },
    body: JSON.stringify({ newUsername }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update username. It might be already taken.");
  }

  return response.json();
}

/**
 * Patches the currently logged in user's display name.
 * PATCH /users/me/display-name
 */
export async function updateDisplayName(userId: number, newDisplayName: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/users/me/display-name`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userId}`,
    },
    body: JSON.stringify({ newDisplayName }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update display name.");
  }

  return response.json();
}
