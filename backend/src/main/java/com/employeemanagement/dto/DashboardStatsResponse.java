package com.employeemanagement.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Aggregated dashboard statistics. Every value here is computed from
 * live database queries / in-memory stream operations over data that
 * came from the database - none of it is hardcoded.
 */
public class DashboardStatsResponse {

    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;
    private long totalDepartments;
    private long totalRoles;
    private BigDecimal averageSalary;
    private List<EmployeeResponse> recentEmployees;
    private Map<String, Long> employeesByDepartment;

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getActiveEmployees() {
        return activeEmployees;
    }

    public void setActiveEmployees(long activeEmployees) {
        this.activeEmployees = activeEmployees;
    }

    public long getInactiveEmployees() {
        return inactiveEmployees;
    }

    public void setInactiveEmployees(long inactiveEmployees) {
        this.inactiveEmployees = inactiveEmployees;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public long getTotalRoles() {
        return totalRoles;
    }

    public void setTotalRoles(long totalRoles) {
        this.totalRoles = totalRoles;
    }

    public BigDecimal getAverageSalary() {
        return averageSalary;
    }

    public void setAverageSalary(BigDecimal averageSalary) {
        this.averageSalary = averageSalary;
    }

    public List<EmployeeResponse> getRecentEmployees() {
        return recentEmployees;
    }

    public void setRecentEmployees(List<EmployeeResponse> recentEmployees) {
        this.recentEmployees = recentEmployees;
    }

    public Map<String, Long> getEmployeesByDepartment() {
        return employeesByDepartment;
    }

    public void setEmployeesByDepartment(Map<String, Long> employeesByDepartment) {
        this.employeesByDepartment = employeesByDepartment;
    }
}
