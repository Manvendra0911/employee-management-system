package com.employeemanagement.dao.impl;

import com.employeemanagement.dao.RoleDao;
import com.employeemanagement.exception.DatabaseException;
import com.employeemanagement.model.Role;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class RoleDaoImpl implements RoleDao {

    private final DataSource dataSource;

    public RoleDaoImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Role create(Role role) {
        String sql = "INSERT INTO roles (role_name, description) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, role.getRoleName());
            ps.setString(2, role.getDescription());
            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    role.setRoleId(keys.getInt(1));
                }
            }
            return role;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to create role", e);
        }
    }

    @Override
    public List<Role> findAll() {
        String sql = "SELECT role_id, role_name, description FROM roles ORDER BY role_name";
        List<Role> roles = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                roles.add(mapRow(rs));
            }
            return roles;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to fetch roles", e);
        }
    }

    @Override
    public Optional<Role> findById(int roleId) {
        String sql = "SELECT role_id, role_name, description FROM roles WHERE role_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, roleId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to fetch role by id", e);
        }
    }

    @Override
    public boolean existsByName(String roleName) {
        String sql = "SELECT 1 FROM roles WHERE LOWER(role_name) = LOWER(?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, roleName);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to check role name", e);
        }
    }

    @Override
    public boolean existsByNameExcludingId(String roleName, int roleId) {
        String sql = "SELECT 1 FROM roles WHERE LOWER(role_name) = LOWER(?) AND role_id <> ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, roleName);
            ps.setInt(2, roleId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to check role name", e);
        }
    }

    @Override
    public Role update(Role role) {
        String sql = "UPDATE roles SET role_name = ?, description = ? WHERE role_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, role.getRoleName());
            ps.setString(2, role.getDescription());
            ps.setInt(3, role.getRoleId());
            ps.executeUpdate();
            return role;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to update role", e);
        }
    }

    @Override
    public boolean existsById(int roleId) {
        String sql = "SELECT 1 FROM roles WHERE role_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, roleId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new DatabaseException("Failed to check role existence", e);
        }
    }

    private Role mapRow(ResultSet rs) throws SQLException {
        Role role = new Role();
        role.setRoleId(rs.getInt("role_id"));
        role.setRoleName(rs.getString("role_name"));
        role.setDescription(rs.getString("description"));
        return role;
    }
}
