-- ============================================================
-- Employee Management System - Database Schema
-- Database: employee_management
-- ============================================================

CREATE DATABASE IF NOT EXISTS employee_management
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE employee_management;

-- ------------------------------------------------------------
-- Table: departments
-- ------------------------------------------------------------
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    department_id   INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    description      VARCHAR(255),
    CONSTRAINT uq_department_name UNIQUE (department_name)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: roles
-- ------------------------------------------------------------
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
    role_id     INT AUTO_INCREMENT PRIMARY KEY,
    role_name   VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    CONSTRAINT uq_role_name UNIQUE (role_name)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: employees
-- ------------------------------------------------------------
CREATE TABLE employees (
    employee_id    INT AUTO_INCREMENT PRIMARY KEY,
    employee_code  VARCHAR(20)  NOT NULL,
    first_name     VARCHAR(50)  NOT NULL,
    last_name      VARCHAR(50)  NOT NULL,
    email          VARCHAR(100) NOT NULL,
    phone          VARCHAR(15)  NOT NULL,
    salary         DECIMAL(12,2) NOT NULL,
    joining_date   DATE NOT NULL,
    department_id  INT NOT NULL,
    role_id        INT NOT NULL,
    status         ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_employee_code UNIQUE (employee_code),
    CONSTRAINT uq_employee_email UNIQUE (email),

    CONSTRAINT fk_employee_department FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_employee_role FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Indexes (in addition to the UNIQUE constraints above, which
-- already create indexes on employee_code and email)
-- ------------------------------------------------------------
CREATE INDEX idx_employee_department ON employees(department_id);
CREATE INDEX idx_employee_role       ON employees(role_id);
CREATE INDEX idx_employee_status     ON employees(status);
CREATE INDEX idx_employee_name       ON employees(first_name, last_name);
