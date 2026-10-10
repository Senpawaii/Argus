import { Component, Injectable, inject, signal } from '@angular/core';

export type ToastTone = 'success' | 'info' | 'danger';
interface ToastMessage { id: number; text: string; tone: ToastTone; }

@Injectable({ providedIn: 'root' })
export class Toasts {
  readonly messages = signal<ToastMessage[]>([]);
  private nextId = 1;

  show(text: string, tone: ToastTone = 'success', ms = 3500) {
    const id = this.nextId++;
    this.messages.update((m) => [...m, { id, text, tone }]);
    setTimeout(() => this.dismiss(id), ms);
  }
  dismiss(id: number) {
    this.messages.update((m) => m.filter((t) => t.id !== id));
  }
}

@Component({
  selector: 'ui-toast-host',
  template: `
    @for (t of toasts.messages(); track t.id) {
      <div class="toast" [class]="t.tone" role="status">
        <span>{{ t.text }}</span>
        <button type="button" aria-label="Dismiss" (click)="toasts.dismiss(t.id)">×</button>
      </div>
    }
  `,
  styles: `
    :host { position: fixed; top: var(--space-4); right: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); z-index: 1000; }
    .toast { display: flex; gap: var(--space-3); align-items: center; justify-content: space-between; min-width: 240px; padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md); background: var(--color-surface); border-left: 4px solid var(--color-primary); box-shadow: var(--shadow-2); }
    .toast.success { border-left-color: var(--color-success); }
    .toast.danger { border-left-color: var(--color-danger); }
    button { border: 0; background: transparent; color: var(--color-muted); font-size: 1.2rem; cursor: pointer; }
  `,
})
export class UiToastHost {
  protected readonly toasts = inject(Toasts);
}
