package com.employeemanagement.exception;

/** Thrown when a role lookup by id finds no match. */
public class RoleNotFoundException extends RuntimeException {
    public RoleNotFoundException(String message) {
        super(message);
    }
}
