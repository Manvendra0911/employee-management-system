import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (open) {
      <div class="modal-overlay" (mousedown)="onOverlayMouseDown($event)">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div id="confirm-title" class="modal-title">{{ title }}</div>
          <div class="modal-desc">{{ description }}</div>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="cancel.emit()" [disabled]="loading">
              {{ cancelLabel }}
            </button>
            <button
              class="btn"
              [class.btn-danger]="danger"
              [class.btn-primary]="!danger"
              (click)="confirm.emit()"
              [disabled]="loading"
            >
              {{ loading ? 'Please wait…' : confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() description = '';
  @Input() confirmLabel = 'Delete';
  @Input() cancelLabel = 'Cancel';
  @Input() danger = true;
  @Input() loading = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onOverlayMouseDown(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
