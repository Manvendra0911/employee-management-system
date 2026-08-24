import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [IconComponent],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <button class="menu-toggle" (click)="menuClick.emit()" aria-label="Toggle navigation">
          <app-icon name="menu" />
        </button>
        <div class="topbar-title">{{ title }}</div>
      </div>

      <div class="topbar-right">
        <div class="topbar-user">
          <div class="topbar-user-avatar">HR</div>
          <div class="topbar-user-info">
            <strong>HR Admin</strong>
            <span>PeopleDesk Workspace</span>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Input() title = '';
  @Output() menuClick = new EventEmitter<void>();
}
