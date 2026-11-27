# Todo Component

A reusable Todo application built with React, TypeScript, `useReducer`, custom hooks, and `localStorage` persistence.

## Demo

Route: `/todos`

Source: `src/pages/TodoPage.tsx`

## Features

- Add tasks with low, medium, or high priority
- Mark tasks as active or completed
- Edit task titles and priorities
- Delete individual tasks
- Search tasks by title
- Filter tasks by All, Active, or Completed
- Clear all completed tasks
- Display total, active, and completed counts
- Persist todos in `localStorage`
- Validate persisted data before restoring it
- Support keyboard submission and editing cancellation
- Prevent empty task titles

## File Structure

```text
todos/
├── TodoForm.tsx       # Add-task form
├── TodoList.tsx       # Filtered todo list and empty state
├── TodoItem.tsx       # Completion, editing, and deletion UI
├── TodoFilters.tsx    # Status filters and clear-completed action
├── TodoStats.tsx      # Task statistics
├── useTodos.ts        # Todo state, reducer, actions, and derived statistics
├── todoStorage.ts     # localStorage loading and persistence
├── types.ts           # Todo, action, filter, and priority types
├── Todos.css          # Component styles
├── index.ts           # Public exports
└── README.md
```

## Usage

```tsx
import { useTodos } from './useTodos';

function TodoExample() {
  const {
    todos,
    stats,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos();

  return (
    <TodoForm onAdd={addTodo} />
  );
}
```

The `TodoPage` composes the feature components and owns search and filter state:

```tsx
const [filter, setFilter] = useState<TodoFilter>('all');
const [search, setSearch] = useState('');
```

## Data Model

```tsx
export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: number;
}
```

## State Management

The custom `useTodos` hook owns the Todo collection and exposes domain operations.

```tsx
const [todos, dispatch] = useReducer(
  todoReducer,
  undefined,
  loadTodos,
);
```

A reducer makes state transitions explicit and predictable:

- `ADD_TODO`
- `UPDATE_TODO`
- `TOGGLE_TODO`
- `DELETE_TODO`
- `CLEAR_COMPLETED`

Every reducer operation returns a new array or a new updated Todo object. Existing state is never mutated directly.

### Why use `useReducer`?

`useReducer` is useful when related state transitions follow multiple business rules. It centralizes updates and makes each action easy to test and explain.

`useState` could manage the same data, but a reducer gives the state machine clearer intent as the number of operations grows.

## Domain Operations

### Add Todo

```tsx
addTodo(title, priority);
```

The operation trims the title, rejects an empty value, creates a unique ID with `crypto.randomUUID()`, and dispatches `ADD_TODO`.

New todos are placed before existing todos:

```tsx
return [action.payload, ...state];
```

### Update Todo

The update operation validates the title, then replaces the matching Todo with a copied object containing the updated title and priority.

### Toggle Todo

Each Todo is mapped by ID. The matching Todo is copied with `completed` inverted:

```tsx
completed: !todo.completed
```

### Delete Todo

Deleting filters out the Todo with the matching ID.

### Clear Completed

The `CLEAR_COMPLETED` action keeps only Todos that are not completed.

## Derived State

Statistics are memoized from the Todo collection:

```tsx
const stats = useMemo(() => {
  const completed = todos.filter(
    (todo) => todo.completed,
  ).length;

  return {
    total: todos.length,
    completed,
    active: todos.length - completed,
  };
}, [todos]);
```

Search and filter results are also memoized in `TodoPage`:

```tsx
const normalizedSearch = search.trim().toLowerCase();

return todos.filter((todo) => {
  const matchesSearch = todo.title
    .toLowerCase()
    .includes(normalizedSearch);

  const matchesFilter =
    filter === 'all' ||
    (filter === 'active' && !todo.completed) ||
    (filter === 'completed' && todo.completed);

  return matchesSearch && matchesFilter;
});
```

## Persistence

Todos are restored from `localStorage` through the reducer initializer.

```tsx
useReducer(todoReducer, undefined, loadTodos)
```

An effect persists the latest collection whenever it changes:

```tsx
useEffect(() => {
  saveTodos(todos);
}, [todos]);
```

The storage module:

- Uses the key `react-interview-todos`
- Parses JSON inside a `try/catch` block
- Rejects non-array stored values
- Validates each object before exposing it to the app
- Logs persistence errors
- Fails safely when data is missing or malformed

## Editing Behavior

`TodoItem` maintains local editing state:

- `isEditing`
- `editTitle`
- `editPriority`

Opening edit mode initializes those values from the Todo. Saving validates the title and calls `onUpdate`. Cancel restores the original values and exits edit mode.

Pressing Escape inside the edit input resets the state and closes the form.

## Component Design

The implementation separates responsibilities:

| Component | Responsibility |
| --- | --- |
| `TodoPage` | Search/filter state and page composition |
| `TodoForm` | New task input and priority selection |
| `TodoStats` | Derived count presentation |
| `TodoFilters` | Status filter and clear-completed controls |
| `TodoList` | List rendering and empty state |
| `TodoItem` | Completion, edit, and delete behavior |
| `useTodos` | Domain state and actions |
| `todoStorage` | Browser persistence adapter |

## Memoization

