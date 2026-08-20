package com.employeemanagement.controller;

import com.employeemanagement.dto.EmployeeRequest;
import com.employeemanagement.dto.EmployeeResponse;
import com.employeemanagement.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for Employee management.
 * Thin by design: parses input, delegates to the service layer, and
 * maps the result to the correct HTTP status code. No business logic
 * and no SQL lives here.
 */
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // GET /api/employees
    // GET /api/employees?departmentId=1
    // GET /api/employees?roleId=2
    // GET /api/employees?status=ACTIVE
    // GET /api/employees?sortBy=salary&sortDirection=desc
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getEmployees(
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer roleId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "employee_id") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDirection) {

        List<EmployeeResponse> employees = employeeService.getEmployees(
                null, departmentId, roleId, status, sortBy, sortDirection);
        return ResponseEntity.ok(employees);
    }

    // GET /api/employees/search?name=John
    @GetMapping("/search")
    public ResponseEntity<List<EmployeeResponse>> searchEmployees(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer roleId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "employee_id") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDirection) {

        List<EmployeeResponse> employees = employeeService.getEmployees(
                name, departmentId, roleId, status, sortBy, sortDirection);
        return ResponseEntity.ok(employees);
    }

    // GET /api/employees/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable("id") int id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    // POST /api/employees
    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse created = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/employees/{id}
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable("id") int id, @Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/employees/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable("id") int id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
