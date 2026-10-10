import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import * as Sentry from '@sentry/angular';
import { Cart } from './cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styleUrl: './app.scss',
  template: `
    <header>
      <a routerLink="/" class="brand">🔮 Argus Emporium</a>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Shop</a>
        <a routerLink="/cart" routerLinkActive="active">Cart ({{ cart.count() }})</a>
        <button type="button" (click)="toggleUser()">{{ loggedIn ? 'Log out' : 'Log in as Merlin' }}</button>
      </nav>
    </header>
    <main><router-outlet /></main>
  `,
})
export class App {
  protected readonly cart = inject(Cart);
  protected loggedIn = false;

  protected toggleUser() {
    this.loggedIn = !this.loggedIn;
    // Attaches user context to every subsequent event/replay.
    Sentry.setUser(this.loggedIn ? { id: 'u_42', username: 'merlin', email: 'merlin@example.com' } : null);
  }
}
