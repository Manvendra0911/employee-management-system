package com.employeemanagement.dao.impl;

import com.employeemanagement.dao.EmployeeDao;
import com.employeemanagement.exception.DatabaseException;
import com.employeemanagement.model.Employee;
import com.employeemanagement.model.EmployeeStatus;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Pure JDBC implementation of EmployeeDao.
 *
 * The search() method is the most important one in the whole project:
 * it builds ONE dynamic, parameterised SQL query that backs listing,
 * searching, filtering AND sorting from a single DAO method, instead
 * of having a separate method (and a separate round trip) for each.
 * Every value from the caller is bound through a PreparedStatement
 * placeholder - never concatenated into the SQL string - so this is
 * safe from SQL injection even though the WHERE clause is built
 * dynamically.
 */
@Repository
public class EmployeeDaoImpl implements EmployeeDao {

    private final DataSource dataSource;

    // Whitelist of columns that are allowed to be used for sorting.
    // Never interpolate a raw, user-supplied column name into SQL.
    private static final Set<String> ALLOWED_SORT_COLUMNS = Set.of(
            "employee_id", "employee_code", "first_name", "last_name",
            "email", "salary", "joining_date", "status", "created_at"
    );

    private static final String BASE_SELECT =
            "SELECT e.employee_id, e.employee_code, e.first_name, e.last_name, e.email, " +
            "e.phone, e.salary, e.joining_date, e.department_id, e.role_id, e.status, " +
            "e.created_at, e.updated_at, d.department_name, r.role_name " +
            "FROM employees e " +
            "JOIN departments d ON e.department_id = d.department_id " +
            "JOIN roles r ON e.role_id = r.role_id ";

