export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: number;
}

export type TodoAction =
  | {
      type: 'ADD_TODO';
      payload: Todo;
    }
  | {
      type: 'UPDATE_TODO';
      payload: {
        id: string;
        title: string;
        priority: TodoPriority;
      };
    }
  | {
      type: 'TOGGLE_TODO';
      payload: {
        id: string;
      };
    }
  | {
      type: 'DELETE_TODO';
      payload: {
        id: string;
      };
    }
  | {
      type: 'CLEAR_COMPLETED';
    };