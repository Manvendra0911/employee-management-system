-- ============================================================
-- Employee Management System - Sample Data
-- Run after schema.sql. All data is fictional.
-- ============================================================

USE employee_management;

-- ------------------------------------------------------------
-- Departments
-- ------------------------------------------------------------
INSERT INTO departments (department_name, description) VALUES
('Engineering',       'Product engineering, platform and application development'),
('Human Resources',   'Recruitment, onboarding, employee relations and policy'),
('Finance',           'Accounting, payroll, budgeting and financial planning'),
('Operations',        'Day-to-day business operations and process management'),
('Marketing',         'Brand, digital marketing, campaigns and communications');

-- ------------------------------------------------------------
-- Roles
-- ------------------------------------------------------------
INSERT INTO roles (role_name, description) VALUES
('Software Engineer',        'Designs, builds and maintains software applications'),
('Senior Software Engineer', 'Leads feature development and mentors junior engineers'),
('HR Executive',             'Handles recruitment, employee records and HR operations'),
('Finance Analyst',          'Analyzes financial data and supports budgeting decisions'),
('Project Manager',          'Plans, tracks and delivers cross-functional projects');

-- ------------------------------------------------------------
-- Employees (departments and roles referenced by name lookup
-- so this file stays valid even if AUTO_INCREMENT ids shift)
-- ------------------------------------------------------------
INSERT INTO employees
    (employee_code, first_name, last_name, email, phone, salary, joining_date, department_id, role_id, status)
VALUES
('EMP-1001', 'Aarav',    'Sharma',   'aarav.sharma@infotech-demo.com',   '9810012345', 68000.00, '2022-03-14',
    (SELECT department_id FROM departments WHERE department_name = 'Engineering'),
    (SELECT role_id FROM roles WHERE role_name = 'Software Engineer'), 'ACTIVE'),

('EMP-1002', 'Priya',    'Nair',     'priya.nair@infotech-demo.com',     '9820023456', 92000.00, '2020-07-01',
    (SELECT department_id FROM departments WHERE department_name = 'Engineering'),
    (SELECT role_id FROM roles WHERE role_name = 'Senior Software Engineer'), 'ACTIVE'),

('EMP-1003', 'Rohit',    'Verma',    'rohit.verma@infotech-demo.com',    '9830034567', 71000.00, '2021-11-20',
    (SELECT department_id FROM departments WHERE department_name = 'Engineering'),
    (SELECT role_id FROM roles WHERE role_name = 'Software Engineer'), 'ACTIVE'),

('EMP-1004', 'Sneha',    'Iyer',     'sneha.iyer@infotech-demo.com',     '9840045678', 55000.00, '2023-01-09',
    (SELECT department_id FROM departments WHERE department_name = 'Human Resources'),
    (SELECT role_id FROM roles WHERE role_name = 'HR Executive'), 'ACTIVE'),

('EMP-1005', 'Karan',    'Mehta',    'karan.mehta@infotech-demo.com',    '9850056789', 58000.00, '2019-05-18',
    (SELECT department_id FROM departments WHERE department_name = 'Human Resources'),
    (SELECT role_id FROM roles WHERE role_name = 'HR Executive'), 'INACTIVE'),

('EMP-1006', 'Ananya',   'Das',      'ananya.das@infotech-demo.com',     '9860067890', 63000.00, '2022-08-30',
    (SELECT department_id FROM departments WHERE department_name = 'Finance'),
    (SELECT role_id FROM roles WHERE role_name = 'Finance Analyst'), 'ACTIVE'),

('EMP-1007', 'Vikram',   'Reddy',    'vikram.reddy@infotech-demo.com',   '9870078901', 76000.00, '2018-02-12',
    (SELECT department_id FROM departments WHERE department_name = 'Finance'),
    (SELECT role_id FROM roles WHERE role_name = 'Finance Analyst'), 'ACTIVE'),

('EMP-1008', 'Meera',    'Pillai',   'meera.pillai@infotech-demo.com',   '9880089012', 84000.00, '2021-06-05',
    (SELECT department_id FROM departments WHERE department_name = 'Operations'),
    (SELECT role_id FROM roles WHERE role_name = 'Project Manager'), 'ACTIVE'),

('EMP-1009', 'Aditya',   'Kulkarni', 'aditya.kulkarni@infotech-demo.com','9890090123', 60000.00, '2023-04-17',
    (SELECT department_id FROM departments WHERE department_name = 'Operations'),
    (SELECT role_id FROM roles WHERE role_name = 'Software Engineer'), 'ACTIVE'),

('EMP-1010', 'Divya',    'Krishnan', 'divya.krishnan@infotech-demo.com', '9900001234', 52000.00, '2022-12-01',
    (SELECT department_id FROM departments WHERE department_name = 'Marketing'),
    (SELECT role_id FROM roles WHERE role_name = 'HR Executive'), 'ACTIVE'),

('EMP-1011', 'Manish',   'Chauhan',  'manish.chauhan@infotech-demo.com', '9910012345', 96000.00, '2017-09-25',
    (SELECT department_id FROM departments WHERE department_name = 'Engineering'),
    (SELECT role_id FROM roles WHERE role_name = 'Senior Software Engineer'), 'ACTIVE'),

('EMP-1012', 'Kavya',    'Menon',    'kavya.menon@infotech-demo.com',    '9920023456', 49000.00, '2023-07-11',
    (SELECT department_id FROM departments WHERE department_name = 'Marketing'),
    (SELECT role_id FROM roles WHERE role_name = 'HR Executive'), 'INACTIVE'),

('EMP-1013', 'Siddharth','Joshi',    'siddharth.joshi@infotech-demo.com','9930034567', 88000.00, '2019-10-03',
    (SELECT department_id FROM departments WHERE department_name = 'Operations'),
    (SELECT role_id FROM roles WHERE role_name = 'Project Manager'), 'ACTIVE'),

('EMP-1014', 'Ishita',   'Bose',     'ishita.bose@infotech-demo.com',    '9940045678', 67000.00, '2020-01-27',
    (SELECT department_id FROM departments WHERE department_name = 'Finance'),
    (SELECT role_id FROM roles WHERE role_name = 'Finance Analyst'), 'ACTIVE'),

('EMP-1015', 'Nikhil',   'Rao',      'nikhil.rao@infotech-demo.com',     '9950056789', 73000.00, '2021-03-08',
    (SELECT department_id FROM departments WHERE department_name = 'Engineering'),
    (SELECT role_id FROM roles WHERE role_name = 'Software Engineer'), 'ACTIVE');