    public EmployeeDaoImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Employee create(Employee employee) {
        String sql = "INSERT INTO employees " +
                "(employee_code, first_name, last_name, email, phone, salary, joining_date, department_id, role_id, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, employee.getEmployeeCode());
            ps.setString(2, employee.getFirstName());
            ps.setString(3, employee.getLastName());
            ps.setString(4, employee.getEmail());
            ps.setString(5, employee.getPhone());
            ps.setBigDecimal(6, employee.getSalary());
            ps.setDate(7, Date.valueOf(employee.getJoiningDate()));
            ps.setInt(8, employee.getDepartmentId());
            ps.setInt(9, employee.getRoleId());
            ps.setString(10, employee.getStatus().name());
            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    employee.setEmployeeId(keys.getInt(1));
                }
            }
            return findById(employee.getEmployeeId())
                    .orElseThrow(() -> new DatabaseException("Employee was created but could not be reloaded", null));
        } catch (SQLException e) {
            throw new DatabaseException("Failed to create employee", e);
        }
    }

    @Override
    public Optional<Employee> findById(int employeeId) {
        String sql = BASE_SELECT + "WHERE e.employee_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, employeeId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to fetch employee by id", e);
        }
    }

    @Override
    public Optional<Employee> findByEmployeeCode(String employeeCode) {
        String sql = BASE_SELECT + "WHERE e.employee_code = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, employeeCode);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to fetch employee by code", e);
        }
    }

    @Override
    public Optional<Employee> findByEmail(String email) {
        String sql = BASE_SELECT + "WHERE e.email = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to fetch employee by email", e);
        }
    }

    @Override
    public List<Employee> search(String keyword, Integer departmentId, Integer roleId,
                                  String status, String sortBy, String sortDirection) {

        StringBuilder sql = new StringBuilder(BASE_SELECT).append("WHERE 1 = 1 ");
        List<Object> params = new ArrayList<>();

        if (keyword != null && !keyword.isBlank()) {
            sql.append("AND (e.first_name LIKE ? OR e.last_name LIKE ? OR e.employee_code LIKE ? OR e.email LIKE ?) ");
            String like = "%" + keyword.trim() + "%";
            params.add(like);
            params.add(like);
            params.add(like);
            params.add(like);
        }

        if (departmentId != null) {
            sql.append("AND e.department_id = ? ");
            params.add(departmentId);
        }

        if (roleId != null) {
            sql.append("AND e.role_id = ? ");
            params.add(roleId);
        }

        if (status != null && !status.isBlank()) {
            sql.append("AND e.status = ? ");
            params.add(status);
        }

        // Sorting: validate against a whitelist before appending to SQL,
        // because column names cannot be bound as PreparedStatement params.
        String column = ALLOWED_SORT_COLUMNS.contains(sortBy) ? sortBy : "employee_id";
        String direction = "desc".equalsIgnoreCase(sortDirection) ? "DESC" : "ASC";
        sql.append("ORDER BY e.").append(column).append(" ").append(direction);

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }

            List<Employee> employees = new ArrayList<>();
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    employees.add(mapRow(rs));
                }
            }
            return employees;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to search employees", e);
        }
    }

    @Override
    public Employee update(Employee employee) {
        String sql = "UPDATE employees SET employee_code = ?, first_name = ?, last_name = ?, email = ?, " +
                "phone = ?, salary = ?, joining_date = ?, department_id = ?, role_id = ?, status = ? " +
                "WHERE employee_id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, employee.getEmployeeCode());
            ps.setString(2, employee.getFirstName());
            ps.setString(3, employee.getLastName());
            ps.setString(4, employee.getEmail());
            ps.setString(5, employee.getPhone());
            ps.setBigDecimal(6, employee.getSalary());
            ps.setDate(7, Date.valueOf(employee.getJoiningDate()));
            ps.setInt(8, employee.getDepartmentId());
            ps.setInt(9, employee.getRoleId());
            ps.setString(10, employee.getStatus().name());
            ps.setInt(11, employee.getEmployeeId());
            ps.executeUpdate();

            return findById(employee.getEmployeeId())
                    .orElseThrow(() -> new DatabaseException("Employee was updated but could not be reloaded", null));
        } catch (SQLException e) {
            throw new DatabaseException("Failed to update employee", e);
        }
    }

    @Override
    public boolean deleteById(int employeeId) {
        String sql = "DELETE FROM employees WHERE employee_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, employeeId);
            int rows = ps.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to delete employee", e);
        }
    }

    @Override
    public boolean existsByEmployeeCodeExcludingId(String employeeCode, int employeeId) {
        String sql = "SELECT 1 FROM employees WHERE employee_code = ? AND employee_id <> ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, employeeCode);
            ps.setInt(2, employeeId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to check employee code uniqueness", e);
        }
    }

    @Override
    public boolean existsByEmailExcludingId(String email, int employeeId) {
        String sql = "SELECT 1 FROM employees WHERE email = ? AND employee_id <> ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            ps.setInt(2, employeeId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to check email uniqueness", e);
        }
    }

    @Override
    public long countAll() {
        String sql = "SELECT COUNT(*) FROM employees";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            rs.next();
            return rs.getLong(1);
        } catch (SQLException e) {
            throw new DatabaseException("Failed to count employees", e);
        }
    }

    @Override
    public long countByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM employees WHERE status = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to count employees by status", e);
        }
    }

    @Override
    public long countByDepartment(int departmentId) {
        String sql = "SELECT COUNT(*) FROM employees WHERE department_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, departmentId);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to count employees by department", e);
        }
    }

    private Employee mapRow(ResultSet rs) throws SQLException {
        Employee employee = new Employee();
        employee.setEmployeeId(rs.getInt("employee_id"));
        employee.setEmployeeCode(rs.getString("employee_code"));
        employee.setFirstName(rs.getString("first_name"));
        employee.setLastName(rs.getString("last_name"));
        employee.setEmail(rs.getString("email"));
        employee.setPhone(rs.getString("phone"));
        employee.setSalary(rs.getBigDecimal("salary"));
        employee.setJoiningDate(rs.getDate("joining_date").toLocalDate());
        employee.setDepartmentId(rs.getInt("department_id"));
        employee.setRoleId(rs.getInt("role_id"));
        employee.setStatus(EmployeeStatus.valueOf(rs.getString("status")));
        Timestamp createdAt = rs.getTimestamp("created_at");
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (createdAt != null) employee.setCreatedAt(createdAt.toLocalDateTime());
        if (updatedAt != null) employee.setUpdatedAt(updatedAt.toLocalDateTime());
        employee.setDepartmentName(rs.getString("department_name"));
        employee.setRoleName(rs.getString("role_name"));
        return employee;
    }
}
