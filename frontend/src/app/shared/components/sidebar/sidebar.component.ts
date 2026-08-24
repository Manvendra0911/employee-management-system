import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, IconName } from '../icon/icon.component';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/employees', label: 'Employees', icon: 'users' },
  { to: '/departments', label: 'Departments', icon: 'building' },
  { to: '/roles', label: 'Roles', icon: 'badge' },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    @if (open) {
      <div class="sidebar-overlay" (click)="close.emit()"></div>
    }
    <aside class="sidebar" [class.open]="open">
      <div class="sidebar-brand">
        <div class="sidebar-brand-mark">PD</div>
        <div class="sidebar-brand-text">
          <strong>PeopleDesk</strong>
          <span>Employee Management</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-section-label">Workspace</div>
        @for (item of navItems; track item.to) {
          <a
            [routerLink]="item.to"
            routerLinkActive="active"
            class="sidebar-link"
            (click)="close.emit()"
          >
            <app-icon [name]="item.icon" />
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="sidebar-footer">Internal HR Tool · v1.0</div>
    </aside>
  `,
})
export class SidebarComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  readonly navItems = NAV_ITEMS;
}
