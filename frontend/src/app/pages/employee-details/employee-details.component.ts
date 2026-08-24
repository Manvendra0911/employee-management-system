import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { ToastService } from '../../core/services/toast.service';
import { Employee } from '../../core/models/employee.model';
import { ApiError } from '../../core/models/api-error.model';
import { colorForKey, formatCurrency, formatDate, formatDateTime, initials } from '../../core/utils/format.util';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingStateComponent } from '../../shared/components/state-blocks/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/state-blocks/error-state.component';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    IconComponent,
    StatusBadgeComponent,
    ConfirmDialogComponent,
    LoadingStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './employee-details.component.html',
})
export class EmployeeDetailsComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id!: string;

  readonly employee = signal<Employee | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly confirmOpen = signal(false);
  readonly deleting = signal(false);

  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatDate;
  readonly formatDateTime = formatDateTime;
  readonly colorForKey = colorForKey;
  readonly initials = initials;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.employeeService.getById(this.id).subscribe({
      next: (emp) => {
        this.employee.set(emp);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  handleDelete(): void {
    this.deleting.set(true);
    this.employeeService.remove(this.id).subscribe({
      next: () => {
        this.toast.success('Employee deleted successfully.');
        this.router.navigate(['/employees']);
      },
      error: (err: ApiError) => {
        this.toast.error(err.message);
        this.deleting.set(false);
        this.confirmOpen.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  editEmployee(): void {
    this.router.navigate(['/employees', this.id, 'edit']);
  }

  get deleteDescription(): string {
    const emp = this.employee();
    return emp
      ? `Are you sure you want to delete ${emp.fullName} (${emp.employeeCode})? This action cannot be undone.`
      : '';
  }
}
