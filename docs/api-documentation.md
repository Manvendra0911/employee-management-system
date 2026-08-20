# API Documentation

Base URL (local development): `http://localhost:8080/api`

All request/response bodies are JSON. All error responses follow the same
shape (see [Error format](#error-format) below).

---

## Employees

### `GET /employees`
List employees. All query parameters are optional and can be combined.

| Param          | Type   | Example              | Notes                                    |
|----------------|--------|-----------------------|-------------------------------------------|
| departmentId   | int    | `?departmentId=1`     | Filter by department                       |
| roleId         | int    | `?roleId=2`            | Filter by role                             |
| status         | string | `?status=ACTIVE`       | `ACTIVE` or `INACTIVE`                     |
| sortBy         | string | `?sortBy=salary`       | One of: employee_id, employee_code, first_name, last_name, email, salary, joining_date, status, created_at |
| sortDirection  | string | `?sortDirection=desc`  | `asc` or `desc` (default `desc`)           |

**Response `200 OK`** — array of `EmployeeResponse` (see below).

### `GET /employees/search?name=John`
Same filters as above, plus a `name` keyword that matches first name, last
name, employee code or email (case-insensitive partial match). Internally
this calls the same DAO method as `GET /employees` — it's one flexible query,
not a separate hardcoded search.

### `GET /employees/{id}`
**Response `200 OK`** — single `EmployeeResponse`.
**Response `404 NOT FOUND`** if the id doesn't exist.

### `POST /employees`
Create a new employee.

**Request body:**
```json
{
  "employeeCode": "EMP-2001",
  "firstName": "Rahul",
  "lastName": "Verma",
  "email": "rahul.verma@infotech-demo.com",
  "phone": "9990011223",
  "salary": 72000.00,
  "joiningDate": "2024-06-01",
  "departmentId": 1,
  "roleId": 1,
  "status": "ACTIVE"
}
```

**Responses:**
- `201 CREATED` — the created `EmployeeResponse`
- `400 BAD REQUEST` — validation failure (missing/invalid fields) — includes `fieldErrors`
- `409 CONFLICT` — `employeeCode` or `email` already exists

### `PUT /employees/{id}`
Update an existing employee. Same request body shape as `POST`.

**Responses:**
- `200 OK` — the updated `EmployeeResponse`
- `400 BAD REQUEST` — validation failure, or referenced department/role doesn't exist
- `404 NOT FOUND` — employee doesn't exist
- `409 CONFLICT` — `employeeCode` or `email` already used by a different employee

### `DELETE /employees/{id}`
**Responses:**
- `204 NO CONTENT` — deleted successfully
- `404 NOT FOUND` — employee doesn't exist

### `EmployeeResponse` shape
```json
{
  "employeeId": 1,
  "employeeCode": "EMP-1001",
  "firstName": "Aarav",
  "lastName": "Sharma",
  "fullName": "Aarav Sharma",
  "email": "aarav.sharma@infotech-demo.com",
  "phone": "9810012345",
  "salary": 68000.00,
  "joiningDate": "2022-03-14",
  "departmentId": 1,
  "departmentName": "Engineering",
  "roleId": 1,
  "roleName": "Software Engineer",
  "status": "ACTIVE",
  "createdAt": "2026-08-01T10:15:30",
  "updatedAt": "2026-08-01T10:15:30"
}
```

---

## Departments

| Method | Path                  | Description            |
|--------|------------------------|--------------------------|
| GET    | `/departments`         | List all departments      |
| GET    | `/departments/{id}`    | Get a department by id    |
| POST   | `/departments`         | Create a department       |
| PUT    | `/departments/{id}`    | Update a department       |

**Request body (POST/PUT):**
```json
{ "departmentName": "Customer Support", "description": "Handles customer queries" }
```

**Responses:** `201 CREATED` (create), `200 OK` (get/update), `404 NOT FOUND`,
`400 BAD REQUEST` (duplicate name or validation failure).

---

## Roles

| Method | Path            | Description         |
|--------|------------------|-----------------------|
| GET    | `/roles`         | List all roles          |
| GET    | `/roles/{id}`    | Get a role by id        |
| POST   | `/roles`         | Create a role            |
| PUT    | `/roles/{id}`    | Update a role            |

**Request body (POST/PUT):**
```json
{ "roleName": "QA Engineer", "description": "Tests software and ensures quality" }
```

---

## Dashboard

### `GET /dashboard/stats`
Returns aggregated, live statistics computed from the database.

```json
{
  "totalEmployees": 15,
  "activeEmployees": 13,
  "inactiveEmployees": 2,
  "totalDepartments": 5,
  "totalRoles": 5,
  "averageSalary": 70466.67,
  "recentEmployees": [ /* up to 5 EmployeeResponse, most recently created first */ ],
  "employeesByDepartment": { "Engineering": 5, "Finance": 3, "...": 0 }
}
```

---

## HTTP status codes used

| Code | Meaning        | When                                                        |
|------|-----------------|---------------------------------------------------------------|
| 200  | OK              | Successful GET/PUT                                             |
| 201  | Created         | Successful POST                                                 |
| 204  | No Content      | Successful DELETE                                               |
| 400  | Bad Request     | Validation failure, invalid filter value, invalid FK reference  |
| 404  | Not Found       | Employee/Department/Role id doesn't exist                       |
| 409  | Conflict        | Duplicate employee code / email / department name / role name   |
| 500  | Internal Server Error | Unexpected server or database error                       |

## Error format

Every error response (from `GlobalExceptionHandler`) looks like this:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Employee not found with id: 42",
  "path": "/api/employees/42",
  "timestamp": "2026-08-20T10:15:30"
}
```

Validation errors additionally include a `fieldErrors` map:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for one or more fields",
  "path": "/api/employees",
  "timestamp": "2026-08-20T10:15:30",
  "fieldErrors": {
    "email": "Email must be a valid email address",
    "salary": "Salary must be greater than 0"
  }
}
```

Raw stack traces and SQL error details are never sent to the client — the
`DatabaseException` handler always returns a generic message while the real
detail is logged server-side.
