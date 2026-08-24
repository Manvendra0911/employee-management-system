# PeopleDesk — Employee Management System

A clean, interview-defensible Java Full Stack Employee Management System,
built to demonstrate practical **Java + Spring Boot + JDBC + MySQL + Angular**
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
13. [Author](#author)

---

## Project Overview

PeopleDesk is an internal HR-style tool for managing employees, departments
and roles. It's deliberately scoped to a **realistic, explainable MVP**
rather than an over-engineered showcase: three related MySQL tables, a
layered Spring Boot backend built on **hand-written JDBC** (no
Hibernate/JPA), and an Angular frontend that talks to it entirely through REST.

The goal is a project you can open in an interview and explain, line by
line, from a button click in the browser all the way down to the SQL that
runs against MySQL.

## Features

- **Employee management**: create, view, update, delete, search, filter
  (by department / role / status) and sort employees.

- **Department management**: list, add, update, delete departments; view employee
  count per department.

- **Role management**: list, add, update, delete roles; view employee count per role.

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

**Frontend:** Angular 21 · TypeScript · HTML5 · CSS3 · Angular Router ·
Angular HttpClient · Angular CLI

**Tools:** IntelliJ IDEA Community Edition (backend) · VS Code (frontend) ·
MySQL Workbench · Postman · Git / GitHub

**Explicitly not used** (see [Known Limitations](#known-limitations)):

Spring Security, JWT, Spring Data JPA, Hibernate, microservices, Docker,
Kubernetes, Kafka, Redis, any cloud provider.

## Architecture

```text
Angular (HttpClient) -> Spring Boot Controller -> Service -> DAO -> JDBC -> MySQL

Full explanation with request walkthroughs: docs/architecture.md

Folder Structure
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
│
├── frontend/                    Angular SPA
│   └── src/app/
│       ├── core/
│       │   ├── models/          TypeScript interfaces mirroring backend DTOs
│       │   ├── services/        HttpClient services + error interceptor
│       │   └── utils/           Formatting helpers
│       ├── shared/components/   Layout, Sidebar, Topbar, tables, dialogs, icons
│       ├── pages/               Dashboard, Employees, Departments, Roles
│       ├── app.routes.ts
│       └── app.config.ts
│   └── src/environments/        Dev/prod API base URL config
│
├── database/
│   ├── schema.sql               Tables, constraints, indexes
│   └── data.sql                 Sample departments/roles/employees
│
├── postman/
│   └── Employee-Management-API.postman_collection.json
│
├── docs/
│   ├── architecture.md
│   ├── database-design.md
│   ├── api-documentation.md
│   └── interview-questions.md
│
├── .gitignore
└── README.md
Database Design

3 tables (departments, roles, employees) with foreign keys, unique
constraints and indexes.

Full details: docs/database-design.md

API Documentation

Full endpoint list, request/response examples and status codes:

docs/api-documentation.md

Setup Instructions
Prerequisites
JDK 21
Maven 3.8+ (or use the included wrapper if you add one)
MySQL 8.x, running locally
Node.js 20.19+ / 22.12+ and npm
Angular CLI (npm install -g @angular/cli) — or just use npx ng
Postman (optional, for API testing)
1. MySQL Configuration

Create the database and load sample data:

mysql -u root -p < database/schema.sql
mysql -u root -p < database/data.sql

This creates the employee_management database with the original seed data:

5 departments
5 roles
15 fictional sample employees

Additional records may exist in the local development database from
development and testing.

2. Backend Setup

The backend reads its DB credentials from environment variables (falling
back to local development configuration — see
backend/src/main/resources/application.properties).

For local development, configure the following environment variables:

cd backend

export DB_URL="jdbc:mysql://localhost:3306/employee_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password

Build and run:

mvn clean install
mvn spring-boot:run

The API starts on:

http://localhost:8080

Verify it is running:

curl http://localhost:8080/api/departments

Import the project into IntelliJ IDEA as a Maven project if you prefer
running EmployeeManagementApplication.java directly from the IDE.

3. Frontend Setup
cd frontend
npm install
ng serve

The development application starts on:

http://localhost:4200

The development frontend uses the API URL configured in:

src/environments/environment.ts

Default local API URL:

http://localhost:8080/api

4. Production Build

To create a production build of the Angular frontend:

cd frontend
ng build

The production build is generated in the dist/ directory.

The production build uses the API URL configured in:

src/environments/environment.prod.ts

Before deployment, this URL must be changed from the local Spring Boot
backend URL to the public URL of the deployed backend.

For local production-build testing, the generated Angular application can be
served using a static server such as http-server.

Example:

npx http-server dist/frontend/browser -p 5000

The production build can then be opened at:

http://localhost:5000

The production build must be tested against a running backend before deployment.

5. Open the App

For normal local development, visit:

http://localhost:4200

You should land on the Dashboard showing the data currently loaded from MySQL.

The original seed data contains 15 sample employees. Additional employees,
departments, and roles may exist in the local development database because of
development and CRUD testing.

Postman Testing
Open Postman → Import → select
postman/Employee-Management-API.postman_collection.json.
The collection uses a baseUrl variable (defaults to
http://localhost:8080/api) plus employeeId / departmentId /
roleId variables you can update to match real ids in your database.
Folders: Employees, Departments, Roles, Dashboard — each
with realistic request bodies, including examples that intentionally
trigger a 409 Conflict (duplicate employee code) and a 400 Bad Request
(validation failure) so you can see the error-handling contract in action.
Running Backend Tests
cd backend
mvn test

EmployeeServiceImplTest covers employee creation, retrieval, update,
deletion, not-found handling, duplicate detection and status-filter
validation, using Mockito to isolate the service layer from the database.

Known Limitations
No authentication/authorization — this is an internal MVP scoped to
CRUD + search/filter/sort; anyone with network access to the API can call
it. Adding login would mean introducing Spring Security/JWT, which was
intentionally excluded from this phase.
No pagination — GET /employees returns the full result set. Fine at
demo scale (tens of rows); would need LIMIT/OFFSET (or keyset
pagination) at real scale.
No file/photo uploads, attendance, or leave management — out of scope
for this MVP (see Future Enhancements).
Single-tenant, single-environment config — application.properties
assumes one MySQL instance; no per-environment profiles beyond env-var
overrides.
Future Enhancements
Authentication & role-based access control (Spring Security + JWT)
Pagination and server-side infinite scroll for large employee lists
Employee attendance and leave management modules
Audit log of who changed what and when
Export employee list to Excel/CSV
Email notifications (e.g. on employee creation)
Migrate to Spring Data JPA once the team is comfortable with the JDBC
fundamentals demonstrated here
Containerize with Docker for easier deployment

Author

Built by Manvendra Chaturvedi — Frontend/Full Stack Developer, targeting
Java Full Stack Developer roles (Infosys and similar). Portfolio project
demonstrating Java, JDBC, Spring Boot REST APIs, MySQL and Angular
fundamentals.
