import { useDataTable } from './useDataTable';

import type { DataTableProps } from './types';

import './DataTable.css';

export function DataTable<T>({
  data,
  columns,
  getRowId,
  loading = false,
  pageSizeOptions = [5, 10, 20],
  initialPageSize = 5,
}: DataTableProps<T>) {
  const table = useDataTable({
    data,
    columns,
    getRowId,
    initialPageSize,
  });

  const {
    search,
    columnFilters,
    sortConfig,
    currentPage,
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
  } = table;

  const startItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    totalItems,
  );

  return (
    <div className="data-table-container">
      <div className="data-table-toolbar">
        <input
          type="search"
          value={search}
          placeholder="Search..."
          aria-label="Search table"
          onChange={(event) =>
            updateSearch(event.target.value)
          }
        />

        <select
          aria-label="Rows per page"
          value={pageSize}
          onChange={(event) =>
            updatePageSize(Number(event.target.value))
          }
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} rows
            </option>
          ))}
        </select>
      </div>

      {selectedIds.size > 0 && (
        <div className="data-table-selection">
          <span>
            {selectedIds.size} row(s) selected
          </span>

          <button
            type="button"
            onClick={clearSelection}
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  aria-label="Select all rows on current page"
                  checked={isAllPageSelected}
                  ref={(element) => {
                    if (element) {
                      element.indeterminate =
                        isSomePageSelected &&
                        !isAllPageSelected;
                    }
                  }}
                  onChange={togglePageSelection}
                />
              </th>

              {columns.map((column) => (
                <th key={String(column.key)} scope="col">
                  <div className="data-table-header">
                    <span>{column.header}</span>

                    {column.sortable !== false && (
                      <button
                        type="button"
                        className="sort-button"
                        aria-label={`Sort by ${column.header}`}
                        aria-pressed={
                          sortConfig?.key === column.key
                        }
                        onClick={() =>
                          updateSorting(column.key)
                        }
                      >
                        {sortConfig?.key === column.key
                          ? sortConfig.direction === 'asc'
                            ? '↑'
                            : '↓'
                          : '↕'}
                      </button>
                    )}
                  </div>

                  {column.filterable && (
                    <input
                      type="search"
                      className="column-filter"
                      aria-label={`Filter ${column.header}`}
                      placeholder={`Filter ${column.header}`}
                      value={columnFilters[column.key] ?? ''}
                      onChange={(event) =>
                        updateColumnFilter(
                          column.key,
                          event.target.value,
                        )
                      }
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <div className="table-message">
                    Loading data...
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <div className="table-message">
                    No records found.
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const id = getRowId(row);

                return (
                  <tr
                    key={id}
                    className={
                      selectedIds.has(id)
                        ? 'selected-row'
                        : ''
                    }
                  >
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select row ${id}`}
                        checked={selectedIds.has(id)}
                        onChange={() =>
                          toggleRowSelection(id)
                        }
                      />
                    </td>

                    {columns.map((column) => (
                      <td key={String(column.key)}>
                        {column.cell
                          ? column.cell(row)
                          : String(row[column.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="data-table-footer">
        <span>
          Showing {startItem}–{endItem} of {totalItems}
        </span>

        <div className="pagination">
          <button
            type="button"
            disabled={currentPage <= 1 || loading}
            onClick={() => updatePage(currentPage - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            type="button"
            disabled={
              currentPage >= totalPages || loading
            }
            onClick={() => updatePage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}