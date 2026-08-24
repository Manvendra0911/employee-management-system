import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [NgFor],
  template: `
    <div style="padding: 4px 0">
      <div class="skeleton-row" *ngFor="let i of rowsArray"></div>
    </div>
  `,
})
export class LoadingStateComponent {
  @Input() rows = 5;

  get rowsArray(): number[] {
    return Array.from({ length: this.rows });
  }
}
