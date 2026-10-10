import { Injectable, computed, signal } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { ProductSummary } from './models';

const KEY = 'argus.wishlist';

@Injectable({ providedIn: 'root' })
export class Wishlist {
  readonly items = signal<ProductSummary[]>(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
  readonly count = computed(() => this.items().length);

  has(id: number) {
    return this.items().some((p) => p.id === id);
  }

  toggle(p: ProductSummary) {
    this.items.update((items) => (this.has(p.id) ? items.filter((i) => i.id !== p.id) : [...items, p]));
    localStorage.setItem(KEY, JSON.stringify(this.items()));
    Sentry.addBreadcrumb({ category: 'wishlist', message: `${this.has(p.id) ? 'Added' : 'Removed'} ${p.name}`, level: 'info' });
  }
}
