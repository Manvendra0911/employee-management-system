package com.employeemanagement.exception;

/** Thrown when a department lookup by id finds no match. */
public class DepartmentNotFoundException extends RuntimeException {
    public DepartmentNotFoundException(String message) {
        super(message);
    }
}
