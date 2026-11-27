import type { Todo } from './types';

const STORAGE_KEY = 'react-interview-todos';

export function loadTodos(): Todo[] {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isValidTodo);
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(todos),
    );
  } catch (error) {
    console.error('Unable to save todos:', error);
  }
}

function isValidTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const todo = value as Record<string, unknown>;

  return (
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    typeof todo.completed === 'boolean' &&
    typeof todo.createdAt === 'number' &&
    ['low', 'medium', 'high'].includes(
      todo.priority as string,
    )
  );
}