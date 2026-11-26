import { useMemo, useState } from 'react';

import type {
  Column,
  SortConfig,
} from './types';

interface UseDataTableOptions<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  initialPageSize: number;
}

export function useDataTable<T>({
  data,
  columns,
  getRowId,
  initialPageSize,
}: UseDataTableOptions<T>) {
  const [search, setSearch] = useState('');

  const [columnFilters, setColumnFilters] =
    useState<Partial<Record<keyof T, string>>>({});

  const [sortConfig, setSortConfig] =
    useState<SortConfig<T> | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] =
    useState(initialPageSize);

  const [selectedIds, setSelectedIds] =
    useState<Set<string>>(() => new Set());

  // Global search and column filtering
  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return data.filter((row) => {
      const matchesSearch =
        !normalizedSearch ||
        columns.some((column) => {
          if (column.searchable === false) {
            return false;
          }

          const value = String(row[column.key] ?? '');

          return value
            .toLowerCase()
            .includes(normalizedSearch);
        });

      const matchesColumnFilters = columns.every(
        (column) => {
          const filterValue = columnFilters[column.key];

          if (!filterValue?.trim()) {
            return true;
          }

          if (column.filterable === false) {
            return true;
          }

          const value = String(row[column.key] ?? '');

          return value
            .toLowerCase()
            .includes(filterValue.trim().toLowerCase());
        },
      );

      return matchesSearch && matchesColumnFilters;
    });
  }, [data, columns, search, columnFilters]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return filteredData;
    }

    const { key, direction } = sortConfig;

    const column = columns.find(
      (item) => item.key === key,
    );

    const compare = (a: T, b: T) => {
      if (column?.compare) {
        return column.compare(a, b);
      }

      const valueA = a[key];
      const valueB = b[key];

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return 1;
      if (valueB == null) return -1;

      if (
        typeof valueA === 'number' &&
        typeof valueB === 'number'
      ) {
        return valueA - valueB;
      }

      return String(valueA).localeCompare(
        String(valueB),
        undefined,
        { numeric: true, sensitivity: 'base' },
      );
    };

    return [...filteredData].sort((a, b) => {
      const result = compare(a, b);

      return direction === 'asc' ? result : -result;
    });
  }, [filteredData, sortConfig, columns]);

  // Pagination
  const totalItems = sortedData.length;

  const totalPages = Math.ceil(totalItems / pageSize);

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1),
  );

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;

    return sortedData.slice(
      startIndex,
      startIndex + pageSize,
    );
  }, [sortedData, safeCurrentPage, pageSize]);

  // Search handlers
  const updateSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const updateColumnFilter = (
    key: keyof T,
    value: string,
  ) => {
    setColumnFilters((previous) => ({
      ...previous,
      [key]: value,
    }));

    setCurrentPage(1);
  };

  // Sorting handler
  const updateSorting = (key: keyof T) => {
    setSortConfig((previous) => {
      if (previous?.key !== key) {
        return {
          key,
          direction: 'asc',
        };
      }

      if (previous.direction === 'asc') {
        return {
          key,
          direction: 'desc',
        };
      }

      return null;
    });

    setCurrentPage(1);
  };

  // Pagination handlers
  const updatePage = (page: number) => {
    setCurrentPage(
      Math.max(1, Math.min(page, Math.max(totalPages, 1))),
    );
  };

  const updatePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Row selection
  const toggleRowSelection = (id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const isAllPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) =>
      selectedIds.has(getRowId(row)),
    );

  const isSomePageSelected =
    paginatedData.some((row) =>
      selectedIds.has(getRowId(row)),
    );

  const togglePageSelection = () => {
    setSelectedIds((previous) => {
      const next = new Set(previous);

      if (isAllPageSelected) {
        paginatedData.forEach((row) => {
          next.delete(getRowId(row));
        });
      } else {
        paginatedData.forEach((row) => {
          next.add(getRowId(row));
        });
      }

      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  return {
    search,
    columnFilters,
    sortConfig,
    currentPage: safeCurrentPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedData,
    selectedIds,
    isAllPageSelected,
    isSomePageSelected,

    updateSearch,
    updateColumnFilter,
    updateSorting,
    updatePage,
    updatePageSize,
    toggleRowSelection,
    togglePageSelection,
    clearSelection,
  };
}