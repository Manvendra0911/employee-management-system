package com.employeemanagement.dao;

import com.employeemanagement.model.Department;

import java.util.List;
import java.util.Optional;

/**
 * Data access contract for Department.
 * Using an interface here demonstrates abstraction: the service layer
 * depends only on this contract, not on the JDBC implementation detail.
 */
public interface DepartmentDao {

    Department create(Department department);

    List<Department> findAll();

    Optional<Department> findById(int departmentId);

    boolean existsByName(String departmentName);

    boolean existsByNameExcludingId(String departmentName, int departmentId);

    Department update(Department department);

    boolean existsById(int departmentId);
}
