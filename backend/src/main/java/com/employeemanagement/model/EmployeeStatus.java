package com.employeemanagement.model;

/**
 * Represents the employment status of an Employee.
 * Kept as a simple enum (rather than a free-text column) so that the
 * database enforces a fixed, valid set of values and the DAO layer can
 * demonstrate Enum <-> String mapping when reading/writing JDBC ResultSets.
 */
public enum EmployeeStatus {
    ACTIVE,
    INACTIVE
}
