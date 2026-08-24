package com.employeemanagement.dao.impl;

import com.employeemanagement.dao.DepartmentDao;
import com.employeemanagement.exception.DatabaseException;
import com.employeemanagement.model.Department;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Pure JDBC implementation of DepartmentDao.
 * Every method: obtain a Connection from the pooled DataSource,
 * build a PreparedStatement (never string-concatenated SQL), execute,
 * map the ResultSet to domain objects, and always close resources
 * (handled automatically here via try-with-resources).
 */
@Repository
public class DepartmentDaoImpl implements DepartmentDao {

    private final DataSource dataSource;

    public DepartmentDaoImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Department create(Department department) {
        String sql = "INSERT INTO departments (department_name, description) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, department.getDepartmentName());
            ps.setString(2, department.getDescription());
            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    department.setDepartmentId(keys.getInt(1));
                }
            }
            return department;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to create department", e);
        }
    }

    @Override
    public List<Department> findAll() {
        String sql = "SELECT department_id, department_name, description FROM departments ORDER BY department_name";
        List<Department> departments = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                departments.add(mapRow(rs));
            }
            return departments;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to fetch departments", e);
        }
    }

    @Override
    public Optional<Department> findById(int departmentId) {
        String sql = "SELECT department_id, department_name, description FROM departments WHERE department_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, departmentId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to fetch department by id", e);
        }
    }

    @Override
    public boolean existsByName(String departmentName) {
        String sql = "SELECT 1 FROM departments WHERE LOWER(department_name) = LOWER(?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, departmentName);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to check department name", e);
        }
    }

    @Override
    public boolean existsByNameExcludingId(String departmentName, int departmentId) {
        String sql = "SELECT 1 FROM departments WHERE LOWER(department_name) = LOWER(?) AND department_id <> ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, departmentName);
            ps.setInt(2, departmentId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to check department name", e);
        }
    }

    @Override
    public Department update(Department department) {
        String sql = "UPDATE departments SET department_name = ?, description = ? WHERE department_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, department.getDepartmentName());
            ps.setString(2, department.getDescription());
            ps.setInt(3, department.getDepartmentId());
            ps.executeUpdate();
            return department;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to update department", e);
        }
    }

    @Override
    public boolean existsById(int departmentId) {
        String sql = "SELECT 1 FROM departments WHERE department_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, departmentId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to check department existence", e);
        }
    }

    private Department mapRow(ResultSet rs) throws SQLException {
        Department department = new Department();
        department.setDepartmentId(rs.getInt("department_id"));
        department.setDepartmentName(rs.getString("department_name"));
        department.setDescription(rs.getString("description"));
        return department;
    }
}
