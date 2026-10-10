import { Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'ui-badge',
  template: '<ng-content />',
  styles: `
    :host { display: inline-block; padding: 2px var(--space-2); border-radius: var(--radius-pill); font-size: var(--font-size-sm); font-weight: 600; }
    :host(.neutral) { background: var(--color-surface-2); color: var(--color-muted); }
    :host(.primary) { background: var(--color-primary-soft); color: var(--color-primary); }
    :host(.success) { background: var(--color-success-soft); color: var(--color-success); }
    :host(.warning) { background: var(--color-warning-soft); color: var(--color-warning); }
    :host(.danger) { background: var(--color-danger-soft); color: var(--color-danger); }
  `,
  host: { '[class]': 'tone()' },
})
export class UiBadge {
  readonly tone = input<BadgeTone>('neutral');
}
