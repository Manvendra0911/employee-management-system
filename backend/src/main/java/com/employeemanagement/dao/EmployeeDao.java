package com.employeemanagement.dao;

import com.employeemanagement.model.Employee;

import java.util.List;
import java.util.Optional;

/**
 * Data access contract for Employee. All query methods return fully
 * populated Employee objects (including departmentName / roleName via
 * a JOIN) so the service layer never has to make follow-up queries.
 */
public interface EmployeeDao {

    Employee create(Employee employee);

    Optional<Employee> findById(int employeeId);

    Optional<Employee> findByEmployeeCode(String employeeCode);

    Optional<Employee> findByEmail(String email);

    /**
     * Single flexible query used for listing, searching, filtering and
     * sorting employees. All parameters are optional (nullable); a null
     * parameter simply omits that condition from the WHERE clause.
     */
    List<Employee> search(String keyword,
                           Integer departmentId,
                           Integer roleId,
                           String status,
                           String sortBy,
                           String sortDirection);

    Employee update(Employee employee);

    boolean deleteById(int employeeId);

    boolean existsByEmployeeCodeExcludingId(String employeeCode, int employeeId);

    boolean existsByEmailExcludingId(String email, int employeeId);

    long countAll();

    long countByStatus(String status);

    long countByDepartment(int departmentId);
}
