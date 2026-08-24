import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../../../core/models/employee.model';
import { colorForKey, formatCurrency, initials } from '../../../core/utils/format.util';
import { IconComponent } from '../icon/icon.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

const COLUMNS: Column[] = [
  { key: 'first_name', label: 'Employee', sortable: true },
  { key: 'employee_code', label: 'Employee Code', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'department', label: 'Department', sortable: false },
  { key: 'role', label: 'Role', sortable: false },
  { key: 'salary', label: 'Salary', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [IconComponent, StatusBadgeComponent],
  template: `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            @for (col of columns; track col.key) {
              <th [class.sortable]="col.sortable" (click)="handleSort(col)">
                <span style="display: inline-flex; align-items: center; gap: 4px">
                  {{ col.label }}
                  @if (col.sortable) {
                    <app-icon name="chevron-up-down" [size]="12" />
                  }
                </span>
              </th>
            }
            <th style="text-align: right">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (emp of employees; track emp.employeeId) {
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 10px">
                  <div
                    class="avatar-circle"
                    [style.background]="colorForKey(emp.departmentName) + '22'"
                    [style.color]="colorForKey(emp.departmentName)"
                  >
                    {{ initials(emp.firstName, emp.lastName) }}
                  </div>
                  <span style="font-weight: 600">{{ emp.fullName }}</span>
                </div>
              </td>
              <td class="mono">{{ emp.employeeCode }}</td>
              <td>{{ emp.email }}</td>
              <td>{{ emp.departmentName }}</td>
              <td>{{ emp.roleName }}</td>
              <td class="mono">{{ formatCurrency(emp.salary) }}</td>
              <td>
                <app-status-badge [status]="emp.status" />
              </td>
              <td>
                <div class="row-actions">
                  <button class="btn-icon" title="View details" (click)="viewEmployee(emp)">
                    <app-icon name="eye" />
                  </button>
                  <button class="btn-icon" title="Edit employee" (click)="editEmployee(emp)">
                    <app-icon name="edit" />
                  </button>
                  <button
                    class="btn-icon"
                    title="Delete employee"
                    (click)="deleteRequest.emit(emp)"
                    style="color: var(--color-danger)"
                  >
                    <app-icon name="trash" />
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .avatar-circle {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11.5px;
        font-weight: 700;
        flex-shrink: 0;
      }
    `,
  ],
})
export class EmployeeTableComponent {
  @Input({ required: true }) employees: Employee[] = [];
  @Input() sortBy = '';
  @Input() sortDirection: 'asc' | 'desc' = 'desc';
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() deleteRequest = new EventEmitter<Employee>();

  readonly columns = COLUMNS;
  readonly colorForKey = colorForKey;
  readonly initials = initials;
  readonly formatCurrency = formatCurrency;

  private readonly router = inject(Router);

  handleSort(col: Column): void {
    if (!col.sortable) return;
    if (this.sortBy === col.key) {
      this.sortChange.emit({ column: col.key, direction: this.sortDirection === 'asc' ? 'desc' : 'asc' });
    } else {
      this.sortChange.emit({ column: col.key, direction: 'asc' });
    }
  }

  viewEmployee(emp: Employee): void {
    this.router.navigate(['/employees', emp.employeeId]);
  }

  editEmployee(emp: Employee): void {
    this.router.navigate(['/employees', emp.employeeId, 'edit']);
  }
}
