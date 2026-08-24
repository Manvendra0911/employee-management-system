package com.employeemanagement.controller;

import com.employeemanagement.dto.RoleRequest;
import com.employeemanagement.model.Role;
import com.employeemanagement.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable("id") int id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @PostMapping
    public ResponseEntity<Role> createRole(@Valid @RequestBody RoleRequest request) {
        Role created = roleService.createRole(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable("id") int id, @Valid @RequestBody RoleRequest request) {
        return ResponseEntity.ok(roleService.updateRole(id, request));
    }
}
