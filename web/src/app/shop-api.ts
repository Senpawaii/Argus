import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from './models';

@Injectable({ providedIn: 'root' })
export class ShopApi {
  private readonly http = inject(HttpClient);

  products(q = '') {
    return this.http.get<Omit<Product, 'specs'>[]>('/api/products', { params: q ? { q } : {} });
  }
  product(id: number) {
    return this.http.get<Product>(`/api/products/${id}`);
  }
  validateCoupon(code: string) {
    return this.http.post<{ code: string; discount: number }>('/api/coupons/validate', { code });
  }
  checkout(items: { id: number; qty: number }[], country: string) {
    return this.http.post<{ orderId: string }>('/api/checkout', { items, country });
  }
}
