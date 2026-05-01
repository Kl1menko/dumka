-- DUMKA: mass-fill products.product_type for empty rows
-- Safe workflow for Supabase SQL Editor

-- =====================================================
-- 0) PRE-CHECKS
-- =====================================================
-- How many rows need fill?
SELECT COUNT(*) AS empty_product_type_count
FROM products
WHERE COALESCE(BTRIM(product_type), '') = '';

-- Inspect candidate rows before update
SELECT id, handle, title, tags
FROM products
WHERE COALESCE(BTRIM(product_type), '') = ''
ORDER BY sort_order, title
LIMIT 200;

-- =====================================================
-- 1) ONE-TIME BACKUP SNAPSHOT (for rollback)
-- =====================================================
CREATE TABLE IF NOT EXISTS products_product_type_backup_2026_05_01 AS
SELECT id, product_type, updated_at
FROM products;

-- =====================================================
-- 2) PREVIEW MAPPING (NO DATA CHANGES)
-- =====================================================
WITH candidates AS (
  SELECT
    p.id,
    p.handle,
    p.title,
    p.tags,
    LOWER(
      CONCAT_WS(' ', COALESCE(p.product_type, ''), COALESCE(p.handle, ''), COALESCE(p.title, ''), COALESCE(array_to_string(p.tags, ' '), ''))
    ) AS haystack
  FROM products p
  WHERE COALESCE(BTRIM(p.product_type), '') = ''
), mapped AS (
  SELECT
    c.*,
    CASE
      WHEN c.haystack ~ '(dress|dresses|сукн)' THEN 'dresses'
      WHEN c.haystack ~ '(suit|suits|костюм)' THEN 'suits'
      WHEN c.haystack ~ '(blouse|blouses|блуз)' THEN 'blouses'
      WHEN c.haystack ~ '(evening|вечірн)' THEN 'evening'
      WHEN c.haystack ~ '(vest|vests|жилет)' THEN 'vests'
      WHEN c.haystack ~ '(top|tops|топ)' THEN 'tops'
      WHEN c.haystack ~ '(short|shorts|шорт)' THEN 'shorts'
      WHEN c.haystack ~ '(jumpsuit|jumpsuits|комбінезон)' THEN 'jumpsuits'
      WHEN c.haystack ~ '(accessory|accessories|аксесуар)' THEN 'accessories'
      WHEN c.haystack ~ '(gift|gifts|подарунк)' THEN 'gifts'
      ELSE 'other'
    END AS suggested_product_type
  FROM candidates c
)
SELECT suggested_product_type, COUNT(*) AS cnt
FROM mapped
GROUP BY suggested_product_type
ORDER BY cnt DESC;

-- Optional: review exact assignments before applying
WITH candidates AS (
  SELECT
    p.id,
    p.handle,
    p.title,
    p.tags,
    LOWER(
      CONCAT_WS(' ', COALESCE(p.product_type, ''), COALESCE(p.handle, ''), COALESCE(p.title, ''), COALESCE(array_to_string(p.tags, ' '), ''))
    ) AS haystack
  FROM products p
  WHERE COALESCE(BTRIM(p.product_type), '') = ''
), mapped AS (
  SELECT
    c.id,
    c.handle,
    c.title,
    CASE
      WHEN c.haystack ~ '(dress|dresses|сукн)' THEN 'dresses'
      WHEN c.haystack ~ '(suit|suits|костюм)' THEN 'suits'
      WHEN c.haystack ~ '(blouse|blouses|блуз)' THEN 'blouses'
      WHEN c.haystack ~ '(evening|вечірн)' THEN 'evening'
      WHEN c.haystack ~ '(vest|vests|жилет)' THEN 'vests'
      WHEN c.haystack ~ '(top|tops|топ)' THEN 'tops'
      WHEN c.haystack ~ '(short|shorts|шорт)' THEN 'shorts'
      WHEN c.haystack ~ '(jumpsuit|jumpsuits|комбінезон)' THEN 'jumpsuits'
      WHEN c.haystack ~ '(accessory|accessories|аксесуар)' THEN 'accessories'
      WHEN c.haystack ~ '(gift|gifts|подарунк)' THEN 'gifts'
      ELSE 'other'
    END AS suggested_product_type
  FROM candidates c
)
SELECT *
FROM mapped
ORDER BY suggested_product_type, title
LIMIT 500;

-- =====================================================
-- 3) APPLY UPDATE (only after preview looks correct)
-- =====================================================
WITH candidates AS (
  SELECT
    p.id,
    LOWER(
      CONCAT_WS(' ', COALESCE(p.product_type, ''), COALESCE(p.handle, ''), COALESCE(p.title, ''), COALESCE(array_to_string(p.tags, ' '), ''))
    ) AS haystack
  FROM products p
  WHERE COALESCE(BTRIM(p.product_type), '') = ''
), mapped AS (
  SELECT
    c.id,
    CASE
      WHEN c.haystack ~ '(dress|dresses|сукн)' THEN 'dresses'
      WHEN c.haystack ~ '(suit|suits|костюм)' THEN 'suits'
      WHEN c.haystack ~ '(blouse|blouses|блуз)' THEN 'blouses'
      WHEN c.haystack ~ '(evening|вечірн)' THEN 'evening'
      WHEN c.haystack ~ '(vest|vests|жилет)' THEN 'vests'
      WHEN c.haystack ~ '(top|tops|топ)' THEN 'tops'
      WHEN c.haystack ~ '(short|shorts|шорт)' THEN 'shorts'
      WHEN c.haystack ~ '(jumpsuit|jumpsuits|комбінезон)' THEN 'jumpsuits'
      WHEN c.haystack ~ '(accessory|accessories|аксесуар)' THEN 'accessories'
      WHEN c.haystack ~ '(gift|gifts|подарунк)' THEN 'gifts'
      ELSE 'other'
    END AS product_type_new
  FROM candidates c
)
UPDATE products p
SET product_type = m.product_type_new
FROM mapped m
WHERE p.id = m.id
  AND COALESCE(BTRIM(p.product_type), '') = '';

-- =====================================================
-- 4) POST-CHECKS
-- =====================================================
-- Any empty product_type left?
SELECT COUNT(*) AS empty_after_update
FROM products
WHERE COALESCE(BTRIM(product_type), '') = '';

-- Distribution after update
SELECT product_type, COUNT(*) AS cnt
FROM products
GROUP BY product_type
ORDER BY cnt DESC;

-- =====================================================
-- 5) ROLLBACK (run only if needed)
-- =====================================================
-- UPDATE products p
-- SET product_type = b.product_type
-- FROM products_product_type_backup_2026_05_01 b
-- WHERE p.id = b.id;
