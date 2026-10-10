import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./product-list').then((m) => m.ProductList) },
  { path: 'product/:id', loadComponent: () => import('./product-detail').then((m) => m.ProductDetail) },
  { path: 'cart', loadComponent: () => import('./cart-page').then((m) => m.CartPage) },
  { path: 'checkout', loadComponent: () => import('./checkout').then((m) => m.Checkout) },
  { path: '**', redirectTo: '' },
];
