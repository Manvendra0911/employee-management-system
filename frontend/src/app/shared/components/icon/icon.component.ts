import { Component, Input } from '@angular/core';

export type IconName =
  | 'dashboard'
  | 'users'
  | 'building'
  | 'badge'
  | 'search'
  | 'plus'
  | 'edit'
  | 'trash'
  | 'eye'
  | 'menu'
  | 'arrow-left'
  | 'chevron-up-down'
  | 'mail'
  | 'phone'
  | 'calendar'
  | 'cash'
  | 'alert'
  | 'inbox';

/**
 * Lightweight inline SVG icon set - avoids pulling in a full icon library
 * for a handful of glyphs. All icons are 18x18 viewBox 0 0 24 24,
 * stroke-based, inherit currentColor so they pick up theme colors
 * automatically. Direct port of the original React app's components/icons.jsx,
 * collapsed into a single component selected by the `name` input.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      @switch (name) {
        @case ('dashboard') {
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        }
        @case ('users') {
          <circle cx="9" cy="8" r="3.2" />
          <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
          <circle cx="17.2" cy="8.5" r="2.6" />
          <path d="M15.8 14.3c2.7.4 4.7 2.4 4.7 5.7" />
        }
        @case ('building') {
          <rect x="4" y="3" width="12" height="18" rx="1" />
          <path d="M16 8h4v13h-4" />
          <path d="M7.5 7h1M11.5 7h1M7.5 11h1M11.5 11h1M7.5 15h1M11.5 15h1" />
        }
        @case ('badge') {
          <circle cx="12" cy="8" r="5" />
          <path d="M8 12.5 6 21l6-3 6 3-2-8.5" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
        @case ('edit') {
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        }
        @case ('trash') {
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-.9 14a2 2 0 0 1-2 1.9H7.9A2 2 0 0 1 6 20L5 6" />
          <path d="M10 11v6M14 11v6" />
        }
        @case ('eye') {
          <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
          <circle cx="12" cy="12" r="3" />
        }
        @case ('menu') {
          <path d="M3 6h18M3 12h18M3 18h18" />
        }
        @case ('arrow-left') {
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        }
        @case ('chevron-up-down') {
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        }
        @case ('mail') {
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 7 10 6 10-6" />
        }
        @case ('phone') {
          <path
            d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.2L8 9.9a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.2-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.8 2Z"
          />
        }
        @case ('calendar') {
          <rect x="3" y="4.5" width="18" height="16" rx="2" />
          <path d="M16 2.5v4M8 2.5v4M3 9.5h18" />
        }
        @case ('cash') {
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 6v0M18 18v0" />
        }
        @case ('alert') {
          <path
            d="M10.3 3.9 1.8 18a1.8 1.8 0 0 0 1.5 2.7h17.4a1.8 1.8 0 0 0 1.5-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0Z"
          />
          <path d="M12 9v4M12 17h.01" />
        }
        @case ('inbox') {
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.5 5h13l3.5 7v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7Z" />
        }
      }
    </svg>
  `,
})
export class IconComponent {
  @Input() name!: IconName;
  @Input() size = 18;
}
