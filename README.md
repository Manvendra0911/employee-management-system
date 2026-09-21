# PeopleDesk — Employee Management System

A full-stack Employee Management System built with **Angular, Java, Spring Boot, JDBC, and MySQL**.

The application provides an internal HR-style interface for managing employees, departments, and roles, along with a dashboard for workforce insights.

## 🌐 Live Demo

**Application:**  
https://employee-management-frontend-muv4.onrender.com

**Backend API:**  
https://employee-management-system-7za3.onrender.com/api/employees

> The frontend is deployed on Render and communicates with the Spring Boot REST API.

---

## 📌 Project Overview

PeopleDesk is a full-stack web application designed to demonstrate a practical layered architecture using Angular on the frontend and Spring Boot with plain JDBC on the backend.

The backend intentionally uses **JDBC instead of JPA/Hibernate**, allowing SQL queries and database interactions to be explicitly written and understood.

### Architecture

```text
Angular Frontend
       ↓
Spring Boot REST API
       ↓
Controller
       ↓
Service
       ↓
DAO (JDBC)
       ↓
MySQL Database
✨ Features
👥 Employee Management
Add employees
View employees
Update employees
Delete employees
Search by name, employee code, or email
Filter by department
Filter by role
Filter by status
Sort employee data
🏢 Department Management
Add departments
Update departments
View employee counts by department
🎯 Role Management
Add roles
Update roles
View employee counts by role
📊 Dashboard
Total employees
Active employees
Inactive employees
Department count
Role count
Average salary
Employees by department
Recently added employees
🛠️ Technology Stack
Frontend
Angular
TypeScript
Angular Router
Angular HttpClient
CSS
Backend
Java 21
Spring Boot
Spring MVC
JDBC
Bean Validation
Maven
Database
MySQL
Development & Testing
IntelliJ IDEA
Visual Studio Code
MySQL Workbench
Postman
Git
GitHub
Deployment
Render
🏗️ Backend Architecture

The backend follows a layered architecture:

Controller
    ↓
Service
    ↓
DAO
    ↓
MySQL
Controller

Handles HTTP requests and exposes REST API endpoints.

Service

Contains application/business logic.

DAO

Handles database operations using plain JDBC and SQL queries.

Database

MySQL stores employees, departments, and roles.

📁 Project Structure
employee-management-system/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/employeemanagement/
│   │       │   ├── controller/
│   │       │   ├── service/
│   │       │   ├── dao/
│   │       │   ├── model/
│   │       │   ├── dto/
│   │       │   ├── exception/
│   │       │   └── config/
│   │       │
│   │       └── resources/
│   │
│   └── pom.xml
│
├── frontend/
│   └── src/
│       └── app/
│           ├── core/
│           ├── shared/
│           └── pages/
│               ├── dashboard/
│               ├── employees/
│               ├── departments/
│               └── roles/
│
├── database/
│   ├── schema.sql
│   └── data.sql
│
├── docs/
│
├── postman/
│
└── README.md
🗄️ Database

The application uses MySQL.

Main tables:

employees
departments
roles

The tables are connected using foreign-key relationships.

Database scripts are available in:

database/
├── schema.sql
└── data.sql
🔌 REST API

The backend exposes REST APIs for:

Employees
Departments
Roles
Dashboard

Example:

GET /api/employees

Production API:

https://employee-management-system-7za3.onrender.com/api/employees

A Postman collection is available in:

postman/
🚀 Running Locally
Prerequisites

Install:

JDK 21
MySQL
Node.js
npm
Angular CLI
Maven
1. Clone the repository
git clone https://github.com/Manvendra0911/employee-management-system.git

cd employee-management-system
2. Set up MySQL

Create the database using:

mysql -u root -p < database/schema.sql

Load the initial data:

mysql -u root -p < database/data.sql
3. Configure the backend

Backend configuration is located at:

backend/src/main/resources/application.properties

Database configuration can be provided using:

DB_URL
DB_USERNAME
DB_PASSWORD
4. Start the Spring Boot backend
cd backend
mvn spring-boot:run

Backend runs on:

http://localhost:8080
5. Start the Angular frontend

Open another terminal:

cd frontend
npm install
ng serve

Frontend runs on:

http://localhost:4200

The Angular application communicates with the Spring Boot API.

🧪 Testing
Backend tests
cd backend
mvn test
API testing

The repository includes a Postman collection covering the available:

Employee APIs
Department APIs
Role APIs
Dashboard APIs
☁️ Deployment

The production application is deployed using Render.

Frontend
Angular
↓
Render Static Site
Backend
Spring Boot
↓
Docker
↓
Render Web Service
Database
MySQL

Production frontend:

https://employee-management-frontend-muv4.onrender.com

🔐 Configuration & Security

Database credentials are supplied through environment variables rather than being committed to the repository.

Example:

DB_URL
DB_USERNAME
DB_PASSWORD

Sensitive credentials should never be committed to GitHub.

🔮 Future Improvements

Potential improvements include:

Authentication and authorization
Pagination
Attendance management
Leave tracking
Audit logging
CSV/Excel export
Email notifications
👨‍💻 Author

Manvendra Chaturvedi

Java Full Stack Developer

GitHub:

https://github.com/Manvendra0911
