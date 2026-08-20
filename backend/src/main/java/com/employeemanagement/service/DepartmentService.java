package com.employeemanagement.service;

import com.employeemanagement.dto.DepartmentRequest;
import com.employeemanagement.model.Department;

import java.util.List;

public interface DepartmentService {
    Department createDepartment(DepartmentRequest request);
    List<Department> getAllDepartments();
    Department getDepartmentById(int departmentId);
    Department updateDepartment(int departmentId, DepartmentRequest request);
}
