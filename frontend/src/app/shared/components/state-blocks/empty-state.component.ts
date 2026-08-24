import { Component, Input } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="state-block">
      @if (icon) {
        <div class="state-icon"><app-icon [name]="icon" /></div>
      }
      <div class="state-title">{{ title }}</div>
      @if (description) {
        <div class="state-desc">{{ description }}</div>
      }
      <ng-content></ng-content>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon: IconName | null = null;
  @Input() title = '';
  @Input() description = '';
}
