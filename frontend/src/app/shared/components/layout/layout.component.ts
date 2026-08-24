import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { ToastContainerComponent } from '../toast-container/toast-container.component';

/**
 * Shell layout wrapping every routed page: sidebar + topbar + content
 * outlet. Equivalent of the original React app's components/Layout.jsx,
 * with the page title now driven by route `data.title` (set per-route in
 * app.routes.ts) instead of the TITLES map + PageShell wrapper used in
 * React Router.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastContainerComponent],
  template: `
    <div class="app-shell">
      <app-sidebar [open]="sidebarOpen()" (close)="sidebarOpen.set(false)" />
      <div class="main-area">
        <app-topbar [title]="pageTitle() ?? ''" (menuClick)="sidebarOpen.update((o) => !o)" />
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
    <app-toast-container />
  `,
})
export class LayoutComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly sidebarOpen = signal(false);

  private readonly pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.deepestTitle(this.route))
  );

  readonly pageTitle = toSignal(this.pageTitle$, { initialValue: undefined });

  private deepestTitle(route: ActivatedRoute): string | undefined {
    let current = route;
    let title: string | undefined = current.snapshot.data['title'];
    while (current.firstChild) {
      current = current.firstChild;
      title = current.snapshot.data['title'] ?? title;
    }
    return title;
  }
}
