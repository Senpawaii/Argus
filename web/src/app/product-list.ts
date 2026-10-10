import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { Cart } from './cart';
import { Product } from './models';
import { ShopApi } from './shop-api';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe],
  styles: `
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .card { border: 1px solid #ddd; border-radius: 10px; padding: 1rem; display: flex; flex-direction: column; gap: .4rem; }
    .emoji { font-size: 2.5rem; } .oos { color: #b00020; font-size: .85rem; }
    input { padding: .45rem; width: 260px; }
  `,
  template: `
    <input placeholder="Search potions, staves..." (input)="search$.next($any($event.target).value)" />
    @if (loading()) { <p>Searching...</p> }
    <div class="grid">
      @for (p of products(); track p.id) {
        <div class="card">
          <span class="emoji">{{ p.emoji }}</span>
          <a [routerLink]="['/product', p.id]"><strong>{{ p.name }}</strong></a>
          <span>{{ p.price | currency }}</span>
          @if (p.stock === 0) { <span class="oos">Out of stock</span> }
          <button type="button" (click)="add(p)">Add to cart</button>
        </div>
      }
    </div>
  `,
})
export class ProductList {
  private readonly api = inject(ShopApi);
  private readonly cart = inject(Cart);
  protected readonly products = signal<Omit<Product, 'specs'>[]>([]);
  protected readonly loading = signal(false);
  protected readonly search$ = new Subject<string>();

  constructor() {
    this.api.products().subscribe((p) => this.products.set(p));
    // Seeded bug #2: every keystroke hits the slow search endpoint (~1.75s per query).
    this.search$
      .pipe(switchMap((q) => { this.loading.set(true); return this.api.products(q); }))
      .subscribe((p) => { this.products.set(p); this.loading.set(false); });
  }

  protected add(p: Omit<Product, 'specs'>) {
    // Seeded bug #5: out-of-stock items can be added; /api/checkout rejects them later (409).
    this.cart.add(p as Product);
  }
}
