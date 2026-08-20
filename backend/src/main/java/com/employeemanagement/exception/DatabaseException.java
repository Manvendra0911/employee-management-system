package com.employeemanagement.exception;

/** Wraps low-level SQLExceptions coming out of the DAO layer so that
 *  the service/controller layers never need to know about java.sql
 *  types. Keeps a reference to the original cause for logging. */
public class DatabaseException extends RuntimeException {
    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
