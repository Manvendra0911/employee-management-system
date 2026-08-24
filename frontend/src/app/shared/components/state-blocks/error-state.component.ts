import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="state-block">
      <div class="state-title" style="color: var(--color-danger)">{{ title }}</div>
      @if (description) {
        <div class="state-desc">{{ description }}</div>
      }
      @if (showRetry) {
        <button class="btn btn-secondary btn-sm" style="margin-top: 6px" (click)="retry.emit()">
          Try again
        </button>
      }
    </div>
  `,
})
export class ErrorStateComponent {
  @Input() title = 'Something went wrong';
  @Input() description = '';
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();
}
