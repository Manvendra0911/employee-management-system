// Mirrors com.employeemanagement.dto.EmployeeResponse on the backend.
export interface Employee {
  employeeId: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  salary: number;
  joiningDate: string;
  departmentId: number;
  departmentName: string;
  roleId: number;
  roleName: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// Mirrors com.employeemanagement.dto.EmployeeRequest - the payload sent
// on create/update. Field names must match the backend exactly since the
// DAO/service layer is not being touched.
export interface EmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  salary: number;
  joiningDate: string;
  departmentId: number;
  roleId: number;
  status: 'ACTIVE' | 'INACTIVE';
}

// Query params accepted by GET /api/employees and /api/employees/search.
export interface EmployeeQueryParams {
  keyword?: string;
  departmentId?: number | string;
  roleId?: number | string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
