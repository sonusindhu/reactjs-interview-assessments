# Autocomplete Component

A reusable user-search autocomplete built with React, TypeScript, debouncing, request cancellation, keyboard navigation, and accessible combobox patterns.

## Demo

Route: `/autocomplete`

Source: `src/pages/AutocompletePage.tsx`

## Features

- Debounced API search
- Minimum character threshold
- Loading, error, and no-results states
- Arrow-key navigation
- Enter-key selection
- Escape-key dismissal
- Outside-click dismissal
- Clear button
- Abort stale requests
- Combobox/listbox ARIA semantics
- Selected user callback

## File Structure

```text
autocomplete/
├── Autocomplete.tsx       # Input, suggestions, selection, and keyboard behavior
├── Autocomplete.css       # Component styles
├── useDebouncedValue.ts   # Generic debounce hook
├── useUsersSearch.ts      # Search state and request lifecycle
├── userService.ts         # DummyJSON API request
├── types.ts               # Component and API types
├── index.ts               # Public exports
└── README.md
```

## Usage

```tsx
<Autocomplete
  placeholder="Search users..."
  minCharacters={2}
  debounceMs={300}
  onSelect={(user) => {
    console.log("Selected:", user);
  }}
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` | `"Search users..."` | Input placeholder text |
| `minCharacters` | `number` | `2` | Minimum input length before searching |
| `debounceMs` | `number` | `300` | Search delay after typing stops |
| `onSelect` | `(user: User) => void` | `undefined` | Called after a suggestion is selected |

## User Type

```tsx
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}
```

## API

The component requests:

```text
GET https://dummyjson.com/users/search?q=<query>
```

The query is URL-encoded with `encodeURIComponent()` and sent with an optional `AbortSignal`.

## Data Flow

```text
Input change
  → searchQuery state
  → useDebouncedValue
  → debounced query
  → useUsersSearch
  → AbortController/fetch
  → loading / users / error state
  → rendered suggestions
```

## Debouncing

`useDebouncedValue` updates only after the configured delay:

```tsx
useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    setDebouncedValue(value);
  }, delay);

  return () => window.clearTimeout(timeoutId);
}, [value, delay]);
```

Debouncing reduces API requests while the user is rapidly typing.

The component distinguishes debouncing from network loading:

```tsx
const isDebouncing =
  searchQuery.trim().length >= minCharacters &&
  searchQuery !== debouncedQuery;
```

## Minimum Character Threshold

Search is only enabled when the trimmed query meets `minCharacters`:

```tsx
useUsersSearch(
  debouncedQuery.trim().length >= minCharacters
    ? debouncedQuery.trim()
    : "",
);
```

This avoids unnecessary API traffic for short searches.

## Request Cancellation

`useUsersSearch` creates an `AbortController` and passes its signal to `fetch`:

```tsx
const controller = new AbortController();
searchUsers(query, controller.signal);
```

The cleanup function aborts the previous request whenever the query changes or the component unmounts:

```tsx
return () => {
  isActive = false;
  controller.abort();
};
```

`isActive` prevents an already resolved asynchronous callback from updating unmounted or obsolete state.

## Keyboard Navigation

| Key | Behavior |
| --- | --- |
| `ArrowDown` | Open suggestions or move to the next option |
| `ArrowUp` | Move to the previous option |
| `Enter` | Select the active option |
| `Escape` | Close the list and reset the active index |

`activeIndex` tracks the highlighted option. `aria-activedescendant` tells assistive technology which list option is active.

## Mouse and Focus Behavior

- Clicking an option calls `handleSelect()`.
- `onMouseDown` prevents the input from losing focus before the click event.
- Clicking outside closes the list through a document `pointerdown` listener.
- The clear button resets the input and focuses it again.
- Opening the input restores suggestions when the query is long enough.

## Accessibility

The input uses the combobox pattern:

- `role="combobox"`
- `aria-autocomplete="list"`
- `aria-expanded` indicates whether suggestions are visible
- `aria-controls` points to the listbox ID
- `aria-activedescendant` identifies the active option

The suggestions use:

- `role="listbox"`
- `role="option"`
- `aria-selected`
- `aria-busy` during debounce or loading
- `role="status"` for error and no-results messages

## Interview Questions

