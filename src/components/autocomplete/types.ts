export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface UserSearchResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface AutocompleteProps {
  placeholder?: string;
  minCharacters?: number;
  debounceMs?: number;
  onSelect?: (user: User) => void;
}