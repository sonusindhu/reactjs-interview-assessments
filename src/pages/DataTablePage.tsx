import { DataTable } from '../components/data-table';

import type { Column } from '../components/data-table';

import {
  employees,
  type Employee,
} from '../components/data-table/employees';

const columns: Column<Employee>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    filterable: true,
  },
  {
    key: 'email',
    header: 'Email',
    searchable: true,
    filterable: true,
  },
  {
    key: 'department',
    header: 'Department',
    filterable: true,
  },
  {
    key: 'salary',
    header: 'Salary',
    sortable: true,
    cell: (employee) =>
      `$${employee.salary.toLocaleString()}`,
  },
  {
    key: 'status',
    header: 'Status',
    filterable: true,
    cell: (employee) => (
      <span
        style={{
          color:
            employee.status === 'Active'
              ? 'green'
              : 'red',
          fontWeight: 600,
        }}
      >
        {employee.status}
      </span>
    ),
  },
];

function DataTablePage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1>Employee Management</h1>

      <DataTable<Employee>
        data={employees}
        columns={columns}
        getRowId={(employee) => employee.id}
        initialPageSize={5}
        pageSizeOptions={[5, 10, 20]}
      />
    </main>
  );
}

export default DataTablePage;