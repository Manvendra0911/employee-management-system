package com.employeemanagement.exception;

/** Thrown for semantic validation failures that are not simple field
 *  format errors, e.g. referencing a department/role id that doesn't
 *  exist, or an otherwise invalid business state. */
public class InvalidEmployeeException extends RuntimeException {
    public InvalidEmployeeException(String message) {
        super(message);
    }
}
