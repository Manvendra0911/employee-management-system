# PeopleDesk — Employee Management System

A clean, interview-defensible Java Full Stack Employee Management System,
built to demonstrate practical **Java + Spring Boot + JDBC + MySQL + React**
skills for a Java Full Stack / Systems Engineer role at Infosys.

> This is a real, running application — not a mockup. Every number on the
> dashboard, every row in the employee table, and every dropdown option comes
> from a live REST call to a Spring Boot backend backed by MySQL.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Folder Structure](#folder-structure)
6. [Database Design](#database-design)
7. [API Documentation](#api-documentation)
8. [Setup Instructions](#setup-instructions)
9. [Postman Testing](#postman-testing)
10. [Running Backend Tests](#running-backend-tests)
11. [Known Limitations](#known-limitations)
12. [Future Enhancements](#future-enhancements)
13. [Interview Questions From This Project](#interview-questions-from-this-project)
14. [Author](#author)

---

## Project Overview

PeopleDesk is an internal HR-style tool for managing employees, departments
and roles. It's deliberately scoped to a **realistic, explainable MVP**
rather than an over-engineered showcase: three related MySQL tables, a
layered Spring Boot backend built on **hand-written JDBC** (no
Hibernate/JPA), and a React frontend that talks to it entirely through REST.

The goal is a project you can open in an interview and explain, line by
line, from a button click in the browser all the way down to the SQL that
runs against MySQL.

## Features

- **Employee management**: create, view, update, delete, search, filter
  (by department / role / status) and sort employees.
- **Department management**: list, add, update departments; view employee
  count per department.
- **Role management**: list, add, update roles; view employee count per role.
- **Dashboard**: total/active/inactive employee counts, department and role
  counts, average salary, employees-by-department breakdown, and a recent
  employees feed — all computed live from the database.
- **Validation & error handling**: field-level validation (required fields,
  email/phone format, positive salary) plus business-rule validation
  (duplicate employee code/email, invalid department/role reference),
  surfaced as clear, user-friendly messages in the UI.
- **Responsive UI**: works across desktop, laptop, tablet and mobile, with a
  collapsible sidebar and mobile navigation.

## Technology Stack

**Backend:** Java 21 · Spring Boot 3 · Maven · JDBC (`Connection` /
`PreparedStatement` / `ResultSet`) · REST APIs · Bean Validation

**Database:** MySQL · SQL (DDL/DML, joins, indexes, constraints)

**Frontend:** React 18 · JavaScript (ES2021+) · HTML5 · CSS3 · React Router ·
Axios · Vite

**Tools:** IntelliJ IDEA Community Edition (backend) · VS Code (frontend) ·
MySQL Workbench · Postman · Git / GitHub

**Explicitly not used** (see [Known Limitations](#known-limitations)):
Spring Security, JWT, Spring Data JPA, Hibernate, microservices, Docker,
Kubernetes, Kafka, Redis, any cloud provider.

## Architecture

```
React (Axios) -> Spring Boot Controller -> Service -> DAO -> JDBC -> MySQL
```

Full explanation with request walkthroughs: [`docs/architecture.md`](docs/architecture.md)

## Folder Structure

```
employee-management-system/
├── backend/                     Spring Boot + JDBC REST API
│   ├── pom.xml
│   └── src/main/java/com/employeemanagement/
│       ├── EmployeeManagementApplication.java
│       ├── controller/          REST endpoints (thin, no business logic)
│       ├── service/ + impl/     Business rules, validation, Streams
│       ├── dao/ + impl/         Raw JDBC data access
│       ├── model/               Domain entities
│       ├── dto/                 Request/response payloads
│       ├── exception/           Custom exceptions + GlobalExceptionHandler
│       └── config/              CORS configuration
├── frontend/                    React + Vite SPA
│   └── src/
│       ├── components/          Sidebar, Topbar, tables, dialogs, icons
│       ├── pages/                Dashboard, Employees, Departments, Roles
│       ├── services/             Axios instance + per-resource API calls
│       ├── hooks/                 Toast notification system
│       ├── utils/                 Formatting helpers
│       └── styles/                Design-token based CSS
├── database/
│   ├── schema.sql               Tables, constraints, indexes
│   └── data.sql                 Sample departments/roles/employees
├── postman/
│   └── Employee-Management-API.postman_collection.json
├── docs/
│   ├── architecture.md
│   ├── database-design.md
│   └── api-documentation.md
├── .gitignore
└── README.md
```

## Database Design

3 tables (`departments`, `roles`, `employees`) with foreign keys, unique
constraints and indexes. Full details: [`docs/database-design.md`](docs/database-design.md)

## API Documentation

Full endpoint list, request/response examples and status codes:
[`docs/api-documentation.md`](docs/api-documentation.md)

---

## Setup Instructions

### Prerequisites
- JDK 21
- Maven 3.8+ (or use the included wrapper if you add one)
- MySQL 8.x, running locally
- Node.js 18+ and npm
- Postman (optional, for API testing)

### 1. MySQL Configuration

Create the database and load sample data:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/data.sql
```

This creates the `employee_management` database with 5 departments, 5 roles
and 15 sample employees.

### 2. Backend Setup

The backend reads its DB credentials from environment variables (falling
back to `root` / `root` for local dev — see
`backend/src/main/resources/application.properties`). Either export env vars
or just make sure your local MySQL root password matches the default.

```bash
cd backend

# Option A: use your shell env vars
export DB_URL="jdbc:mysql://localhost:3306/employee_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password

# Build and run
mvn clean install
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. Verify it's up:

```bash
curl http://localhost:8080/api/departments
```

> Import the project into IntelliJ IDEA as a Maven project if you prefer
> running `EmployeeManagementApplication.java` directly from the IDE.

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env    # adjust VITE_API_BASE_URL if your backend isn't on :8080
npm run dev
```

The app starts on **http://localhost:5173** and talks to the backend at the
URL configured in `.env` (`http://localhost:8080/api` by default).

### 4. Open the app

Visit `http://localhost:5173` — you should land on the Dashboard showing the
15 sample employees loaded from MySQL.

---

## Postman Testing

1. Open Postman → **Import** → select
   `postman/Employee-Management-API.postman_collection.json`.
2. The collection uses a `baseUrl` variable (defaults to
   `http://localhost:8080/api`) plus `employeeId` / `departmentId` /
   `roleId` variables you can update to match real ids in your database.
3. Folders: **Employees**, **Departments**, **Roles**, **Dashboard** — each
   with realistic request bodies, including examples that intentionally
   trigger a `409 Conflict` (duplicate employee code) and a `400 Bad Request`
   (validation failure) so you can see the error-handling contract in action.

## Running Backend Tests

```bash
cd backend
mvn test
```

`EmployeeServiceImplTest` covers employee creation, retrieval, update,
deletion, not-found handling, duplicate detection and status-filter
validation, using Mockito to isolate the service layer from the database.

---

## Known Limitations

- **No authentication/authorization** — this is an internal MVP scoped to
  CRUD + search/filter/sort; anyone with network access to the API can call
  it. Adding login would mean introducing Spring Security/JWT, which was
  intentionally excluded from this phase.
- **No pagination** — `GET /employees` returns the full result set. Fine at
  demo scale (tens of rows); would need `LIMIT`/`OFFSET` (or keyset
  pagination) at real scale.
- **No file/photo uploads, attendance, or leave management** — out of scope
  for this MVP (see Future Enhancements).
- **Single-tenant, single-environment config** — `application.properties`
  assumes one MySQL instance; no per-environment profiles beyond env-var
  overrides.

## Future Enhancements

- Authentication & role-based access control (Spring Security + JWT)
- Pagination and server-side infinite scroll for large employee lists
- Employee attendance and leave management modules
- Audit log of who changed what and when
- Export employee list to Excel/CSV
- Email notifications (e.g. on employee creation)
- Migrate to Spring Data JPA once the team is comfortable with the JDBC
  fundamentals demonstrated here
- Containerize with Docker for easier deployment

## Interview Questions From This Project

**Java / OOP**
- How does `Employee`, `Department` and `Role` demonstrate encapsulation?
- Why do the DAO and Service layers use interfaces? What would break if
  `EmployeeServiceImpl` depended on `EmployeeDaoImpl` directly instead of
  `EmployeeDao`?
- Where does the project use the Stream API, and why was it a good fit
  there (e.g. `DashboardServiceImpl` grouping employees by department)?

**JDBC**
- Walk me through what happens, line by line, in
  `EmployeeDaoImpl.create()`.
- Why is a `PreparedStatement` used instead of `Statement`, even for the
  dynamic search query? How is SQL injection avoided when the WHERE clause
  itself changes shape based on filters?
- Why can't the `ORDER BY` column be bound as a PreparedStatement
  parameter, and how does `EmployeeDaoImpl` handle that safely?

**Spring Boot**
- What's the difference between `@RestController`, `@Service` and
  `@Repository` here, and why does each layer use the annotation it does?
- Why constructor injection instead of `@Autowired` field injection?
- How does `GlobalExceptionHandler` turn a thrown `EmployeeNotFoundException`
  into a `404` JSON response?

**Database**
- Why does `employees` have `ON DELETE RESTRICT` on its foreign keys instead
  of `CASCADE`?
- Which columns are indexed, and why those specifically?
- Why does `EmployeeDaoImpl` JOIN departments/roles in one query instead of
  fetching them separately per employee?

**Frontend**
- How does the app know if a request is loading, succeeded, or failed on
  Departments vs Roles vs Employees pages? Why is that pattern repeated in
  three different places?
- Why does the frontend never filter data client-side (e.g. status/
  department filters), and instead always call the backend? What's the
  trade-off?
- How is form validation split between the client (`EmployeeForm.jsx`) and
  the server (`EmployeeRequest` Bean Validation annotations)? Why have both?

**Architecture**
- Trace a single "Create Employee" click all the way from the React button
  to the MySQL `INSERT` and back.
- If this needed to support 100,000 employees tomorrow, what's the first
  thing you'd change?

## Author

Built by **Manvendra Chaturvedi** — Frontend/Full Stack Developer, targeting
Java Full Stack Developer roles (Infosys and similar). Portfolio project
demonstrating Java, JDBC, Spring Boot REST APIs, MySQL and React fundamentals.
