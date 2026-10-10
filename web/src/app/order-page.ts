import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Orders } from './orders';
import { UiBadge } from './ui/badge';
import { UiButton } from './ui/button';
import { UiEmptyState } from './ui/empty-state';

@Component({
  selector: 'app-order-page',
  imports: [CurrencyPipe, DatePipe, RouterLink, UiBadge, UiButton, UiEmptyState],
  template: `
    <div class="page">
      @if (order(); as o) {
        <div class="ui-card stack">
          <div class="row row--between"><h1>🎉 Thank you!</h1><ui-badge tone="success">Confirmed</ui-badge></div>
          <p class="muted">Order <strong>{{ o.id }}</strong> · {{ o.placedAt | date: 'medium' }} · shipping to {{ o.country }}</p>
          <table class="ui-table">
            @for (l of o.lines; track l.name) {
              <tr><td>{{ l.emoji }} {{ l.name }}</td><td>×{{ l.qty }}</td><td class="price">{{ l.price * l.qty | currency }}</td></tr>
            }
          </table>
          <div class="row row--between"><strong>Total paid</strong><strong class="price">{{ o.total | currency }}</strong></div>
          <a uiBtn routerLink="/">Keep shopping</a>
        </div>
      } @else {
        <ui-empty-state icon="🔍" title="Order not found">We couldn't find that order on this device.</ui-empty-state>
      }
    </div>
  `,
})
export class OrderPage {
  private readonly orders = inject(Orders);
  readonly id = input.required<string>();
  protected readonly order = computed(() => this.orders.find(this.id()));
}
