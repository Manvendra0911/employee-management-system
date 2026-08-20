package com.employeemanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the Employee Management System backend.
 *
 * Architecture (top to bottom):
 *   React (Axios) -> REST Controller -> Service -> DAO -> JDBC -> MySQL
 *
 * This application intentionally avoids Spring Data JPA / Hibernate.
 * Every database operation is implemented with plain JDBC
 * (Connection, PreparedStatement, ResultSet) inside the dao package,
 * so that every layer of the stack is explainable line by line.
 */
@SpringBootApplication
public class EmployeeManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeManagementApplication.class, args);
    }
}
