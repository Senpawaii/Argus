export interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
  stock: number;
  // Typed as always-present, but the API omits it for some products (seeded bug #1).
  specs: { weight: string; material: string };
}

export interface CartLine {
  product: Product;
  qty: number;
}
