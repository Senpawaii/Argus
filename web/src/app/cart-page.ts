import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from './cart';
import { ShopApi } from './shop-api';

@Component({
  selector: 'app-cart-page',
  imports: [FormsModule, RouterLink, CurrencyPipe],
  styles: `table { width: 100%; border-collapse: collapse; } td, th { padding: .5rem; border-bottom: 1px solid #eee; text-align: left; }`,
  template: `
    <h1>Your cart</h1>
    <!-- Seeded bug #6: reads the first line even when the cart is empty -->
    <p>Featured: {{ cart.lines()[0].product.name }}</p>
    <table>
      <tr><th>Item</th><th>Qty</th><th>Price</th><th></th></tr>
      @for (l of cart.lines(); track l.product.id) {
        <tr>
          <td>{{ l.product.emoji }} {{ l.product.name }}</td>
          <td>{{ l.qty }}</td>
          <td>{{ l.product.price * l.qty | currency }}</td>
          <td><button type="button" (click)="cart.remove(l.product.id)">Remove</button></td>
        </tr>
      }
    </table>
    <p>
      <input [(ngModel)]="code" placeholder="Coupon (try SAVE10)" />
      <button type="button" (click)="apply()">Apply</button>
      <span>{{ message() }}</span>
    </p>
    <h2>Total: {{ cart.total() | currency }}</h2>
    <a routerLink="/checkout">Go to checkout</a>
  `,
})
export class CartPage {
  protected readonly cart = inject(Cart);
  private readonly api = inject(ShopApi);
  protected code = '';
  protected readonly message = signal('');

  protected apply() {
    // Seeded bug #3: no error handler; code TILT makes the server return 500.
    this.api.validateCoupon(this.code).subscribe((r) => {
      this.cart.discount.set(r.discount);
      this.message.set(`${r.code} applied (-${r.discount * 100}%)`);
    });
  }
}
