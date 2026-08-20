# Architecture

## Overview

The Employee Management System follows a classic layered architecture. There is
no framework magic hiding the data flow — every request travels through the
same explicit sequence of layers, which is what makes the project easy to
explain in an interview.

```
React (UI)
   |  user clicks / types
   v
Axios (HTTP client)
   |  JSON over HTTP
   v
Spring Boot REST Controller   (@RestController)
   |  delegates, no business logic here
   v
Service Layer                 (@Service)
   |  validation, business rules, orchestration
   v
DAO Layer                     (@Repository)
   |  Connection -> PreparedStatement -> ResultSet
   v
MySQL Database
```

## Layer responsibilities

### 1. React Frontend (`frontend/`)
- Renders pages (Dashboard, Employees, Departments, Roles) and forms.
- Calls the backend exclusively through the `services/` layer
  (`employeeService.js`, `departmentService.js`, `roleService.js`), which
  wrap a single shared Axios instance (`services/api.js`).
- Owns UI state only: loading/error/empty states, form validation feedback,
  toasts, confirm dialogs. It never talks to MySQL directly and never
  hardcodes data — every list, count and statistic comes from an API call.

### 2. Controller Layer (`controller/`)
- One controller per resource: `EmployeeController`, `DepartmentController`,
  `RoleController`, `DashboardController`.
- Responsible only for: mapping HTTP verbs/paths to Java methods, binding
  `@RequestBody`/`@RequestParam`/`@PathVariable`, triggering `@Valid`
  validation, and choosing the HTTP status code for the response
  (`ResponseEntity`).
- Contains **no SQL and no business rules**. If a controller method has an
  `if` statement that isn't about picking a status code, that logic belongs
  in the service layer instead.

### 3. Service Layer (`service/`, `service/impl/`)
- Interfaces (`EmployeeService`, `DepartmentService`, `RoleService`,
  `DashboardService`) define the contract; `impl` classes implement it. This
  is the project's use of **abstraction** — controllers depend on the
  interface, not the concrete class.
- Holds business rules that need database context: duplicate employee code /
  email checks, verifying a department or role id actually exists before an
  employee references it, translating request DTOs into domain models.
- Uses the **Stream API** for in-memory aggregation, e.g.
  `DashboardServiceImpl` groups employees by department with
  `Collectors.groupingBy` and computes average salary with `reduce`.
- Throws domain-specific exceptions (`EmployeeNotFoundException`,
  `DuplicateEmployeeException`, `InvalidEmployeeException`) instead of
  returning null or generic errors.

### 4. DAO Layer (`dao/`, `dao/impl/`)
- Interfaces define the persistence contract; `impl` classes contain **raw
  JDBC** — `Connection`, `PreparedStatement`, `ResultSet` — with no
  Hibernate/JPA in between.
- Every SQL statement uses a `PreparedStatement` with `?` placeholders;
  values are always bound via `ps.setX(...)`, never concatenated into the
  SQL string. This is true even for the dynamic search query in
  `EmployeeDaoImpl.search()`, where the *shape* of the WHERE clause changes
  based on which filters are present, but every *value* is still bound
  through a placeholder, and the sortable column name is checked against a
  whitelist before being appended (column names can't be parameterised in
  JDBC).
- Uses try-with-resources so connections/statements/result sets are always
  closed, and wraps `SQLException` into the unchecked `DatabaseException` so
  callers above the DAO never need to import `java.sql`.

### 5. MySQL Database (`database/`)
- Three tables: `departments`, `roles`, `employees`, connected by foreign
  keys. See `docs/database-design.md` for full details.

## Request walkthroughs

### Creating an employee
```
EmployeeForm.jsx (submit)
  -> employeeService.create(payload)
  -> POST /api/employees
  -> EmployeeController.createEmployee(@Valid EmployeeRequest)
  -> EmployeeServiceImpl.createEmployee()
       - validates department/role exist
       - checks employee code / email uniqueness
  -> EmployeeDaoImpl.create()
       - INSERT via PreparedStatement
       - reads back generated key
       - re-selects the row (with JOINs) via findById()
  -> Employee (domain model) returned up the stack
  -> EmployeeResponse.fromEntity() maps it to the API response DTO
  -> 201 Created with the new employee JSON
  -> React updates the list / navigates to the employee list
```

### Reading the dashboard
```
Dashboard.jsx (on mount)
  -> GET /api/dashboard/stats
  -> DashboardController.getStats()
  -> DashboardServiceImpl.getStats()
       - one EmployeeDao.search() call for the full, JOIN-enriched list
       - Stream API: sum/average salary, group by department, sort+limit
         recent employees
  -> DashboardStatsResponse
  -> React renders stat cards, the department bar chart and recent list
```

## Why no Spring Security / JPA / microservices

This project is intentionally scoped to the developer's current, verifiable
skill set (Java, JDBC, Spring Boot REST, React) so that every layer can be
explained line-by-line in a technical interview, rather than depending on
frameworks (Spring Data JPA, Spring Security, JWT) that weren't part of the
brief. These are called out explicitly as **future enhancements** rather than
silently included.
