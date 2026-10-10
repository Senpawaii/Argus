import { Component, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Cart } from './cart';
import { Product } from './models';
import { ShopApi } from './shop-api';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe],
  template: `
    @if (product(); as p) {
      <h1>{{ p.emoji }} {{ p.name }}</h1>
      <p>{{ p.price | currency }}</p>
      <!-- Seeded bug #1: Mystery Box (id 13) has no specs -> TypeError during render -->
      <ul>
        <li>Weight: {{ p.specs.weight }}</li>
        <li>Material: {{ p.specs.material }}</li>
      </ul>
      <button type="button" (click)="cart.add(p)">Add to cart</button>
    } @else {
      <p>Loading...</p>
    }
  `,
})
export class ProductDetail {
  protected readonly cart = inject(Cart);
  private readonly api = inject(ShopApi);
  readonly id = input.required<string>(); // bound from the route param
  protected readonly product = signal<Product | null>(null);

  constructor() {
    queueMicrotask(() => this.api.product(Number(this.id())).subscribe((p) => this.product.set(p)));
  }
}
