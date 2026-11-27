# React.js Interview Assessments

A curated React and TypeScript assessment workspace demonstrating how to build reusable UI components for frontend technical interviews.

The repository focuses on the complete engineering process: component API design, state management, accessibility, async request handling, keyboard interaction, performance, testing considerations, and implementation trade-offs.

## Assessment Overview

| Assessment | Primary Concepts | Component Guide |
| --- | --- | --- |
| Accordion | Compound components, Context, immutable state, ARIA, single/multiple modes | [Open guide](src/components/accordion/README.md) |
| Autocomplete | Debouncing, fetch cancellation, race conditions, keyboard navigation, combobox accessibility | [Open guide](src/components/autocomplete/README.md) |
| Todo | Reducers, custom hooks, derived state, persistence, filtering, search, and editing | [Open guide](src/components/todos/README.md) |

## Interview Learning Path

The assessments are ordered by the core React concepts typically explored in interviews:

1. **API design** — Create clear, reusable props and predictable component behavior.
2. **State modeling** — Choose the correct state shape and update strategy.
3. **Composition** — Prefer composable components and Context over prop drilling.
4. **Accessibility** — Support keyboard, screen readers, focus, and ARIA relationships.
5. **Asynchronous behavior** — Debounce input, cancel stale requests, and prevent race conditions.
6. **Testing** — Verify state transitions, DOM behavior, async lifecycle, and accessibility attributes.
7. **Trade-offs** — Explain controlled versus uncontrolled APIs and the cost of implementation choices.

## Live Examples

| Route | Example |
| --- | --- |
| `/` | Project overview and assessment navigation |
| `/accordion` | Single-open and multiple-open accordion examples |
| `/autocomplete` | Debounced user search with loading, error, and no-results states |
| `/todos` | Todo list with search, filter, and edit functionalities |

## Architecture

```text
src/
├── components/
│   ├── accordion/
│   │   ├── Accordion.tsx       # Shared state and Context provider
│   │   ├── AccordionItem.tsx   # Trigger and expandable panel
│   │   ├── Accordion.css
│   │   ├── types.ts
│   │   └── README.md
│   ├── autocomplete/
│   │   ├── Autocomplete.tsx    # Combobox UI and interactions
│   │   ├── useDebouncedValue.ts
│   │   ├── useUsersSearch.ts
│   │   ├── userService.ts
│   │   ├── types.ts
│   │   └── README.md
│   └── todos/
│       ├── TodoForm.tsx        # New-task form
│       ├── TodoList.tsx        # Filtered todo list
│       ├── TodoItem.tsx        # Completion, editing, and deletion
│       ├── TodoFilters.tsx     # Status filters and clear action
│       ├── TodoStats.tsx       # Derived todo counts
│       ├── useTodos.ts         # Reducer-backed todo hook
│       ├── todoStorage.ts      # Validated localStorage persistence
│       ├── types.ts
│       └── README.md
├── pages/
│   ├── AccordionPage.tsx
│   ├── AutocompletePage.tsx
│   └── TodoPage.tsx
├── App.tsx                     # Assessment landing page
├── app.routes.tsx              # Route definitions
└── main.tsx                    # React application entry point
```

## Suggested Next Improvements

- Add Vitest and React Testing Library.
- Add Playwright or Cypress browser tests.
- Support controlled and uncontrolled component modes.
- Add result caching and request deduplication.
- Virtualize large autocomplete result sets.
- Introduce Storybook or interactive component documentation.
- Add skeleton or shimmer loading states.
- Improve reduced-motion support.
- Add unique accordion ID validation in development.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open the URL printed by Vite in your browser.

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run lint checks

```bash
npm run lint
```

## Author

Created by Sonu Sindhu:

- [GitHub](https://github.com/sonusindhu)
- [X / Twitter](https://x.com/sonusindhu10)
