import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from './cart';
import { ShopApi } from './shop-api';
import { UiButton } from './ui/button';
import { UiQtyStepper } from './ui/qty-stepper';
import { Toasts } from './ui/toast';

@Component({
  selector: 'app-cart-page',
  imports: [FormsModule, RouterLink, CurrencyPipe, UiButton, UiQtyStepper],
  styles: `
    .layout { display: grid; grid-template-columns: 1fr 300px; gap: var(--space-5); align-items: start; }
    @media (max-width: 800px) { .layout { grid-template-columns: 1fr; } }
    .summary { display: flex; flex-direction: column; gap: var(--space-3); position: sticky; top: var(--space-4); }
    .total { font-size: var(--font-size-lg); }
    .summary .ui-input { flex: 1; min-width: 0; }
  `,
  template: `
    <div class="page">
      <h1>Your cart</h1>
      <!-- Seeded bug #6: reads the first line even when the cart is empty -->
      <p class="muted">Featured in your cart: {{ cart.lines()[0].product.name }}</p>
      <div class="layout">
        <div class="ui-card">
          <table class="ui-table">
            <tr><th>Item</th><th>Qty</th><th>Price</th><th></th></tr>
            @for (l of cart.lines(); track l.product.id) {
              <tr>
                <td>{{ l.product.emoji }} {{ l.product.name }}</td>
                <td><ui-qty-stepper [value]="l.qty" (changed)="cart.setQty(l.product.id, $event)" /></td>
                <td class="price">{{ l.product.price * l.qty | currency }}</td>
                <td><button uiBtn variant="ghost" size="sm" type="button" (click)="cart.remove(l.product.id)">Remove</button></td>
              </tr>
            }
          </table>
        </div>
        <aside class="ui-card summary">
          <h2>Summary</h2>
          <div class="row row--between"><span>Subtotal</span><span class="price">{{ cart.subtotal() | currency }}</span></div>
          @if (cart.discount() > 0) {
            <div class="row row--between"><span>Discount</span><span class="price">-{{ cart.subtotal() * cart.discount() | currency }}</span></div>
          }
          <div class="row row--between total"><strong>Total</strong><strong class="price">{{ cart.total() | currency }}</strong></div>
          <div class="row">
            <input class="ui-input" [(ngModel)]="code" placeholder="Coupon (try SAVE10)" aria-label="Coupon code" />
            <button uiBtn variant="secondary" type="button" (click)="apply()">Apply</button>
          </div>
          <a uiBtn routerLink="/checkout">Go to checkout</a>
        </aside>
      </div>
    </div>
  `,
})
export class CartPage {
  protected readonly cart = inject(Cart);
  private readonly api = inject(ShopApi);
  private readonly toasts = inject(Toasts);
  protected code = '';

  protected apply() {
    // Seeded bug #3: no error handler; code TILT makes the server return 500.
    this.api.validateCoupon(this.code).subscribe((r) => {
      this.cart.discount.set(r.discount);
      this.toasts.show(`Coupon ${r.code} applied: -${r.discount * 100}%`);
    });
  }
}
