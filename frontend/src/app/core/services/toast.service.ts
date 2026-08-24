import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/**
 * App-wide toast/snackbar notifications, backed by a signal so the
 * standalone ToastContainerComponent can render reactively without any
 * manual subscription wiring. Equivalent of the original React app's
 * hooks/useToast.jsx (ToastProvider + useToast).
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private idCounter = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly toasts = signal<Toast[]>([]);

  success(message: string, duration = 3500): void {
    this.push(message, 'success', duration);
  }

  error(message: string, duration = 3500): void {
    this.push(message, 'error', duration);
  }

  info(message: string, duration = 3500): void {
    this.push(message, 'info', duration);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private push(message: string, type: ToastType, duration: number): void {
    const id = ++this.idCounter;
    this.toasts.update((list) => [...list, { id, message, type }]);
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), duration)
    );
  }
}
