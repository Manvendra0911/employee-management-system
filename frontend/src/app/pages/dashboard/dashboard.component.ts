import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard-stats.model';
import { ApiError } from '../../core/models/api-error.model';
import { colorForKey, formatCurrency, initials } from '../../core/utils/format.util';
import { LoadingStateComponent } from '../../shared/components/state-blocks/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/state-blocks/error-state.component';
import { EmptyStateComponent } from '../../shared/components/state-blocks/empty-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LoadingStateComponent, ErrorStateComponent, EmptyStateComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  readonly stats = signal<DashboardStats | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly formatCurrency = formatCurrency;
  readonly colorForKey = colorForKey;
  readonly initials = initials;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  addEmployee(): void {
    this.router.navigate(['/employees/new']);
  }

  departmentEntries(): [string, number][] {
    const data = this.stats()?.employeesByDepartment || {};
    return Object.entries(data);
  }

  maxDepartmentCount(): number {
    const values = this.departmentEntries().map(([, v]) => v);
    return Math.max(...values, 1);
  }
}
