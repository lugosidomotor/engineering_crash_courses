CREATE SCHEMA IF NOT EXISTS raw;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS ml;

CREATE TABLE IF NOT EXISTS raw.catalog (
  sku TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  rating NUMERIC(3, 2) NOT NULL,
  margin NUMERIC(4, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS raw.orders (
  order_id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  sku TEXT NOT NULL REFERENCES raw.catalog(sku),
  qty INTEGER NOT NULL,
  gross_amount INTEGER NOT NULL,
  city TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  ordered_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS raw.events (
  event_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  sku TEXT,
  ts TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS ml.predictions (
  prediction_id BIGSERIAL PRIMARY KEY,
  customer_id TEXT NOT NULL,
  churn_probability NUMERIC(5, 4) NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO raw.catalog (sku, name, category, brand, price, stock, rating, margin) VALUES
  ('WP-LAP-14', 'Northbyte Ultrabook 14', 'Laptop', 'Northbyte', 429900, 18, 4.7, 0.18),
  ('WP-MON-32', 'PixelForge 32Q monitor', 'Monitor', 'PixelForge', 159900, 34, 4.5, 0.22),
  ('WP-KBD-MX', 'KeyLab MX mechanikus billentyuzet', 'Kiegeszito', 'KeyLab', 38900, 112, 4.8, 0.31),
  ('WP-HUB-C', 'DockFlow USB-C hub', 'Kiegeszito', 'DockFlow', 24900, 61, 4.3, 0.29),
  ('WP-NAS-4B', 'VaultBox 4-bay NAS', 'Storage', 'VaultBox', 219900, 9, 4.6, 0.20),
  ('WP-CAM-4K', 'ClearMeet 4K webkamera', 'Kiegeszito', 'ClearMeet', 52900, 47, 4.4, 0.27)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  margin = EXCLUDED.margin;

INSERT INTO raw.orders (order_id, customer_id, sku, qty, gross_amount, city, channel, status, ordered_at) VALUES
  ('O-10031', 'C-1842', 'WP-LAP-14', 1, 429900, 'Budapest', 'organic', 'paid', '2026-05-06T08:15:12Z'),
  ('O-10032', 'C-1721', 'WP-KBD-MX', 2, 77800, 'Szeged', 'paid_search', 'paid', '2026-05-06T08:18:47Z'),
  ('O-10033', 'C-2034', 'WP-MON-32', 1, 159900, 'Debrecen', 'newsletter', 'paid', '2026-05-06T08:24:03Z'),
  ('O-10034', 'C-1777', 'WP-HUB-C', 1, 24900, 'Pecs', 'organic', 'refunded', '2026-05-06T08:29:51Z'),
  ('O-10035', 'C-1660', 'WP-NAS-4B', 1, 219900, 'Gyor', 'partner', 'paid', '2026-05-06T08:37:19Z'),
  ('O-10036', 'C-2099', 'WP-CAM-4K', 1, 52900, 'Budapest', 'organic', 'paid', '2026-05-06T08:44:02Z'),
  ('O-10037', 'C-1842', 'WP-KBD-MX', 1, 38900, 'Budapest', 'recommendation', 'paid', '2026-05-06T08:51:26Z'),
  ('O-10038', 'C-1988', 'WP-MON-32', 2, 319800, 'Miskolc', 'paid_social', 'paid', '2026-05-06T09:02:41Z')
ON CONFLICT (order_id) DO NOTHING;

INSERT INTO raw.events (event_id, session_id, customer_id, event_type, sku, ts) VALUES
  ('E-9001', 'S-441', 'C-1842', 'product_view', 'WP-LAP-14', '2026-05-06T08:10:15Z'),
  ('E-9002', 'S-441', 'C-1842', 'add_to_cart', 'WP-LAP-14', '2026-05-06T08:12:08Z'),
  ('E-9003', 'S-441', 'C-1842', 'checkout_started', 'WP-LAP-14', '2026-05-06T08:14:44Z'),
  ('E-9004', 'S-442', 'C-1721', 'product_view', 'WP-KBD-MX', '2026-05-06T08:15:29Z'),
  ('E-9005', 'S-442', 'C-1721', 'add_to_cart', 'WP-KBD-MX', '2026-05-06T08:16:10Z'),
  ('E-9006', 'S-443', 'C-2034', 'search', 'WP-MON-32', '2026-05-06T08:20:02Z'),
  ('E-9007', 'S-443', 'C-2034', 'product_view', 'WP-MON-32', '2026-05-06T08:21:11Z'),
  ('E-9008', 'S-444', 'C-2099', 'support_question', 'WP-CAM-4K', '2026-05-06T08:42:33Z')
ON CONFLICT (event_id) DO NOTHING;

CREATE OR REPLACE VIEW analytics.product_performance AS
SELECT
  c.sku,
  c.name,
  c.category,
  c.brand,
  c.stock,
  c.price,
  c.margin,
  COALESCE(SUM(o.gross_amount) FILTER (WHERE o.status = 'paid'), 0) AS paid_revenue,
  COALESCE(SUM(o.qty) FILTER (WHERE o.status = 'paid'), 0) AS paid_units,
  COUNT(DISTINCT e.session_id) FILTER (WHERE e.event_type = 'product_view') AS product_view_sessions
FROM raw.catalog c
LEFT JOIN raw.orders o ON o.sku = c.sku
LEFT JOIN raw.events e ON e.sku = c.sku
GROUP BY c.sku, c.name, c.category, c.brand, c.stock, c.price, c.margin;

CREATE OR REPLACE VIEW analytics.daily_revenue AS
SELECT
  DATE_TRUNC('day', ordered_at)::date AS order_date,
  channel,
  COUNT(*) FILTER (WHERE status = 'paid') AS paid_orders,
  SUM(gross_amount) FILTER (WHERE status = 'paid') AS paid_revenue,
  AVG(gross_amount) FILTER (WHERE status = 'paid') AS avg_order_value
FROM raw.orders
GROUP BY 1, 2;

CREATE OR REPLACE VIEW ml.customer_features AS
SELECT
  o.customer_id,
  COUNT(*) FILTER (WHERE o.status = 'paid') AS paid_order_count,
  COALESCE(SUM(o.gross_amount) FILTER (WHERE o.status = 'paid'), 0) AS lifetime_value,
  COUNT(*) FILTER (WHERE e.event_type = 'support_question') AS support_questions,
  COUNT(*) FILTER (WHERE e.event_type = 'checkout_started') AS checkout_started,
  MAX(o.ordered_at) AS last_order_at
FROM raw.orders o
LEFT JOIN raw.events e ON e.customer_id = o.customer_id
GROUP BY o.customer_id;
