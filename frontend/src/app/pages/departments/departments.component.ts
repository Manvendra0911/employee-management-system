import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DepartmentService } from '../../core/services/department.service';
import { EmployeeService } from '../../core/services/employee.service';
import { ToastService } from '../../core/services/toast.service';
import { Department } from '../../core/models/department.model';
import { ApiError } from '../../core/models/api-error.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoadingStateComponent } from '../../shared/components/state-blocks/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/state-blocks/error-state.component';
import { EmptyStateComponent } from '../../shared/components/state-blocks/empty-state.component';
import {
  NameFormModalComponent,
  NameFormSubmitValue,
} from '../../shared/components/name-form-modal/name-form-modal.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    IconComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    NameFormModalComponent,
  ],
  templateUrl: './departments.component.html',
})
export class DepartmentsComponent implements OnInit {
  private readonly departmentService = inject(DepartmentService);
  private readonly employeeService = inject(EmployeeService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly departments = signal<Department[]>([]);
  readonly counts = signal<Record<number, number>>({});
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly modalOpen = signal(false);
  readonly editing = signal<Department | null>(null);
  readonly submitting = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      departments: this.departmentService.getAll(),
      employees: this.employeeService.getAll(),
    }).subscribe({
      next: ({ departments, employees }) => {
        this.departments.set(departments);
        const tally: Record<number, number> = {};
        employees.forEach((e) => {
          tally[e.departmentId] = (tally[e.departmentId] || 0) + 1;
        });
        this.counts.set(tally);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.modalOpen.set(true);
  }

  openEdit(dept: Department): void {
    this.editing.set(dept);
    this.modalOpen.set(true);
  }

  handleSubmit(value: NameFormSubmitValue): void {
    this.submitting.set(true);
    const editingDept = this.editing();
    const request$ = editingDept
      ? this.departmentService.update(editingDept.departmentId, {
          departmentName: value.name,
          description: value.description,
        })
      : this.departmentService.create({ departmentName: value.name, description: value.description });

    request$.subscribe({
      next: () => {
        this.toast.success(editingDept ? 'Department updated successfully.' : 'Department created successfully.');
        this.modalOpen.set(false);
        this.submitting.set(false);
        this.load();
      },
      error: (err: ApiError) => {
        this.toast.error(err.message);
        this.submitting.set(false);
      },
    });
  }

  viewEmployees(dept: Department): void {
    this.router.navigate(['/employees'], { queryParams: { departmentId: dept.departmentId } });
  }

  countFor(dept: Department): number {
    return this.counts()[dept.departmentId] || 0;
  }
}
