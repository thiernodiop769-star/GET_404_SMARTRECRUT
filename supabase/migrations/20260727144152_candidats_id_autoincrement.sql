/*
# Auto-generate candidats.id

1. Changes
- Create a sequence `candidats_id_seq`.
- Set the default of `candidats.id` to `nextval('candidats_id_seq')` so inserts that omit `id` (e.g. `.insert([{ nom, poste_vise, ... }])`) still get a unique primary key.
- Sync the sequence to the current max(id) so it never collides with existing rows.
2. Security
- No RLS / policy changes.
3. Notes
- The column type stays `integer` (no type change, no data loss).
- Idempotent: uses `IF NOT EXISTS` for the sequence and re-applies the default safely.
*/

CREATE SEQUENCE IF NOT EXISTS candidats_id_seq AS integer;

ALTER TABLE candidats ALTER COLUMN id SET DEFAULT nextval('candidats_id_seq');

DO $$
DECLARE
  max_id integer;
BEGIN
  SELECT COALESCE(MAX(id), 0) INTO max_id FROM candidats;
  PERFORM setval('candidats_id_seq', GREATEST(max_id, 1), (max_id > 0));
END $$;
