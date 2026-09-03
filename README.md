

Readme · MD
PeopleDesk — Employee Management System
A full-stack Employee Management System I built to practice (and demonstrate) a real Java + Spring Boot backend paired with an Angular frontend — no shortcuts like JPA/Hibernate on the backend, just plain JDBC so every query is written and explainable by hand.

It does what most internal HR tools do: manage employees, departments and roles, with a dashboard giving a quick overview of the workforce.

What it does
Employees

Add, view, update, delete
Search by name/code/email
Filter by department, role, status
Sortable columns
Departments & Roles

Add / update
See how many employees are in each one
Dashboard

Headcount (total / active / inactive), department & role counts, average salary
Employees-by-department breakdown
Recently added employees
Stack
Frontend — Angular, TypeScript, Angular Router, Angular HttpClient, plain CSS Backend — Java 21, Spring Boot, JDBC (no ORM), Bean Validation, Maven Database — MySQL

Built and tested with IntelliJ IDEA, VS Code, MySQL Workbench, Postman, and Git.

How it's wired together
Angular  →  Spring Boot Controller  →  Service  →  DAO (JDBC)  →  MySQL
Every layer is a plain class you can step through — the DAO package has the raw SQL, no magic query generation.

Project layout
employee-management-system/
├── backend/          Spring Boot API
│   └── src/main/java/com/employeemanagement/
│       ├── controller/
│       ├── service/
│       ├── dao/
│       ├── model/
│       ├── dto/
│       ├── exception/
│       └── config/
├── frontend/         Angular app
│   └── src/app/
│       ├── core/       services, models, interceptor
│       ├── shared/     reusable components (sidebar, tables, dialogs...)
│       └── pages/      dashboard, employees, departments, roles
├── database/         schema.sql + data.sql
├── docs/
├── postman/
└── README.md
Database
Three tables — employees, departments, roles — linked by foreign keys. Scripts are in database/.

Running it locally
You'll need: JDK 21, MySQL, Node.js + npm, Angular CLI, Maven.

1. Set up the database

bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/data.sql
2. Backend

Set your MySQL credentials in backend/src/main/resources/application.properties (or via the DB_URL / DB_USERNAME / DB_PASSWORD env vars — that's what the properties file actually reads from), then:

bash
cd backend
mvn spring-boot:run
Runs on http://localhost:8080.

3. Frontend

bash
cd frontend
npm install
ng serve
Runs on http://localhost:4200 and talks to the backend automatically (see src/environments/environment.ts for the API URL).

Heads up: if you ever serve a production build from a different port (I hit this running dist/ on port 5000), you'll need to add that origin to app.cors.allowed-origins in application.properties, or the browser will block the API calls with a CORS error and the app will just show a generic "can't reach the server" message.

Testing the API directly
There's a Postman collection in postman/ covering all the Employee/Department/Role/Dashboard endpoints, if you want to poke the backend without the UI.

Running backend tests
bash
cd backend
mvn test
What I'd add next
Didn't get to these, but they'd be the obvious next steps:

Login/auth (right now anyone can hit the API)
Pagination — fine for 15 employees, wouldn't be for 15,000
Attendance & leave tracking
Audit log of who changed what
Export to CSV/Excel
Email notifications
Author
Manvendra Chaturvedi — Java Full Stack Developer


