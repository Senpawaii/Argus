export type Category = 'apparel' | 'consumable' | 'weapon' | 'accessory' | 'misc';

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  emoji: string;
  stock: number;
  // Typed as always-present, but the API omits it for some products (seeded bug #1).
  specs: { weight: string; material: string };
}

export type ProductSummary = Omit<Product, 'specs'>;

export interface CartLine {
  product: Product;
  qty: number;
}

export interface Order {
  id: string;
  placedAt: string;
  country: string;
  total: number;
  lines: { name: string; emoji: string; qty: number; price: number }[];
}
