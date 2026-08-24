// Mirrors com.employeemanagement.model.Department
export interface Department {
  departmentId: number;
  departmentName: string;
  description: string | null;
}

// Mirrors com.employeemanagement.dto.DepartmentRequest
export interface DepartmentRequest {
  departmentName: string;
  description?: string;
}
