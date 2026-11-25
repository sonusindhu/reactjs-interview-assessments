import type {
  User,
  UserSearchResponse,
} from './types';

const API_BASE_URL = 'https://dummyjson.com';

export async function searchUsers(
  query: string,
  signal?: AbortSignal,
): Promise<User[]> {
  const response = await fetch(
    `${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch users: ${response.status}`,
    );
  }

  const data: UserSearchResponse = await response.json();

  return data.users;
}