import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from './cart';
import { Product, ProductSummary } from './models';
import { Wishlist } from './wishlist';
import { UiButton } from './ui/button';
import { UiEmptyState } from './ui/empty-state';
import { Toasts } from './ui/toast';

@Component({
  selector: 'app-wishlist-page',
  imports: [CurrencyPipe, RouterLink, UiButton, UiEmptyState],
  template: `
    <div class="page">
      <h1>Your wishlist</h1>
      @for (p of wishlist.items(); track p.id) {
        <div class="ui-card row row--between">
          <div class="row"><span style="font-size:2rem">{{ p.emoji }}</span>
            <a [routerLink]="['/product', p.id]"><strong>{{ p.name }}</strong></a></div>
          <div class="row">
            <span class="price">{{ p.price | currency }}</span>
            <button uiBtn size="sm" type="button" (click)="add(p)">Add to cart</button>
            <button uiBtn variant="ghost" size="sm" type="button" (click)="wishlist.toggle(p)">Remove</button>
          </div>
        </div>
      } @empty {
        <ui-empty-state icon="♡" title="Nothing saved yet">Tap the heart on any product to keep it for later.</ui-empty-state>
      }
    </div>
  `,
})
export class WishlistPage {
  protected readonly wishlist = inject(Wishlist);
  private readonly cart = inject(Cart);
  private readonly toasts = inject(Toasts);

  protected add(p: ProductSummary) {
    this.cart.add(p as Product);
    this.toasts.show(`${p.name} added to cart`);
  }
}
