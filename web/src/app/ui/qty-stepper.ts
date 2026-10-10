import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-qty-stepper',
  template: `
    <button type="button" aria-label="Decrease quantity" (click)="changed.emit(value() - 1)">−</button>
    <span aria-live="polite">{{ value() }}</span>
    <button type="button" aria-label="Increase quantity" (click)="changed.emit(value() + 1)">+</button>
  `,
  styles: `
    :host { display: inline-flex; align-items: center; border: 1px solid var(--color-border); border-radius: var(--radius-pill); background: var(--color-surface); }
    button { border: 0; background: transparent; color: var(--color-text); width: 2rem; height: 2rem; font-size: 1.1rem; cursor: pointer; border-radius: var(--radius-pill); }
    button:hover { background: var(--color-surface-2); }
    span { min-width: 2rem; text-align: center; font-variant-numeric: tabular-nums; font-weight: 600; }
  `,
})
export class UiQtyStepper {
  readonly value = input.required<number>();
  readonly changed = output<number>();
}
