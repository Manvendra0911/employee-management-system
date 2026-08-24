import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';
import { EmployeeDetailsComponent } from './pages/employee-details/employee-details.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { RolesComponent } from './pages/roles/roles.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
      { path: 'employees', component: EmployeeListComponent, data: { title: 'Employees' } },
      { path: 'employees/new', component: EmployeeFormComponent, data: { title: 'Add Employee' } },
      { path: 'employees/:id/edit', component: EmployeeFormComponent, data: { title: 'Edit Employee' } },
      { path: 'employees/:id', component: EmployeeDetailsComponent, data: { title: 'Employee Details' } },
      { path: 'departments', component: DepartmentsComponent, data: { title: 'Departments' } },
      { path: 'roles', component: RolesComponent, data: { title: 'Roles' } },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
