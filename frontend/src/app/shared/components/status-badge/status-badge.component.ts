import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge" [class.badge-active]="isActive" [class.badge-inactive]="!isActive">
      <span class="badge-dot"></span>
      {{ isActive ? 'Active' : 'Inactive' }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() status: string | null = null;

  get isActive(): boolean {
    return this.status === 'ACTIVE';
  }
}
