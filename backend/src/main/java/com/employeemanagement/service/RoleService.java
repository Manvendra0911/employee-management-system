package com.employeemanagement.service;

import com.employeemanagement.dto.RoleRequest;
import com.employeemanagement.model.Role;

import java.util.List;

public interface RoleService {
    Role createRole(RoleRequest request);
    List<Role> getAllRoles();
    Role getRoleById(int roleId);
    Role updateRole(int roleId, RoleRequest request);
}
