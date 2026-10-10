import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { Cart } from './cart';
import { Category, Product, ProductSummary } from './models';
import { ShopApi } from './shop-api';
import { Wishlist } from './wishlist';
import { UiBadge } from './ui/badge';
import { UiButton } from './ui/button';
import { Toasts } from './ui/toast';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe, UiBadge, UiButton],
  styleUrl: './product-list.scss',
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Enchanted goods</h1>
          <p>Hand-picked relics, potions and questionable bargains.</p>
        </div>
        <div class="row">
          <input class="ui-input" placeholder="Search potions, staves..." aria-label="Search" (input)="search$.next($any($event.target).value)" />
          <select class="ui-select" aria-label="Sort" (change)="sort.set($any($event.target).value)">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div class="row" role="group" aria-label="Categories">
        @for (c of categories; track c) {
          <button type="button" class="ui-chip" [attr.aria-pressed]="category() === c" (click)="category.set(c)">{{ c }}</button>
        }
      </div>

      @if (loading()) { <p class="muted">Searching...</p> }

      <div class="grid">
        @for (p of visible(); track p.id) {
          <article class="ui-card ui-card--interactive product">
            <div class="top">
              <ui-badge tone="primary">{{ p.category }}</ui-badge>
              <button uiBtn variant="ghost" size="sm" [icon]="true" type="button"
                [attr.aria-label]="wishlist.has(p.id) ? 'Remove from wishlist' : 'Add to wishlist'" (click)="toggleWish(p)">
                {{ wishlist.has(p.id) ? '♥' : '♡' }}
              </button>
            </div>
            <a [routerLink]="['/product', p.id]" class="emoji" aria-hidden="true">{{ p.emoji }}</a>
            <a [routerLink]="['/product', p.id]" class="name">{{ p.name }}</a>
            <div class="row row--between">
              <span class="price">{{ p.price | currency }}</span>
              @if (p.stock === 0) { <ui-badge tone="danger">Out of stock</ui-badge> }
              @else if (p.stock < 5) { <ui-badge tone="warning">Only {{ p.stock }} left</ui-badge> }
              @else { <ui-badge tone="success">In stock</ui-badge> }
            </div>
            <button uiBtn type="button" (click)="add(p)">Add to cart</button>
          </article>
        } @empty {
          @if (!loading()) { <p class="muted">Nothing matches your filters.</p> }
        }
      </div>
    </div>
  `,
})
export class ProductList {
  private readonly api = inject(ShopApi);
  private readonly cart = inject(Cart);
  private readonly toasts = inject(Toasts);
  protected readonly wishlist = inject(Wishlist);

  protected readonly categories: (Category | 'all')[] = ['all', 'apparel', 'consumable', 'weapon', 'accessory', 'misc'];
  protected readonly products = signal<ProductSummary[]>([]);
  protected readonly loading = signal(false);
  protected readonly category = signal<Category | 'all'>('all');
  protected readonly sort = signal<Sort>('featured');
  protected readonly search$ = new Subject<string>();

  protected readonly visible = computed(() => {
    const c = this.category();
    const list = this.products().filter((p) => c === 'all' || p.category === c);
    switch (this.sort()) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price);
      case 'name': return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default: return list;
    }
  });

  constructor() {
    this.api.products().subscribe((p) => this.products.set(p));
    // Seeded bug #2: every keystroke hits the slow search endpoint (~1.75s per query).
    this.search$
      .pipe(switchMap((q) => { this.loading.set(true); return this.api.products(q); }))
      .subscribe((p) => { this.products.set(p); this.loading.set(false); });
  }

  protected add(p: ProductSummary) {
    // Seeded bug #5: out-of-stock items can be added; /api/checkout rejects them later (409).
    this.cart.add(p as Product);
    this.toasts.show(`${p.name} added to cart`);
  }

  protected toggleWish(p: ProductSummary) {
    this.wishlist.toggle(p);
    this.toasts.show(this.wishlist.has(p.id) ? 'Saved to wishlist' : 'Removed from wishlist', 'info');
  }
}
