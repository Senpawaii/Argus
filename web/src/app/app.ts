import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import * as Sentry from '@sentry/angular';
import { Cart } from './cart';
import { Theme } from './theme';
import { Wishlist } from './wishlist';
import { UiButton } from './ui/button';
import { UiToastHost } from './ui/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UiButton, UiToastHost],
  styleUrl: './app.scss',
  template: `
    <header>
      <div class="bar">
        <a routerLink="/" class="brand">🔮 Argus Emporium</a>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Shop</a>
          <a routerLink="/wishlist" routerLinkActive="active">♥ Wishlist ({{ wishlist.count() }})</a>
          <a routerLink="/orders" routerLinkActive="active">Orders</a>
          <a routerLink="/cart" routerLinkActive="active">🛒 Cart ({{ cart.count() }})</a>
        </nav>
        <div class="actions">
          <button uiBtn variant="ghost" size="sm" type="button" (click)="theme.toggle()" aria-label="Toggle theme">
            {{ theme.mode() === 'dark' ? '☀️ Light' : '🌙 Dark' }}
          </button>
          <button uiBtn variant="secondary" size="sm" type="button" (click)="toggleUser()">
            {{ loggedIn ? '👤 Merlin · Log out' : 'Log in as Merlin' }}
          </button>
        </div>
      </div>
    </header>
    <main><router-outlet /></main>
    <footer>Argus Emporium · a Sentry playground</footer>
    <ui-toast-host />
  `,
})
export class App {
  protected readonly cart = inject(Cart);
  protected readonly wishlist = inject(Wishlist);
  protected readonly theme = inject(Theme);
  protected loggedIn = false;

  protected toggleUser() {
    this.loggedIn = !this.loggedIn;
    // Attaches user context to every subsequent event/replay.
    Sentry.setUser(this.loggedIn ? { id: 'u_42', username: 'merlin', email: 'merlin@example.com' } : null);
  }
}
