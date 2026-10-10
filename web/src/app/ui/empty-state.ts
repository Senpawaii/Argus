import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-empty-state',
  template: `
    <div class="icon">{{ icon() }}</div>
    <h2>{{ title() }}</h2>
    <p class="muted"><ng-content /></p>
  `,
  styles: `
    :host { display: block; text-align: center; padding: var(--space-6) var(--space-4); background: var(--color-surface);
      border: 2px dashed var(--color-border); border-radius: var(--radius-lg); }
    .icon { font-size: 3rem; }
  `,
})
export class UiEmptyState {
  readonly icon = input('📭');
  readonly title = input.required<string>();
}
