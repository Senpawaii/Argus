import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Orders } from './orders';
import { UiEmptyState } from './ui/empty-state';

@Component({
  selector: 'app-orders-page',
  imports: [CurrencyPipe, DatePipe, RouterLink, UiEmptyState],
  template: `
    <div class="page">
      <h1>Order history</h1>
      @for (o of orders.list(); track o.id) {
        <a class="ui-card ui-card--interactive row row--between" [routerLink]="['/order', o.id]" style="text-decoration:none;color:inherit">
          <div><strong>{{ o.id }}</strong><div class="muted">{{ o.placedAt | date: 'medium' }} · {{ o.lines.length }} line(s)</div></div>
          <span class="price">{{ o.total | currency }}</span>
        </a>
      } @empty {
        <ui-empty-state icon="📦" title="No orders yet">Orders you place will show up here.</ui-empty-state>
      }
    </div>
  `,
})
export class OrdersPage {
  protected readonly orders = inject(Orders);
}
