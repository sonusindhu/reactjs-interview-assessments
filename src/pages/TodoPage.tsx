import { useMemo, useState } from 'react';

import { useTodos } from '../components/todos/useTodos';

import { TodoForm } from '../components/todos/TodoForm';
import { TodoList } from '../components/todos/TodoList';
import { TodoFilters } from '../components/todos/TodoFilters';
import { TodoStats } from '../components/todos/TodoStats';

import type { TodoFilter } from '../components/todos/types';

import '../components/todos/Todos.css';

function TodoPage() {
  const {
    todos,
    stats,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos();

  const [filter, setFilter] = useState<TodoFilter>('all');
  const [search, setSearch] = useState('');

  const filteredTodos = useMemo(() => {
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
  }, [todos, search, filter]);

  return (
    <main className="todo-app">
      <header className="todo-header">
        <h1>My Tasks</h1>
        <p>Stay organized and get things done.</p>
      </header>

      <TodoStats
        total={stats.total}
        active={stats.active}
        completed={stats.completed}
      />

      <TodoForm onAdd={addTodo} />

      <div className="todo-search">
        <input
          type="search"
          placeholder="Search tasks..."
          aria-label="Search tasks"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <TodoFilters
        filter={filter}
        onFilterChange={setFilter}
        onClearCompleted={clearCompleted}
        completedCount={stats.completed}
      />

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      />

      <footer className="todo-footer">
        {stats.active} task(s) remaining
      </footer>
    </main>
  );
}

export default TodoPage;