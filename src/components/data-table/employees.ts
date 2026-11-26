export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  status: 'Active' | 'Inactive';
}

export const employees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    department: 'Engineering',
    salary: 95000,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    department: 'Design',
    salary: 85000,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    department: 'Engineering',
    salary: 105000,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    department: 'Marketing',
    salary: 75000,
    status: 'Inactive',
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david@example.com',
    department: 'Engineering',
    salary: 90000,
    status: 'Active',
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily@example.com',
    department: 'HR',
    salary: 70000,
    status: 'Active',
  },
  {
    id: '7',
    name: 'Robert Taylor',
    email: 'robert@example.com',
    department: 'Finance',
    salary: 88000,
    status: 'Inactive',
  },
  {
    id: '8',
    name: 'Olivia Martin',
    email: 'olivia@example.com',
    department: 'Design',
    salary: 92000,
    status: 'Active',
  },
  {
    id: '9',
    name: 'James Anderson',
    email: 'james@example.com',
    department: 'Engineering',
    salary: 110000,
    status: 'Active',
  },
  {
    id: '10',
    name: 'Sophia Thomas',
    email: 'sophia@example.com',
    department: 'Marketing',
    salary: 78000,
    status: 'Inactive',
  },
  {
    id: '11',
    name: 'William Garcia',
    email: 'william@example.com',
    department: 'Finance',
    salary: 98000,
    status: 'Active',
  },
  {
    id: '12',
    name: 'Isabella Clark',
    email: 'isabella@example.com',
    department: 'HR',
    salary: 72000,
    status: 'Active',
  },
];