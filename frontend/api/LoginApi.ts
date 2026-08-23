const BASE_URL = "http://localhost:8080/api/v1.0";

export interface User {
  id: number;
  username: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
}

/**
 * Authenticates a user with username and password.
 * POST /auth/login
 */
export async function loginUser(username: string, passwordHash: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password: passwordHash }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password.");
  }

  return response.json();
}

/**
 * Logs out the user.
 * POST /auth/logout
 */
export async function logoutUser(): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
  });
}