import type { TodoFilter } from './types';

interface TodoFiltersProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  onClearCompleted: () => void;
  completedCount: number;
}

const filters: TodoFilter[] = [
  'all',
  'active',
  'completed',
];

export function TodoFilters({
  filter,
  onFilterChange,
  onClearCompleted,
  completedCount,
}: TodoFiltersProps) {
  return (
    <div className="todo-filters">
      <div className="filter-buttons">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? 'active' : ''}
            aria-pressed={filter === item}
            onClick={() => onFilterChange(item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </div>
  );
}