import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-container" role="status" aria-live="polite">
      @for (t of toastService.toasts(); track t.id) {
        <div class="toast toast-{{ t.type }}" (click)="toastService.dismiss(t.id)">
          {{ t.message }}
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
