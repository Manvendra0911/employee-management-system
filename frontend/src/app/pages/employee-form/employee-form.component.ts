import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { RoleService } from '../../core/services/role.service';
import { ToastService } from '../../core/services/toast.service';
import { Department } from '../../core/models/department.model';
import { Role } from '../../core/models/role.model';
import { ApiError } from '../../core/models/api-error.model';
import { EmployeeRequest } from '../../core/models/employee.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LoadingStateComponent } from '../../shared/components/state-blocks/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/state-blocks/error-state.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, LoadingStateComponent, ErrorStateComponent],
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly roleService = inject(RoleService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id: string | null = null;
  isEdit = false;

  readonly departments = signal<Department[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly loading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly submitting = signal(false);
  /** Server-side field errors merged with client-side validation feedback. */
  readonly serverFieldErrors = signal<Record<string, string>>({});

  readonly form = this.fb.nonNullable.group({
    employeeCode: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)]],
    salary: ['', [Validators.required, Validators.min(0.01)]],
    joiningDate: ['', [Validators.required]],
    departmentId: ['', [Validators.required]],
    roleId: ['', [Validators.required]],
    status: ['ACTIVE', [Validators.required]],
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;
    this.loading.set(this.isEdit);

    forkJoin({
      departments: this.departmentService.getAll(),
      roles: this.roleService.getAll(),
    }).subscribe({
      next: ({ departments, roles }) => {
        this.departments.set(departments);
        this.roles.set(roles);
      },
      error: () => this.toast.error('Could not load departments/roles.'),
    });

    if (this.isEdit && this.id) {
      this.employeeService.getById(this.id).subscribe({
        next: (emp) => {
          this.form.patchValue({
            employeeCode: emp.employeeCode,
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            phone: emp.phone,
            salary: String(emp.salary),
            joiningDate: emp.joiningDate,
            departmentId: String(emp.departmentId),
            roleId: String(emp.roleId),
            status: emp.status,
          });
          this.loading.set(false);
        },
        error: (err: ApiError) => {
          this.loadError.set(err.message);
          this.loading.set(false);
        },
      });
    }
  }

  fieldError(field: string): string | null {
    const control = this.form.get(field);
    if (this.serverFieldErrors()[field]) return this.serverFieldErrors()[field];
    if (!control || !control.touched || control.valid) return null;

    if (control.hasError('required')) return this.requiredMessage(field);
    if (field === 'email' && control.hasError('pattern')) return 'Enter a valid email address';
    if (field === 'phone' && control.hasError('pattern')) return 'Enter a valid phone number';
    if (field === 'salary' && control.hasError('min')) return 'Salary must be greater than 0';
    return null;
  }

  private requiredMessage(field: string): string {
    const messages: Record<string, string> = {
      employeeCode: 'Employee code is required',
      firstName: 'First name is required',
      lastName: 'Last name is required',
      email: 'Email is required',
      phone: 'Phone number is required',
      salary: 'Salary is required',
      joiningDate: 'Joining date is required',
      departmentId: 'Department is required',
      roleId: 'Role is required',
      status: 'Status is required',
    };
    return messages[field] || 'This field is required';
  }

  handleSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.serverFieldErrors.set({});
    const raw = this.form.getRawValue();
    const payload: EmployeeRequest = {
      employeeCode: raw.employeeCode,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone,
      salary: Number(raw.salary),
      joiningDate: raw.joiningDate,
      departmentId: Number(raw.departmentId),
      roleId: Number(raw.roleId),
      status: raw.status as 'ACTIVE' | 'INACTIVE',
    };

    const request$ =
      this.isEdit && this.id
        ? this.employeeService.update(this.id, payload)
        : this.employeeService.create(payload);

    request$.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Employee updated successfully.' : 'Employee created successfully.');
        this.submitting.set(false);
        this.router.navigate(['/employees']);
      },
      error: (err: ApiError) => {
        if (err.fieldErrors) {
          this.serverFieldErrors.set(err.fieldErrors);
          this.toast.error('Please fix the highlighted fields.');
        } else {
          this.toast.error(err.message);
        }
        this.submitting.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }

  reload(): void {
    window.location.reload();
  }
}
