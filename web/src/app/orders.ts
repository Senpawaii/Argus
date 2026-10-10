import { Injectable, signal } from '@angular/core';
import { Order } from './models';

const KEY = 'argus.orders';

@Injectable({ providedIn: 'root' })
export class Orders {
  readonly list = signal<Order[]>(JSON.parse(localStorage.getItem(KEY) ?? '[]'));

  add(order: Order) {
    this.list.update((l) => [order, ...l]);
    localStorage.setItem(KEY, JSON.stringify(this.list()));
  }

  find(id: string) {
    return this.list().find((o) => o.id === id);
  }
}
