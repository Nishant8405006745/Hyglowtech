export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type EmployeeRow = {
  id: number;
  name: string;
  manager_id: number | null;
};

export type RoleRow = {
  id: number;
  role_name: string;
};
