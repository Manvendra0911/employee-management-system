package com.employeemanagement.dao;

import com.employeemanagement.model.Role;

import java.util.List;
import java.util.Optional;

public interface RoleDao {

    Role create(Role role);

    List<Role> findAll();

    Optional<Role> findById(int roleId);

    boolean existsByName(String roleName);

    boolean existsByNameExcludingId(String roleName, int roleId);

    Role update(Role role);

    boolean existsById(int roleId);
}
