# API Documentation

Base URL (local development): `http://localhost:8080/api`

All request/response bodies are JSON. All error responses follow the same
shape (see [Error format](#error-format) below).

---

## Employees

### `GET /employees`

List employees. All query parameters are optional and can be combined.

| Param | Type | Example | Notes |
|---|---|---|---|
| departmentId | int | `?departmentId=1` | Filter by department |
| roleId | int | `?roleId=2` | Filter by role |
| status | string | `?status=ACTIVE` | `ACTIVE` or `INACTIVE` |
| sortBy | string | `?sortBy=salary` | One of: `employee_id`, `employee_code`, `first_name`, `last_name`, `email`, `salary`, `joining_date`, `status`, `created_at` |
| sortDirection | string | `?sortDirection=desc` | `asc` or `desc` (default `desc`) |

**Response `200 OK`** — array of `EmployeeResponse` (see below).

### `GET /employees/search?name=John`

Same filters as above, plus a `name` keyword that matches first name, last
name, employee code or email (case-insensitive partial match).

Internally this calls the same DAO method as `GET /employees` — it's one
flexible query, not a separate hardcoded search.

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