import { Injectable, computed, signal } from '@angular/core';
import * as Sentry from '@sentry/angular';
import { CartLine, Product } from './models';

@Injectable({ providedIn: 'root' })
export class Cart {
  readonly lines = signal<CartLine[]>([]);
  readonly discount = signal(0);
  readonly count = computed(() => this.lines().reduce((n, l) => n + l.qty, 0));
  readonly subtotal = computed(() => this.lines().reduce((s, l) => s + l.product.price * l.qty, 0));
  readonly total = computed(() => this.subtotal() * (1 - this.discount()));

  add(product: Product) {
    this.lines.update((ls) => {
      const existing = ls.find((l) => l.product.id === product.id);
      return existing
        ? ls.map((l) => (l === existing ? { ...l, qty: l.qty + 1 } : l))
        : [...ls, { product, qty: 1 }];
    });
    // Breadcrumbs show up on any error captured afterwards.
    Sentry.addBreadcrumb({ category: 'cart', message: `Added ${product.name}`, level: 'info' });
  }

  remove(id: number) {
    this.lines.update((ls) => ls.filter((l) => l.product.id !== id));
  }

  clear() {
    this.lines.set([]);
    this.discount.set(0);
  }
}
