import { Component, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from './cart';
import { Product } from './models';
import { ShopApi } from './shop-api';
import { Wishlist } from './wishlist';
import { UiBadge } from './ui/badge';
import { UiButton } from './ui/button';
import { Toasts } from './ui/toast';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, UiBadge, UiButton],
  styles: `
    .hero { display: grid; grid-template-columns: 220px 1fr; gap: var(--space-5); align-items: start; }
    .art { font-size: 8rem; text-align: center; background: var(--color-surface-2); border-radius: var(--radius-lg); padding: var(--space-4); }
    dl { display: grid; grid-template-columns: max-content 1fr; gap: var(--space-2) var(--space-4); margin: 0; }
    dt { color: var(--color-muted); } dd { margin: 0; font-weight: 600; }
    @media (max-width: 640px) { .hero { grid-template-columns: 1fr; } }
  `,
  template: `
    <div class="page">
      <a routerLink="/">← Back to shop</a>
      @if (product(); as p) {
        <div class="ui-card hero">
          <div class="art" aria-hidden="true">{{ p.emoji }}</div>
          <div class="stack">
            <ui-badge tone="primary">{{ p.category }}</ui-badge>
            <h1>{{ p.name }}</h1>
            <p class="price">{{ p.price | currency }}</p>
            <!-- Seeded bug #1: Mystery Box (id 13) has no specs -> TypeError during render -->
            <dl>
              <dt>Weight</dt><dd>{{ p.specs.weight }}</dd>
              <dt>Material</dt><dd>{{ p.specs.material }}</dd>
              <dt>Stock</dt><dd>{{ p.stock }}</dd>
            </dl>
            <div class="row">
              <button uiBtn type="button" (click)="add(p)">Add to cart</button>
              <button uiBtn variant="secondary" type="button" (click)="wish(p)">
                {{ wishlist.has(p.id) ? '♥ In wishlist' : '♡ Add to wishlist' }}
              </button>
            </div>
          </div>
        </div>
      } @else {
        <p class="muted">Loading...</p>
      }
    </div>
  `,
})
export class ProductDetail {
  protected readonly wishlist = inject(Wishlist);
  private readonly cart = inject(Cart);
  private readonly api = inject(ShopApi);
  private readonly toasts = inject(Toasts);
  readonly id = input.required<string>(); // bound from the route param
  protected readonly product = signal<Product | null>(null);

  constructor() {
    queueMicrotask(() => this.api.product(Number(this.id())).subscribe((p) => this.product.set(p)));
  }

  protected add(p: Product) {
    this.cart.add(p);
    this.toasts.show(`${p.name} added to cart`);
  }

  protected wish(p: Product) {
    this.wishlist.toggle(p);
  }
}
