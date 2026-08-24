package com.employeemanagement.service.impl;

import com.employeemanagement.dao.DepartmentDao;
import com.employeemanagement.dao.EmployeeDao;
import com.employeemanagement.dao.RoleDao;
import com.employeemanagement.dto.DashboardStatsResponse;
import com.employeemanagement.dto.EmployeeResponse;
import com.employeemanagement.model.Department;
import com.employeemanagement.model.Employee;
import com.employeemanagement.service.DashboardService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Computes dashboard statistics. Every figure is derived from data
 * fetched from MySQL - nothing here is hardcoded. This class also
 * demonstrates practical use of the Stream API: grouping, sorting,
 * limiting and averaging over an in-memory List<Employee>.
 */
@Service
public class DashboardServiceImpl implements DashboardService {

    private static final int RECENT_EMPLOYEE_LIMIT = 5;

    private final EmployeeDao employeeDao;
    private final DepartmentDao departmentDao;
    private final RoleDao roleDao;

    public DashboardServiceImpl(EmployeeDao employeeDao, DepartmentDao departmentDao, RoleDao roleDao) {
        this.employeeDao = employeeDao;
        this.departmentDao = departmentDao;
        this.roleDao = roleDao;
    }

    @Override
    public DashboardStatsResponse getStats() {
        // Pull the full, JOIN-enriched employee list once and reuse it
        // in memory for every derived statistic below (avoids N extra
        // database round trips for what are ultimately in-memory
        // aggregations over a small dataset).
        List<Employee> allEmployees = employeeDao.search(null, null, null, null, "employee_id", "desc");
        List<Department> departments = departmentDao.findAll();

        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalEmployees(allEmployees.size());
        stats.setActiveEmployees(employeeDao.countByStatus("ACTIVE"));
        stats.setInactiveEmployees(employeeDao.countByStatus("INACTIVE"));
        stats.setTotalDepartments(departments.size());
        stats.setTotalRoles(roleDao.findAll().size());

        // Average salary via Stream API
        BigDecimal averageSalary = allEmployees.stream()
                .map(Employee::getSalary)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (!allEmployees.isEmpty()) {
            averageSalary = averageSalary.divide(
                    BigDecimal.valueOf(allEmployees.size()), 2, RoundingMode.HALF_UP);
        }
        stats.setAverageSalary(averageSalary);

        // Recent employees: sort by createdAt desc, take top N
        List<EmployeeResponse> recent = allEmployees.stream()
                .sorted(Comparator.comparing(Employee::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(RECENT_EMPLOYEE_LIMIT)
                .map(EmployeeResponse::fromEntity)
                .collect(Collectors.toList());
        stats.setRecentEmployees(recent);

        // Employees grouped by department name, using Collectors.groupingBy
        Map<String, Long> byDepartment = allEmployees.stream()
                .collect(Collectors.groupingBy(
                        Employee::getDepartmentName,
                        LinkedHashMap::new,
                        Collectors.counting()));
        stats.setEmployeesByDepartment(byDepartment);

        return stats;
    }
}