`TodoList` and `TodoItem` use `memo` to reduce unnecessary rerenders.

Memoization does not replace correct props or state design. Stable callback references created with `useCallback` are important when passing callbacks to memoized child components.

## Accessibility

- Native `<form>`, `<input>`, `<select>`, and `<button>` elements are used.
- Inputs have descriptive `aria-label` attributes.
- The search input explicitly describes its purpose.
- Filter buttons expose their active state with `aria-pressed`.
- Disabled controls prevent empty or invalid actions.
- Edit mode provides Save and Cancel actions.
- Escape cancels editing.
- Auto-focus improves the edit workflow.
- Completed task text is visually crossed out.

## Keyboard Behavior

| Context | Key | Action |
| --- | --- | --- |
| Task form | Enter | Submit the form |
| Edit input | Enter | Save changes |
| Edit input | Escape | Cancel editing |
| Controls | Tab | Move to the next native control |

## Interview Questions

### 1. Why use `useReducer` instead of multiple `useState` calls?

The Todo collection has coordinated operations with strict update rules. `useReducer` keeps those transitions in one reducer and makes action types explicit. It is easier to test and reason about than separate state variables that update independently.

### 2. Why use a custom hook?

`useTodos` separates domain behavior from page presentation. Components do not need to know about reducer actions or persistence details.

### 3. What is the difference between controlled and uncontrolled state here?

The Todo collection is internally controlled by `useTodos`. Form inputs such as titles and priorities are controlled through local `useState` values. The parent can also control filters and search from `TodoPage`.

### 4. Why create a new Todo object during updates?

React state should be immutable. Copying the matching Todo ensures the collection can detect a change without mutating existing state.

### 5. Why does `crypto.randomUUID()` help?

It creates unique, stable IDs for React keys and update/delete operations. A stable ID should not change after rerender or persistence reload.

### 6. Why should Todo IDs not be array indexes?

Indexes change when items are deleted or reordered. That can associate component state with the wrong item and produce incorrect editing behavior.

### 7. Why trim titles?

Trimming removes accidental whitespace and prevents users from creating an empty or visually blank task.

### 8. Why persist in an effect?

Persisting in an effect keeps storage synchronized with all reducer transitions. It also avoids duplicating persistence logic across add, update, toggle, delete, and clear actions.

### 9. What happens if `localStorage` contains invalid data?

`loadTodos` first parses the value and then validates every item. Invalid JSON, a non-array value, or a malformed Todo is ignored or removed safely.

### 10. Why validate persisted values?

`localStorage` is external, mutable browser state. Values can be missing fields or contain outdated property types. Runtime validation prevents a malformed stored collection from breaking the UI.

### 11. Why use `useMemo` for statistics and filtering?

Memoization avoids recalculating derived values during unrelated renders. Filtering remains O(n), but it does not run unless one of its dependencies changes.

### 12. How does the edit workflow handle stale props?

Opening edit mode initializes local edit state from the latest Todo props. Saving dispatches the update and exits edit mode. Canceling resets local values to the current Todo values.

### 13. Why use `memo` for `TodoList` and `TodoItem`?

They are display-oriented components that can benefit from skipping unchanged rerenders. `TodoItem` receives a unique Todo and callbacks, while `TodoList` rerenders when its filtered list changes.

### 14. What are the limitations of `localStorage`?

- It is synchronous.
- It has limited capacity.
- It is unavailable in some privacy or storage-blocked contexts.
- It only stores strings.
- It is local to one browser and origin.
- It is not suitable for server synchronization or cross-device data.

### 15. How would you test this implementation?

Test:

- Adding a valid Todo
- Rejecting an empty Todo
- Trimming whitespace
- Toggling completion
- Editing and canceling edits
- Deleting a Todo
- Clearing completed Todos
- Filtering by All, Active, and Completed
- Searching case-insensitively
- Restoring valid stored Todos
- Ignoring malformed stored data
- Persistence after state changes
- Escape and Enter behavior
- Empty-list presentation

## Complexity

- Add: O(n) when copying and persisting the collection
- Update: O(n) for mapping all Todos
- Toggle: O(n)
- Delete: O(n)
- Clear completed: O(n)
- Search/filter: O(n)
- Statistics: O(n)
- Persistence: O(n) for JSON serialization

## Common Interview Pitfalls

- Mutating state or reducer objects directly
- Using array indexes as keys
- Saving derived UI state instead of source state
- Forgetting whitespace validation
- Calling `localStorage` without handling errors
- Trusting persisted data without validation
- Recomputing derived values without memoization where needed
- Passing unstable callbacks to memoized children
- Filtering only by status and forgetting search combinations
- Losing focus or unsaved edit state unexpectedly
- Showing stale statistics after Todo updates
- Treating `localStorage` as a secure or cross-device database

## Possible Improvements

- Controlled edit state in the Todo hook
- Sorting by priority or creation date
- Inline or global drag-and-drop ordering
- Undo delete and clear-completed actions
- Confirmation for destructive actions
- Pagination or virtualization for very large lists
- Debounced search
- Server synchronization
- IndexedDB for larger data
- Optimistic updates with rollback
- Unit tests for the reducer and storage module
- Integration tests for forms and filters
- Context or external state management for larger applications
