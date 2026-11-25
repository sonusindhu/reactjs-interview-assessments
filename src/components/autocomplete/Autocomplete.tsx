import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import type {
  ChangeEvent,
  KeyboardEvent,
} from 'react';

import { useDebouncedValue } from './useDebouncedValue';
import { useUsersSearch } from './useUsersSearch';

import type {
  AutocompleteProps,
  User,
} from './types';

import './Autocomplete.css';

export function Autocomplete({
  placeholder = 'Search users...',
  minCharacters = 2,
  debounceMs = 300,
  onSelect,
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const listboxId = useId();

  const debouncedQuery = useDebouncedValue(
    searchQuery,
    debounceMs,
  );

  const {
    users,
    loading,
    error,
  } = useUsersSearch(
    debouncedQuery.trim().length >= minCharacters
      ? debouncedQuery.trim()
      : '',
  );

  const shouldShowSuggestions =
    isOpen &&
    searchQuery.trim().length >= minCharacters;

  const isDebouncing =
    searchQuery.trim().length >= minCharacters &&
    searchQuery !== debouncedQuery;

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setInputValue(value);
    setSearchQuery(value);
    setSelectedUser(null);
    setActiveIndex(-1);
    setIsOpen(true);
  };

  const handleSelect = (user: User) => {
    setInputValue(`${user.firstName} ${user.lastName}`);
    setSearchQuery('');
    setSelectedUser(user);
    setActiveIndex(-1);
    setIsOpen(false);

    onSelect?.(user);
  };

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
    setSelectedUser(null);
    setActiveIndex(-1);
    setIsOpen(false);

    inputRef.current?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!shouldShowSuggestions || users.length === 0) {
        setIsOpen(true);
        return;
      }

      setActiveIndex((previous) =>
        Math.min(previous + 1, users.length - 1),
      );
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      setActiveIndex((previous) =>
        Math.max(previous - 1, 0),
      );
    }

    if (event.key === 'Enter') {
      if (activeIndex >= 0 && users[activeIndex]) {
        event.preventDefault();
        handleSelect(users[activeIndex]);
      }
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !containerRef.current?.contains(target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener(
      'pointerdown',
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handleOutsideClick,
      );
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [users]);

  return (
    <div
      ref={containerRef}
      className="autocomplete"
    >
      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          className="autocomplete-input"
          placeholder={placeholder}
          value={inputValue}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={shouldShowSuggestions}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 && users[activeIndex]
              ? `${listboxId}-${users[activeIndex].id}`
              : undefined
          }
          onChange={handleInputChange}
          onFocus={() => {
            if (
              searchQuery.trim().length >= minCharacters
            ) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
        />

        {inputValue && (
          <button
            type="button"
            className="autocomplete-clear"
            aria-label="Clear search"
            onClick={handleClear}
          >
            ×
          </button>
        )}
      </div>

      {shouldShowSuggestions && (
        <ul
          id={listboxId}
          role="listbox"
          className="autocomplete-list"
          aria-busy={loading || isDebouncing}
        >
          {isDebouncing || loading ? (
            <li className="autocomplete-message">
              Loading...
            </li>
          ) : error ? (
            <li
              className="autocomplete-message autocomplete-error"
              role="status"
            >
              {error}
            </li>
          ) : users.length === 0 ? (
            <li
              className="autocomplete-message"
              role="status"
            >
              No users found.
            </li>
          ) : (
            users.map((user, index) => (
              <li
                key={user.id}
                id={`${listboxId}-${user.id}`}
                role="option"
                aria-selected={activeIndex === index}
                className={`autocomplete-option ${
                  activeIndex === index ? 'active' : ''
                }`}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => handleSelect(user)}
              >
                <img
                  src={user.image}
                  alt=""
                  className="autocomplete-avatar"
                />

                <div className="autocomplete-user-info">
                  <span className="autocomplete-user-name">
                    {user.firstName} {user.lastName}
                  </span>

                  <span className="autocomplete-user-email">
                    {user.email}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      {selectedUser && (
        <p className="autocomplete-selected">
          Selected: {selectedUser.firstName}{' '}
          {selectedUser.lastName}
        </p>
      )}
    </div>
  );
}