package com.employeemanagement.service.impl;

import com.employeemanagement.dao.DepartmentDao;
import com.employeemanagement.dao.EmployeeDao;
import com.employeemanagement.dao.RoleDao;
import com.employeemanagement.dto.EmployeeRequest;
import com.employeemanagement.dto.EmployeeResponse;
import com.employeemanagement.exception.*;
import com.employeemanagement.model.Employee;
import com.employeemanagement.model.EmployeeStatus;
import com.employeemanagement.service.EmployeeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Core business logic for Employee management.
 *
 * Validation strategy:
 *  - Field-level format validation (blank checks, email pattern, etc.)
 *    is handled declaratively by Bean Validation annotations on
 *    EmployeeRequest, enforced by @Valid in the controller.
 *  - Cross-cutting / referential business rules (does this department
 *    exist, is this email already taken by someone else, etc.) live
 *    here, because they require querying the database and cannot be
 *    expressed as a simple annotation.
 */
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeDao employeeDao;
    private final DepartmentDao departmentDao;
    private final RoleDao roleDao;

    public EmployeeServiceImpl(EmployeeDao employeeDao, DepartmentDao departmentDao, RoleDao roleDao) {
        this.employeeDao = employeeDao;
        this.departmentDao = departmentDao;
        this.roleDao = roleDao;
    }

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        validateReferences(request.getDepartmentId(), request.getRoleId());

        if (employeeDao.findByEmployeeCode(request.getEmployeeCode()).isPresent()) {
            throw new DuplicateEmployeeException(
                    "An employee with code '" + request.getEmployeeCode() + "' already exists");
        }
        if (employeeDao.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateEmployeeException(
                    "An employee with email '" + request.getEmail() + "' already exists");
        }

        Employee employee = toEntity(request, null);
        Employee saved = employeeDao.create(employee);
        return EmployeeResponse.fromEntity(saved);
    }

    @Override
    public EmployeeResponse getEmployeeById(int employeeId) {
        Employee employee = findOrThrow(employeeId);
        return EmployeeResponse.fromEntity(employee);
    }

    @Override
    public List<EmployeeResponse> getEmployees(String keyword, Integer departmentId, Integer roleId,
                                                String status, String sortBy, String sortDirection) {

        // Validate status early with a clear error instead of letting an
        // invalid value silently fall through to the SQL WHERE clause.
        if (status != null && !status.isBlank()) {
            try {
                EmployeeStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new InvalidEmployeeException("Invalid status filter: " + status);
            }
        }

        List<Employee> employees = employeeDao.search(
                keyword, departmentId, roleId,
                status != null ? status.toUpperCase() : null,
                sortBy, sortDirection);

        // Demonstrates Stream API: map DAO entities -> API response DTOs.
        return employees.stream()
                .map(EmployeeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeResponse updateEmployee(int employeeId, EmployeeRequest request) {
        Employee existing = findOrThrow(employeeId);
        validateReferences(request.getDepartmentId(), request.getRoleId());

        if (employeeDao.existsByEmployeeCodeExcludingId(request.getEmployeeCode(), employeeId)) {
            throw new DuplicateEmployeeException(
                    "An employee with code '" + request.getEmployeeCode() + "' already exists");
        }
        if (employeeDao.existsByEmailExcludingId(request.getEmail(), employeeId)) {
            throw new DuplicateEmployeeException(
                    "An employee with email '" + request.getEmail() + "' already exists");
        }

        Employee updated = toEntity(request, existing.getEmployeeId());
        Employee saved = employeeDao.update(updated);
        return EmployeeResponse.fromEntity(saved);
    }

    @Override
    public void deleteEmployee(int employeeId) {
        findOrThrow(employeeId);
        boolean deleted = employeeDao.deleteById(employeeId);
        if (!deleted) {
            throw new EmployeeNotFoundException("Employee not found with id: " + employeeId);
        }
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private Employee findOrThrow(int employeeId) {
        return employeeDao.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + employeeId));
    }

    private void validateReferences(Integer departmentId, Integer roleId) {
        if (!departmentDao.existsById(departmentId)) {
            throw new InvalidEmployeeException("Department not found with id: " + departmentId);
        }
        if (!roleDao.existsById(roleId)) {
            throw new InvalidEmployeeException("Role not found with id: " + roleId);
        }
    }

    private Employee toEntity(EmployeeRequest request, Integer existingId) {
        Employee employee = new Employee();
        employee.setEmployeeId(existingId);
        employee.setEmployeeCode(request.getEmployeeCode().trim());
        employee.setFirstName(request.getFirstName().trim());
        employee.setLastName(request.getLastName().trim());
        employee.setEmail(request.getEmail().trim().toLowerCase());
        employee.setPhone(request.getPhone().trim());
        employee.setSalary(request.getSalary());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setDepartmentId(request.getDepartmentId());
        employee.setRoleId(request.getRoleId());
        employee.setStatus(EmployeeStatus.valueOf(request.getStatus().toUpperCase()));
        return employee;
    }
}
