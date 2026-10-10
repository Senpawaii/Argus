import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular';
import { Cart } from './cart';
import { Orders } from './orders';
import { ShopApi } from './shop-api';
import { UiButton } from './ui/button';
import { Toasts } from './ui/toast';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CurrencyPipe, UiButton],
  styles: `.form { max-width: 460px; display: flex; flex-direction: column; gap: var(--space-4); } label { display: flex; flex-direction: column; gap: var(--space-1); font-weight: 600; }`,
  template: `
    <div class="page">
      <h1>Checkout</h1>
      <div class="ui-card form">
        <p class="muted">{{ cart.count() }} item(s) · total <strong class="price">{{ cart.total() | currency }}</strong></p>
        <label>Shipping country (try XX)
          <input class="ui-input" [(ngModel)]="country" />
        </label>
        <button uiBtn type="button" [disabled]="busy()" (click)="pay()">{{ busy() ? 'Placing order...' : 'Pay now' }}</button>
      </div>
    </div>
  `,
})
export class Checkout {
  protected readonly cart = inject(Cart);
  private readonly api = inject(ShopApi);
  private readonly orders = inject(Orders);
  private readonly router = inject(Router);
  private readonly toasts = inject(Toasts);
  protected country = 'PT';
  protected readonly busy = signal(false);

  protected pay() {
    this.busy.set(true);
    // Custom span: appears inside the checkout transaction.
    Sentry.startSpan({ name: 'checkout.submit', op: 'ui.action' }, () => {
      const lines = this.cart.lines();
      const total = this.cart.total();
      const items = lines.map((l) => ({ id: l.product.id, qty: l.qty }));
      // Seeded bugs #4/#5: only the 200 path is handled; 422/409 become unhandled errors
      // and the Pay button stays disabled forever.
      this.api.checkout(items, this.country).subscribe((r) => {
        this.busy.set(false);
        this.orders.add({
          id: r.orderId, placedAt: new Date().toISOString(), country: this.country, total,
          lines: lines.map((l) => ({ name: l.product.name, emoji: l.product.emoji, qty: l.qty, price: l.product.price })),
        });
        this.cart.clear();
        this.toasts.show('Order placed!');
        this.router.navigate(['/order', r.orderId]);
      });
    });
  }
}
