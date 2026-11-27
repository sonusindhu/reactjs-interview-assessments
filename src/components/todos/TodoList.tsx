import { memo } from 'react';

import { TodoItem } from './TodoItem';

import type {
  Todo,
  TodoPriority,
} from './types';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onUpdate: (
    id: string,
    title: string,
    priority: TodoPriority,
  ) => void;
  onDelete: (id: string) => void;
}

export const TodoList = memo(function TodoList({
  todos,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="todo-empty">
        No tasks found. Add a new task to get started.
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
});