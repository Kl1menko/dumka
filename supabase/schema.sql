-- =====================================================
-- DUMKA — Supabase schema
-- Run this once in Supabase SQL editor
-- =====================================================

-- Products
CREATE TABLE IF NOT EXISTS products (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  handle       text          UNIQUE NOT NULL,
  title        text          NOT NULL,
  body_html    text          NOT NULL DEFAULT '',
  body_html_en text          NOT NULL DEFAULT '',
  images       text[]        NOT NULL DEFAULT '{}',
  product_type text          NOT NULL DEFAULT '',
  tags         text[]        NOT NULL DEFAULT '{}',
  sort_order   integer       NOT NULL DEFAULT 0,
  published    boolean       NOT NULL DEFAULT true,
  created_at   timestamptz   NOT NULL DEFAULT now(),
  updated_at   timestamptz   NOT NULL DEFAULT now()
);

-- Product variants
CREATE TABLE IF NOT EXISTS product_variants (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  shopify_id  text,
  title       text          NOT NULL DEFAULT '',
  price_uah   numeric(10,2) NOT NULL DEFAULT 0,
  size        text          NOT NULL DEFAULT '',
  color       text          NOT NULL DEFAULT '',
  available   boolean       NOT NULL DEFAULT true,
  sort_order  integer       NOT NULL DEFAULT 0,
  created_at  timestamptz   NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_handle      ON products(handle);
CREATE INDEX IF NOT EXISTS idx_products_sort_order  ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_published   ON products(published);
CREATE INDEX IF NOT EXISTS idx_variants_product_id  ON product_variants(product_id);

-- Auto-update updated_at on products
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- Row-Level Security
-- =====================================================
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public (anon) can only read published products
CREATE POLICY "anon_read_products"
  ON products FOR SELECT
  USING (published = true);

-- Public can read all variants (availability is on the variant row)
CREATE POLICY "anon_read_variants"
  ON product_variants FOR SELECT
  USING (true);

-- Authenticated users (admin) can do everything
-- Note: service_role key bypasses RLS entirely, so these policies
-- apply only when using the anon key with a signed-in user session.
CREATE POLICY "auth_all_products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_all_variants"
  ON product_variants FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
