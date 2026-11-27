import { useState } from 'react';

import type {
  FormEvent,
} from 'react';

import type {
  TodoPriority,
} from './types';

interface TodoFormProps {
  onAdd: (
    title: string,
    priority: TodoPriority,
  ) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] =
    useState<TodoPriority>('medium');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    onAdd(normalizedTitle, priority);

    setTitle('');
    setPriority('medium');
  };

  return (
    <form
      className="todo-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={title}
        placeholder="What needs to be done?"
        aria-label="New task title"
        maxLength={200}
        onChange={(event) => setTitle(event.target.value)}
      />

      <select
        value={priority}
        aria-label="Task priority"
        onChange={(event) =>
          setPriority(event.target.value as TodoPriority)
        }
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit" disabled={!title.trim()}>
        Add Task
      </button>
    </form>
  );
}