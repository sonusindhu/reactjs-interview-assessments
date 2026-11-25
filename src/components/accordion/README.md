# Accordion Component

A reusable, accessible accordion built with React, TypeScript, Context, state management, and ARIA patterns.

## Demo

Route: `/accordion`

Source: `src/pages/AccordionPage.tsx`

## Features

- Single-open mode
- Multiple-open mode
- Default expanded items
- Disabled items
- Accessible expand/collapse buttons
- Hidden inactive panels
- Keyboard support through native buttons
- Reusable compound component structure

## File Structure

```text
accordion/
├── Accordion.tsx       # State and shared context
├── AccordionItem.tsx   # Trigger, panel, and item behavior
├── Accordion.css       # Component styles
├── types.ts            # Shared TypeScript types
└── README.md
```

## Usage

```tsx
<Accordion mode="single" defaultExpanded={["react"]}>
  <AccordionItem id="react" title="What is React?">
    React is a library for building user interfaces.
  </AccordionItem>

  <AccordionItem id="typescript" title="What is TypeScript?">
    TypeScript adds static types to JavaScript.
  </AccordionItem>

  <AccordionItem id="disabled" title="Disabled item" disabled>
    This content cannot be opened.
  </AccordionItem>
</Accordion>
```

## Props

### Accordion

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | Required | Accordion items |
| `mode` | `"single" \| "multiple"` | `"single"` | Controls whether one or several items can be open |
| `defaultExpanded` | `string[]` | `[]` | IDs initially expanded |

### AccordionItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Unique item identifier |
| `title` | `string` | Required | Button label |
| `children` | `ReactNode` | Required | Expanded panel content |
| `disabled` | `boolean` | `false` | Prevents the item from toggling |

## Implementation Explanation

### State Management

The `Accordion` component stores the open item IDs in a `Set<string>`:

```tsx
useState<Set<string>>(() => new Set(defaultExpanded))
```

A `Set` prevents duplicate IDs and makes checking an item efficient. It is converted to a new `Set` before updates because React state should be immutable.

### Single Mode

In single mode, opening a new item first clears the existing set:

```tsx
if (mode === "single") {
  next.clear();
}

next.add(id);
```

### Multiple Mode

In multiple mode, opening and closing individual items does not affect other open items.

### Context

`AccordionContext` shares `expandedItems` and `toggleItem` with nested `AccordionItem` components. This avoids prop drilling and keeps item components composable.

The custom `useAccordion` hook validates that an item is used inside an `Accordion`:

```tsx
if (!context) {
  throw new Error("AccordionItem must be used within an Accordion component.");
}
```

## Accessibility

- The header uses a real native `<button>`.
- `aria-expanded` indicates whether the item is open.
- `aria-controls` associates the button with its panel.
- `role="region"` identifies the panel as an expandable region.
- `aria-labelledby` associates the panel with the button.
- `hidden` removes closed panels from the visual and accessibility state.
- `disabled` prevents interaction and exposes the disabled state.
- `focus-visible` provides a visible keyboard focus indicator.

Native buttons provide Enter and Space activation automatically.

## Interview Questions

### 1. Why use Context for an accordion?

Context is appropriate because the parent owns shared state and multiple nested item components need access to it. It avoids passing `expandedItems` and `toggleItem` through every intermediate component.

### 2. Why use a `Set` instead of an array?

A `Set` provides straightforward duplicate prevention and O(1) average-time membership checks using `has()`. An array would require `includes()` or `indexOf()` to determine whether an item is open.

### 3. Why create a new `Set` during a state update?

Mutating the existing state object can prevent React from detecting an update. Creating a new set ensures an immutable state transition:

```tsx
setExpandedItems((previous) => {
  const next = new Set(previous);
  // modify next
  return next;
});
```

### 4. What is the difference between controlled and uncontrolled state?

This implementation is mostly uncontrolled: users provide `defaultExpanded`, and the component owns subsequent state. A controlled component would accept `expandedItems` and `onExpandedItemsChange` props from the parent.

### 5. How would you validate duplicate IDs?

The component could accept duplicate IDs in its current API. A robust implementation could maintain a `Map`, enforce unique IDs, or throw an error during development if duplicates are detected.

### 6. How would you implement animated collapsing?

CSS transitions could animate height or `grid-template-rows`. However, `hidden` removes a panel immediately and cannot animate in the DOM consistently. A proper animation implementation may keep the panel mounted and use CSS or an animation library.

### 7. How would you support controlled mode?

Add props such as:

```tsx
interface AccordionProps {
  expandedItems?: string[];
  onExpandedItemsChange?: (items: string[]) => void;
}
```

The parent can own state, while internal state becomes an optional fallback.

### 8. What ARIA attributes are important?

The key attributes are `aria-expanded`, `aria-controls`, `aria-labelledby`, and `role="region"`. The panel should also be removed or hidden when closed.

## Complexity

- Toggle operation: O(n) only for creating a `Set` copy, depending on the number of open IDs.
- Check whether an item is open: O(1) average with `Set.has()`.
- Rendering: O(n), where `n` is the number of accordion items.

## Common Interview Pitfalls

- Mutating React state directly
- Using array indices instead of stable unique IDs
- Making a `<div>` clickable instead of using a button
- Forgetting `aria-controls` and `aria-expanded`
- Not handling disabled items
- Clearing all items even in multiple mode
- Forgetting cleanup or unique panel IDs
- Rendering closed content with `display` only instead of hiding it from assistive technology

## Possible Improvements

- Controlled and uncontrolled modes
- Allowing an entire accordion to disable interactions
- Supporting multiple initial expansions in every mode
- Unique ID validation
- CSS height animation
- Focus management when disabling or removing items
- Unit tests for single mode, multiple mode, and context misuse
