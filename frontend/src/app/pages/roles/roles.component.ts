import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RoleService } from '../../core/services/role.service';
import { EmployeeService } from '../../core/services/employee.service';
import { ToastService } from '../../core/services/toast.service';
import { Role } from '../../core/models/role.model';
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
  selector: 'app-roles',
  standalone: true,
  imports: [
    IconComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    NameFormModalComponent,
  ],
  templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit {
  private readonly roleService = inject(RoleService);
  private readonly employeeService = inject(EmployeeService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly roles = signal<Role[]>([]);
  readonly counts = signal<Record<number, number>>({});
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly modalOpen = signal(false);
  readonly editing = signal<Role | null>(null);
  readonly submitting = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      roles: this.roleService.getAll(),
      employees: this.employeeService.getAll(),
    }).subscribe({
      next: ({ roles, employees }) => {
        this.roles.set(roles);
        const tally: Record<number, number> = {};
        employees.forEach((e) => {
          tally[e.roleId] = (tally[e.roleId] || 0) + 1;
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

  openEdit(role: Role): void {
    this.editing.set(role);
    this.modalOpen.set(true);
  }

  handleSubmit(value: NameFormSubmitValue): void {
    this.submitting.set(true);
    const editingRole = this.editing();
    const request$ = editingRole
      ? this.roleService.update(editingRole.roleId, { roleName: value.name, description: value.description })
      : this.roleService.create({ roleName: value.name, description: value.description });

    request$.subscribe({
      next: () => {
        this.toast.success(editingRole ? 'Role updated successfully.' : 'Role created successfully.');
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

  viewEmployees(role: Role): void {
    this.router.navigate(['/employees'], { queryParams: { roleId: role.roleId } });
  }

  countFor(role: Role): number {
    return this.counts()[role.roleId] || 0;
  }
}
