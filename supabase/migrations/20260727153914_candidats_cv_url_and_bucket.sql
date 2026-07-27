/*
# Add cv_url column + cvs storage bucket

1. Schema changes
- Add `cv_url` (text, nullable) to `candidats` to store the public URL of an uploaded CV PDF.
2. Storage
- Create a public bucket named `cvs` for storing CV PDFs (insert into storage.buckets).
3. Security
- No RLS / policy changes on `candidats` (existing anon CRUD policies already cover inserts with cv_url).
- Bucket is created as public so the uploaded PDF can be read via its public URL.
4. Notes
- Idempotent: column added only if missing; bucket insert uses ON CONFLICT to avoid duplicates.
*/

ALTER TABLE candidats ADD COLUMN IF NOT EXISTS cv_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;
