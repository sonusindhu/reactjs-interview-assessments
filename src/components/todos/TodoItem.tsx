import { memo, useState } from 'react';

import type {
  FormEvent,
  KeyboardEvent,
} from 'react';

import type {
  Todo,
  TodoPriority,
} from './types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (
    id: string,
    title: string,
    priority: TodoPriority,
  ) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] =
    useState<TodoPriority>(todo.priority);

  const handleEdit = () => {
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setIsEditing(true);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = editTitle.trim();

    if (!normalizedTitle) {
      return;
    }

    onUpdate(todo.id, normalizedTitle, editPriority);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li className="todo-item">
      {isEditing ? (
        <form
          className="todo-edit-form"
          onSubmit={handleSave}
        >
          <input
            autoFocus
            value={editTitle}
            maxLength={200}
            aria-label="Edit task title"
            onChange={(event) =>
              setEditTitle(event.target.value)
            }
            onKeyDown={handleKeyDown}
          />

          <select
            value={editPriority}
            aria-label="Edit task priority"
            onChange={(event) =>
              setEditPriority(
                event.target.value as TodoPriority,
              )
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button type="submit" disabled={!editTitle.trim()}>
            Save
          </button>

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <input
            type="checkbox"
            checked={todo.completed}
            aria-label={`Complete ${todo.title}`}
            onChange={() => onToggle(todo.id)}
          />

          <span
            className={
              todo.completed ? 'todo-title completed' : 'todo-title'
            }
          >
            {todo.title}
          </span>

          <span className={`priority priority-${todo.priority}`}>
            {todo.priority}
          </span>

          <div className="todo-actions">
            <button
              type="button"
              aria-label={`Edit ${todo.title}`}
              onClick={handleEdit}
            >
              Edit
            </button>

            <button
              type="button"
              aria-label={`Delete ${todo.title}`}
              onClick={() => onDelete(todo.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
});