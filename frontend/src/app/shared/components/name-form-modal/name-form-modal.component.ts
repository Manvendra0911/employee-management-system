import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export interface NameFormInitialValues {
  name: string;
  description: string | null;
}

export interface NameFormSubmitValue {
  name: string;
  description: string;
}

/**
 * Small reusable "name + description" modal used by both the
 * Departments and Roles pages for create/edit. Direct port of the
 * original React app's components/NameFormModal.jsx.
 */
@Component({
  selector: 'app-name-form-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (open) {
      <div class="modal-overlay" (mousedown)="onOverlayMouseDown($event)">
        <div class="modal-box" role="dialog" aria-modal="true">
          <div class="modal-title">{{ title }}</div>
          <form (ngSubmit)="handleSubmit()">
            <div class="field" style="margin-bottom: 14px">
              <label>{{ nameLabel }} <span class="required">*</span></label>
              <input
                name="name"
                [(ngModel)]="name"
                [class.has-error]="error"
                autofocus
              />
              @if (error) {
                <div class="field-error">{{ error }}</div>
              }
            </div>
            <div class="field" style="margin-bottom: 6px">
              <label>Description</label>
              <input name="description" [(ngModel)]="description" placeholder="Optional" />
            </div>
            <div class="modal-actions" style="margin-top: 18px">
              <button type="button" class="btn btn-secondary" (click)="cancel.emit()" [disabled]="submitting">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="submitting">
                {{ submitting ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class NameFormModalComponent implements OnChanges {
  @Input() open = false;
  @Input() title = '';
  @Input() nameLabel = 'Name';
  @Input() initialValues: NameFormInitialValues | null = null;
  @Input() submitting = false;
  @Output() submit = new EventEmitter<NameFormSubmitValue>();
  @Output() cancel = new EventEmitter<void>();

  name = '';
  description = '';
  error = '';

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['open'] || changes['initialValues']) && this.open) {
      this.name = this.initialValues?.name || '';
      this.description = this.initialValues?.description || '';
      this.error = '';
    }
  }

  handleSubmit(): void {
    if (!this.name.trim()) {
      this.error = `${this.nameLabel} is required`;
      return;
    }
    this.submit.emit({ name: this.name.trim(), description: this.description.trim() });
  }

  onOverlayMouseDown(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
