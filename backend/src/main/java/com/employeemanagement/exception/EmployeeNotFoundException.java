package com.employeemanagement.exception;

/** Thrown when an employee lookup by id (or code) finds no match. */
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(String message) {
        super(message);
    }
}
