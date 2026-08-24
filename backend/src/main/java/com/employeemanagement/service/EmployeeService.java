package com.employeemanagement.service;

import com.employeemanagement.dto.EmployeeRequest;
import com.employeemanagement.dto.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    EmployeeResponse createEmployee(EmployeeRequest request);

    EmployeeResponse getEmployeeById(int employeeId);

    List<EmployeeResponse> getEmployees(String keyword, Integer departmentId, Integer roleId,
                                         String status, String sortBy, String sortDirection);

    EmployeeResponse updateEmployee(int employeeId, EmployeeRequest request);

    void deleteEmployee(int employeeId);
}
