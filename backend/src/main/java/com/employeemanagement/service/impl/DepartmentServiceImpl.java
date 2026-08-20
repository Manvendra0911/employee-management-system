package com.employeemanagement.service.impl;

import com.employeemanagement.dao.DepartmentDao;
import com.employeemanagement.dto.DepartmentRequest;
import com.employeemanagement.exception.DepartmentNotFoundException;
import com.employeemanagement.exception.InvalidEmployeeException;
import com.employeemanagement.model.Department;
import com.employeemanagement.service.DepartmentService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Business logic for departments. Constructor injection (no field
 * injection) keeps dependencies explicit and testable.
 */
@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentDao departmentDao;

    public DepartmentServiceImpl(DepartmentDao departmentDao) {
        this.departmentDao = departmentDao;
    }

    @Override
    public Department createDepartment(DepartmentRequest request) {
        if (departmentDao.existsByName(request.getDepartmentName())) {
            throw new InvalidEmployeeException(
                    "A department named '" + request.getDepartmentName() + "' already exists");
        }
        Department department = new Department();
        department.setDepartmentName(request.getDepartmentName().trim());
        department.setDescription(request.getDescription());
        return departmentDao.create(department);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentDao.findAll();
    }

    @Override
    public Department getDepartmentById(int departmentId) {
        return departmentDao.findById(departmentId)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + departmentId));
    }

    @Override
    public Department updateDepartment(int departmentId, DepartmentRequest request) {
        Department existing = getDepartmentById(departmentId);

        if (departmentDao.existsByNameExcludingId(request.getDepartmentName(), departmentId)) {
            throw new InvalidEmployeeException(
                    "A department named '" + request.getDepartmentName() + "' already exists");
        }

        existing.setDepartmentName(request.getDepartmentName().trim());
        existing.setDescription(request.getDescription());
        return departmentDao.update(existing);
    }
}
