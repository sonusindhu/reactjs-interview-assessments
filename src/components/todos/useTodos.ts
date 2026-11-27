import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import type {
  Todo,
  TodoAction,
  TodoPriority,
} from './types';

import {
  loadTodos,
  saveTodos,
} from './todoStorage';

function todoReducer(
  state: Todo[],
  action: TodoAction,
): Todo[] {
  switch (action.type) {
    case 'ADD_TODO':
      return [action.payload, ...state];

    case 'UPDATE_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? {
              ...todo,
              title: action.payload.title,
              priority: action.payload.priority,
            }
          : todo,
      );

    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo,
      );

    case 'DELETE_TODO':
      return state.filter(
        (todo) => todo.id !== action.payload.id,
      );

    case 'CLEAR_COMPLETED':
      return state.filter((todo) => !todo.completed);

    default:
      return state;
  }
}

export function useTodos() {
  const [todos, dispatch] = useReducer(
    todoReducer,
    undefined,
    loadTodos,
  );

  // Persist whenever the Todo state changes.
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback(
    (title: string, priority: TodoPriority) => {
      const normalizedTitle = title.trim();

      if (!normalizedTitle) {
        return;
      }

      const todo: Todo = {
        id: crypto.randomUUID(),
        title: normalizedTitle,
        completed: false,
        priority,
        createdAt: Date.now(),
      };

      dispatch({
        type: 'ADD_TODO',
        payload: todo,
      });
    },
    [],
  );

  const updateTodo = useCallback(
    (
      id: string,
      title: string,
      priority: TodoPriority,
    ) => {
      const normalizedTitle = title.trim();

      if (!normalizedTitle) {
        return;
      }

      dispatch({
        type: 'UPDATE_TODO',
        payload: {
          id,
          title: normalizedTitle,
          priority,
        },
      });
    },
    [],
  );

  const toggleTodo = useCallback((id: string) => {
    dispatch({
      type: 'TOGGLE_TODO',
      payload: { id },
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({
      type: 'DELETE_TODO',
      payload: { id },
    });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({
      type: 'CLEAR_COMPLETED',
    });
  }, []);

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

  return {
    todos,
    stats,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  };
}