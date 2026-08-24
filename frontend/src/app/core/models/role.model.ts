// Mirrors com.employeemanagement.model.Role
export interface Role {
  roleId: number;
  roleName: string;
  description: string | null;
}

// Mirrors com.employeemanagement.dto.RoleRequest
export interface RoleRequest {
  roleName: string;
  description?: string;
}
