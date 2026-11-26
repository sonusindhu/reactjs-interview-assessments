import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface Column<T> {
  key: keyof T;
  header: string;

  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;

  cell?: (row: T) => ReactNode;

  compare?: (a: T, b: T) => number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];

  getRowId: (row: T) => string;

  loading?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
}