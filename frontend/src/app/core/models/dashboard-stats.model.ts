import { Employee } from './employee.model';

// Mirrors com.employeemanagement.dto.DashboardStatsResponse
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  totalRoles: number;
  averageSalary: number;
  recentEmployees: Employee[];
  employeesByDepartment: Record<string, number>;
}
