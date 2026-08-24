package com.employeemanagement.service.impl;

import com.employeemanagement.dao.RoleDao;
import com.employeemanagement.dto.RoleRequest;
import com.employeemanagement.exception.InvalidEmployeeException;
import com.employeemanagement.exception.RoleNotFoundException;
import com.employeemanagement.model.Role;
import com.employeemanagement.service.RoleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleDao roleDao;

    public RoleServiceImpl(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @Override
    public Role createRole(RoleRequest request) {
        if (roleDao.existsByName(request.getRoleName())) {
            throw new InvalidEmployeeException("A role named '" + request.getRoleName() + "' already exists");
        }
        Role role = new Role();
        role.setRoleName(request.getRoleName().trim());
        role.setDescription(request.getDescription());
        return roleDao.create(role);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleDao.findAll();
    }

    @Override
    public Role getRoleById(int roleId) {
        return roleDao.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException("Role not found with id: " + roleId));
    }

    @Override
    public Role updateRole(int roleId, RoleRequest request) {
        Role existing = getRoleById(roleId);

        if (roleDao.existsByNameExcludingId(request.getRoleName(), roleId)) {
            throw new InvalidEmployeeException("A role named '" + request.getRoleName() + "' already exists");
        }

        existing.setRoleName(request.getRoleName().trim());
        existing.setDescription(request.getDescription());
        return roleDao.update(existing);
    }
}
