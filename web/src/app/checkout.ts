import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Sentry from '@sentry/angular';
import { Cart } from './cart';
import { ShopApi } from './shop-api';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule],
  template: `
    <h1>Checkout</h1>
    <p>Shipping country (try XX):</p>
    <input [(ngModel)]="country" />
    <button type="button" [disabled]="busy()" (click)="pay()">Pay</button>
    @if (orderId()) { <p>✅ Order {{ orderId() }} placed</p> }
  `,
})
export class Checkout {
  private readonly cart = inject(Cart);
  private readonly api = inject(ShopApi);
  protected country = 'PT';
  protected readonly busy = signal(false);
  protected readonly orderId = signal('');

  protected pay() {
    this.busy.set(true);
    // Custom span: appears inside the checkout transaction.
    Sentry.startSpan({ name: 'checkout.submit', op: 'ui.action' }, () => {
      const items = this.cart.lines().map((l) => ({ id: l.product.id, qty: l.qty }));
      // Seeded bugs #4/#5: only the 200 path is handled; 422/409 become unhandled errors
      // and the Pay button stays disabled forever.
      this.api.checkout(items, this.country).subscribe((r) => {
        this.busy.set(false);
        this.orderId.set(r.orderId);
        this.cart.clear();
      });
    });
  }
}
