package com.employeemanagement.dto;

import com.employeemanagement.model.Employee;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Outgoing payload representing an Employee, including denormalised
 * department/role names so the frontend doesn't need extra lookups
 * to render a table row or details page.
 */
public class EmployeeResponse {

    private Integer employeeId;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private BigDecimal salary;
    private LocalDate joiningDate;
    private Integer departmentId;
    private String departmentName;
    private Integer roleId;
    private String roleName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static EmployeeResponse fromEntity(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.employeeId = employee.getEmployeeId();
        response.employeeCode = employee.getEmployeeCode();
        response.firstName = employee.getFirstName();
        response.lastName = employee.getLastName();
        response.fullName = employee.getFirstName() + " " + employee.getLastName();
        response.email = employee.getEmail();
        response.phone = employee.getPhone();
        response.salary = employee.getSalary();
        response.joiningDate = employee.getJoiningDate();
        response.departmentId = employee.getDepartmentId();
        response.departmentName = employee.getDepartmentName();
        response.roleId = employee.getRoleId();
        response.roleName = employee.getRoleName();
        response.status = employee.getStatus() != null ? employee.getStatus().name() : null;
        response.createdAt = employee.getCreatedAt();
        response.updatedAt = employee.getUpdatedAt();
        return response;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
