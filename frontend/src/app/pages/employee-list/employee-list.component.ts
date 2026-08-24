import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { RoleService } from '../../core/services/role.service';
import { ToastService } from '../../core/services/toast.service';
import { Employee } from '../../core/models/employee.model';
import { Department } from '../../core/models/department.model';
import { Role } from '../../core/models/role.model';
import { ApiError } from '../../core/models/api-error.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoadingStateComponent } from '../../shared/components/state-blocks/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/state-blocks/error-state.component';
import { EmptyStateComponent } from '../../shared/components/state-blocks/empty-state.component';
import { EmployeeTableComponent } from '../../shared/components/employee-table/employee-table.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    FormsModule,
    IconComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    EmployeeTableComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly roleService = inject(RoleService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly employees = signal<Employee[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly roles = signal<Role[]>([]);

  keyword = '';
  departmentId = '';
  roleId = '';
  status = '';
  sortBy = 'employee_id';
  sortDirection: 'asc' | 'desc' = 'desc';

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly deleteTarget = signal<Employee | null>(null);
  readonly deleting = signal(false);

  private readonly filterChange$ = new Subject<void>();

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.departmentId = params.get('departmentId') || '';
    this.roleId = params.get('roleId') || '';
    this.status = params.get('status') || '';

    this.departmentService.getAll().subscribe({ next: (deps) => this.departments.set(deps), error: () => {} });
    this.roleService.getAll().subscribe({ next: (rls) => this.roles.set(rls), error: () => {} });

    // Debounce search-as-you-type / filter changes against the backend,
    // mirroring the original React app's setTimeout-based debounce.
    this.filterChange$.pipe(debounceTime(350)).subscribe(() => this.loadEmployees());
    this.loadEmployees();
  }

  onFilterChange(): void {
    this.filterChange$.next();
  }

  loadEmployees(): void {
    this.loading.set(true);
    this.error.set(null);
    this.employeeService
      .getAll({
        keyword: this.keyword,
        departmentId: this.departmentId || undefined,
        roleId: this.roleId || undefined,
        status: this.status || undefined,
        sortBy: this.sortBy,
        sortDirection: this.sortDirection,
      })
      .subscribe({
        next: (data) => {
          this.employees.set(data);
          this.loading.set(false);
        },
        error: (err: ApiError) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }

  handleSortChange(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortBy = event.column;
    this.sortDirection = event.direction;
    this.loadEmployees();
  }

  requestDelete(emp: Employee): void {
    this.deleteTarget.set(emp);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.deleting.set(true);
    this.employeeService.remove(target.employeeId).subscribe({
      next: () => {
        this.toast.success('Employee deleted successfully.');
        this.deleteTarget.set(null);
        this.deleting.set(false);
        this.loadEmployees();
      },
      error: (err: ApiError) => {
        this.toast.error(err.message);
        this.deleting.set(false);
      },
    });
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  addEmployee(): void {
    this.router.navigate(['/employees/new']);
  }

  get hasFilters(): boolean {
    return !!(this.keyword || this.departmentId || this.roleId || this.status);
  }

  get deleteDescription(): string {
    const t = this.deleteTarget();
    return t
      ? `Are you sure you want to delete ${t.fullName} (${t.employeeCode})? This action cannot be undone.`
      : '';
  }
}
