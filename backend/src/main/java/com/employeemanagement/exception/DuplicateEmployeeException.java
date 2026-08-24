package com.employeemanagement.exception;

/** Thrown when creating/updating an employee would violate a unique
 *  constraint (duplicate employee_code or duplicate email). */
public class DuplicateEmployeeException extends RuntimeException {
    public DuplicateEmployeeException(String message) {
        super(message);
    }
}
