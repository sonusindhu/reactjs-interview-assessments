import { useEffect, useState } from 'react';

import { searchUsers } from './userService';
import type { User } from './types';

interface UsersSearchState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export function useUsersSearch(query: string) {
  const [state, setState] = useState<UsersSearchState>({
    users: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!query.trim()) {
      setState({
        users: [],
        loading: false,
        error: null,
      });

      return;
    }

    const controller = new AbortController();
    let isActive = true;

    const fetchUsers = async () => {
      setState({
        users: [],
        loading: true,
        error: null,
      });

      try {
        const users = await searchUsers(
          query,
          controller.signal,
        );

        if (!isActive) return;

        setState({
          users,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!isActive) return;

        if (
          error instanceof Error &&
          error.name === 'AbortError'
        ) {
          return;
        }

        setState({
          users: [],
          loading: false,
          error: 'Unable to fetch users. Please try again.',
        });
      }
    };

    fetchUsers();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [query]);

  return state;
}