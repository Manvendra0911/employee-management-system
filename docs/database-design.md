# Database Design

Database name: **`employee_management`** (MySQL, InnoDB engine, utf8mb4)

## Entity-relationship overview

```
departments (1) ────< (many) employees (many) >──── (1) roles
```

- A department can have many employees; an employee belongs to exactly one
  department.
- A role can be held by many employees; an employee has exactly one role.
- `employees.department_id` and `employees.role_id` are foreign keys, and
  deletion is restricted (`ON DELETE RESTRICT`) so a department/role cannot
  be removed while employees still reference it — this keeps referential
  integrity explicit rather than silently cascading deletes.

## Tables

### `departments`

| Column           | Type          | Constraints                          |
|------------------|---------------|---------------------------------------|
| department_id    | INT           | PK, AUTO_INCREMENT                    |
| department_name  | VARCHAR(100)  | NOT NULL, UNIQUE                      |
| description      | VARCHAR(255)  | nullable                              |

### `roles`

| Column       | Type          | Constraints                |
|--------------|---------------|-----------------------------|
| role_id      | INT           | PK, AUTO_INCREMENT          |
| role_name    | VARCHAR(100)  | NOT NULL, UNIQUE            |
| description  | VARCHAR(255)  | nullable                    |

### `employees`

| Column          | Type                          | Constraints                                             |
|-----------------|-------------------------------|-----------------------------------------------------------|
| employee_id     | INT                           | PK, AUTO_INCREMENT                                        |
| employee_code   | VARCHAR(20)                   | NOT NULL, UNIQUE                                           |
| first_name      | VARCHAR(50)                   | NOT NULL                                                   |
| last_name       | VARCHAR(50)                   | NOT NULL                                                   |
| email           | VARCHAR(100)                  | NOT NULL, UNIQUE                                           |
| phone           | VARCHAR(15)                   | NOT NULL                                                   |
| salary          | DECIMAL(12,2)                 | NOT NULL                                                   |
| joining_date    | DATE                          | NOT NULL                                                   |
| department_id   | INT                           | NOT NULL, FK -> departments(department_id), ON DELETE RESTRICT |
| role_id         | INT                           | NOT NULL, FK -> roles(role_id), ON DELETE RESTRICT         |
| status          | ENUM('ACTIVE','INACTIVE')     | NOT NULL, DEFAULT 'ACTIVE'                                  |
| created_at      | TIMESTAMP                     | NOT NULL, DEFAULT CURRENT_TIMESTAMP                         |
| updated_at      | TIMESTAMP                     | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

## Indexes

The `UNIQUE` constraints on `department_name`, `role_name`, `employee_code`
and `email` automatically create indexes on those columns. In addition:

```sql
CREATE INDEX idx_employee_department ON employees(department_id);
CREATE INDEX idx_employee_role       ON employees(role_id);
CREATE INDEX idx_employee_status     ON employees(status);
CREATE INDEX idx_employee_name       ON employees(first_name, last_name);
```

These support the most common query patterns: filtering by department,
filtering by role, filtering by status, and name-based search/sort — all of
which are used by `GET /api/employees` and `GET /api/employees/search`.

## Why JDBC needs a JOIN, not lazy loading

Because there is no ORM, `EmployeeDaoImpl` always fetches an employee's
department name and role name via an explicit SQL `JOIN` in the same query
that fetches the employee row:

```sql
SELECT e.*, d.department_name, r.role_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN roles r ON e.role_id = r.role_id
WHERE ...
```

This avoids the classic JDBC "N+1 query" mistake (fetching employees, then
looping to fetch each one's department separately) while still keeping the
code fully explicit and interview-explainable — there is no lazy-loading
proxy or hidden query happening behind the scenes.

## Setup

Run the two scripts in order against a local MySQL instance:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/data.sql
```

`schema.sql` creates the database, tables, constraints and indexes.
`data.sql` inserts 5 departments, 5 roles and 15 fictional sample employees.
