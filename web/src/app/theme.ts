import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Theme {
  readonly mode = signal<'light' | 'dark'>(
    (localStorage.getItem('argus.theme') as 'light' | 'dark' | null) ??
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  );

  constructor() {
    effect(() => {
      document.documentElement.dataset['theme'] = this.mode();
      localStorage.setItem('argus.theme', this.mode());
    });
  }

  toggle() {
    this.mode.update((m) => (m === 'dark' ? 'light' : 'dark'));
  }
}
