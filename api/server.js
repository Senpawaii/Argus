import express from 'express';
import * as Sentry from '@sentry/node';

const app = express();
app.use(express.json());

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const products = [
  { id: 1, name: 'Cloak of Mild Annoyance', price: 49.9, emoji: '🧥', stock: 12, specs: { weight: '1.2kg', material: 'wool' } },
  { id: 2, name: 'Potion of Minor Healing', price: 9.5, emoji: '🧪', stock: 80, specs: { weight: '0.3kg', material: 'glass' } },
  { id: 3, name: 'Staff of Moderate Gusts', price: 129, emoji: '🪄', stock: 3, specs: { weight: '2.1kg', material: 'oak' } },
  { id: 4, name: 'Boots of Slightly Faster', price: 74.25, emoji: '🥾', stock: 0, specs: { weight: '1.5kg', material: 'leather' } },
  { id: 5, name: 'Amulet of Vague Luck', price: 33, emoji: '📿', stock: 21, specs: { weight: '0.1kg', material: 'silver' } },
  { id: 6, name: 'Scroll of Eventual Fire', price: 18, emoji: '📜', stock: 40, specs: { weight: '0.05kg', material: 'paper' } },
  // Seeded bug #1: no `specs` -> the product page dereferences it and throws.
  { id: 13, name: 'Mystery Box', price: 99, emoji: '🎁', stock: 5 },
];

app.get('/api/products', async (req, res) => {
  const q = String(req.query.q ?? '').toLowerCase();
  // Seeded bug #2: searching is slow (one span per "row", sequential)
  if (q) {
    for (const _ of products) {
      await Sentry.startSpan({ name: 'db.scan_product', op: 'db' }, () => sleep(250));
    }
  }
  res.json(products.filter((p) => p.name.toLowerCase().includes(q)).map(({ specs, ...p }) => p));
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

const COUPONS = { SAVE10: 0.1, WIZARD20: 0.2 };

app.post('/api/coupons/validate', (req, res) => {
  const code = String(req.body?.code ?? '').toUpperCase();
  // Seeded bug #3: TILT throws on the server (500) -> frontend + backend trace.
  if (code === 'TILT') throw new Error('Coupon service exploded on code TILT');
  if (!(code in COUPONS)) return res.status(404).json({ error: 'Unknown coupon' });
  res.json({ code, discount: COUPONS[code] });
});

app.post('/api/checkout', async (req, res) => {
  const { items = [], country } = req.body ?? {};
  await sleep(400);
  // Seeded bug #4: unsupported country -> 422 that the frontend does not handle.
  if (country === 'XX') return res.status(422).json({ error: 'Cannot ship to XX' });
  // Seeded bug #5: out-of-stock items are accepted by UI, rejected here.
  const oos = items.find((i) => (products.find((p) => p.id === i.id)?.stock ?? 0) === 0);
  if (oos) return res.status(409).json({ error: `Out of stock: ${oos.id}` });
  res.json({ orderId: `ARG-${Date.now()}` });
});

Sentry.setupExpressErrorHandler(app);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`argus-api listening on :${port}`));