### 1. Why debounce autocomplete requests?

A request for every keystroke is expensive and can cause network congestion. Debouncing waits until typing pauses, reducing the number of API calls and requests for intermediate input values.

### 2. What is the difference between debouncing and throttling?

Debouncing executes once after a quiet period. Throttling limits a function to at most one execution during a fixed time interval.

### 3. Why abort previous requests?

The latest query should determine the current result. Without cancellation, an older response may arrive after a newer response and overwrite it.

### 4. What is an `AbortController`?

An `AbortController` provides an `AbortSignal` that can cancel a fetch operation and associated browser work. It is passed through `fetch(query, { signal })`.

### 5. Why use `isActive` in addition to `AbortController`?

`isActive` protects against state updates after cleanup caused by component unmount or stale effects. An abort may not cover every timing or runtime edge case.

### 6. How does `useEffect` cleanup work?

The effect returns a cleanup function. React runs it before running the effect again and when the component unmounts:

```tsx
useEffect(() => {
  // start work
  return () => {
    // cancel work
  };
}, [query]);
```

### 7. How is keyboard active-index state managed?

ArrowDown increments the index and ArrowUp decrements it. Enter selects the user at the current index. The index resets after a selection, query change, Escape, or when API results change.

### 8. Why is the outside-click listener added only when open?

It reduces unnecessary global event activity. The listener is installed when `isOpen` is true and removed by the effect cleanup when it closes.

### 9. What is the difference between `searchQuery` and `debouncedQuery`?

- `searchQuery` updates immediately with the input.
- `debouncedQuery` updates after the debounce delay.

This distinction supports immediate UI updates while avoiding an API request for every keystroke.

### 10. How would you test this component?

Test:

- No request below the minimum character count
- One request after the debounce delay
- Cancellation of stale requests
- Loading, success, error, and empty states
- Arrow navigation boundaries
- Enter selection
- Escape dismissal
- Outside-click dismissal
- Clear behavior
- `onSelect` callback
- ARIA state changes

### 11. How would you virtualize a very large result list?

Render only visible items using a library or custom windowing logic. This avoids creating thousands of DOM nodes and reduces rendering cost.

### 12. How would you improve cache behavior?

Add a `Map` or cache hook keyed by normalized query. Cache successful results briefly and optionally add stale-while-revalidate behavior.

### 13. How would you handle race conditions besides cancellation?

Track an effect/query-specific request ID and ignore obsolete responses. Combine request IDs with cancellation for reliable behavior across browsers and non-fetch code.

### 14. What would you change for a controlled autocomplete?

Accept `value`, `defaultValue`, and `onChange` props so a parent can control the input. This is useful for forms and two-way state synchronization.

### 15. Should selected text trigger a new search?

No. The implementation sets `searchQuery` to an empty string after selection and closes the list, preventing the selected value from generating another search.

## Complexity

- Input update: O(1)
- Active-index update: O(1)
- Rendering `n` suggestions: O(n)
- Debounce: one timeout per value change
- API cache lookup: O(1) if implemented with `Map`

## Common Interview Pitfalls

- Making a request on every keystroke
- Forgetting to trim or URL-encode input
- Not setting a minimum character threshold
- Ignoring stale responses
- Not aborting requests on unmount
- Updating state after unmount
- Using `<div>` elements instead of proper listbox roles
- Using mouse selection without preserving input focus
- `aria-activedescendant` using an invalid or missing option ID
- Forgetting ArrowUp or Escape behavior
- Allowing stale loading state to replace newer results
- Opening suggestions for empty or short queries

## API Error Handling

The service throws when the HTTP response is not successful:

```tsx
if (!response.ok) {
  throw new Error(`Failed to fetch users: ${response.status}`);
}
```

The hook converts unknown failures into a user-friendly state:

```tsx
error: "Unable to fetch users. Please try again."
```

`AbortError` is intentionally ignored because it represents cleanup, not a user-facing API failure.

## Possible Improvements

- Highlight matching text
- Async loading indicators with reduced-motion support
- Query-result caching
- Request deduplication
- Result virtualization
- Multi-selection support
- Controlled input mode
- Server-side pagination
- WCAG combobox testing with screen readers
- Local state cancellation for image loading
- Unit and integration tests
