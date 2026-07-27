/*
# Create candidats table (single-tenant, no auth)

1. New Tables
- `candidats`
  - `id` (int, primary key)
  - `nom` (text, not null) — candidate full name
  - `poste_vise` (text, not null) — targeted role/position
  - `competences` (text[], default '{}') — list of skills
  - `score_match` (int, default 0) — match score percentage (0-100)
  - `statut` (text, default 'À trier') — status: 'À trier', 'Retenu', or 'Refusé'
  - `recu_il_y_a` (int, default 0) — hours ago the CV was received
  - `avatar_color` (text) — tailwind gradient classes for avatar
  - `cree_le` (timestamptz, default now())
2. Security
- Enable RLS on `candidats`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in screen).
3. Seed data
- Insert the 6 existing candidates from the hardcoded list so the page is not empty on first load.
*/

CREATE TABLE IF NOT EXISTS candidats (
  id integer PRIMARY KEY,
  nom text NOT NULL,
  poste_vise text NOT NULL,
  competences text[] DEFAULT '{}'::text[],
  score_match integer DEFAULT 0,
  statut text DEFAULT 'À trier',
  recu_il_y_a integer DEFAULT 0,
  avatar_color text DEFAULT 'from-corporate-700 to-corporate-500',
  cree_le timestamptz DEFAULT now()
);

ALTER TABLE candidats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_candidats" ON candidats;
CREATE POLICY "anon_select_candidats" ON candidats FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_candidats" ON candidats;
CREATE POLICY "anon_insert_candidats" ON candidats FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_candidats" ON candidats;
CREATE POLICY "anon_update_candidats" ON candidats FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_candidats" ON candidats;
CREATE POLICY "anon_delete_candidats" ON candidats FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO candidats (id, nom, poste_vise, competences, score_match, statut, recu_il_y_a, avatar_color) VALUES
  (1, 'Amina Diallo', 'Data Scientist', ARRAY['Python','SQL','Machine Learning'], 95, 'À trier', 5, 'from-corporate-700 to-corporate-500'),
  (2, 'Ousmane Ba', 'Développeur Fullstack', ARRAY['React','Node.js','MongoDB'], 82, 'Retenu', 30, 'from-accent-500 to-accent-400'),
  (3, 'Fatou Sow', 'Chef de Projet IT', ARRAY['Agile','Jira','Scrum'], 65, 'À trier', 8, 'from-emerald-600 to-emerald-400'),
  (4, 'Ibrahima Ndiaye', 'Data Analyst', ARRAY['Excel','PowerBI','SQL'], 40, 'Refusé', 52, 'from-rose-600 to-rose-400'),
  (5, 'Marie Vasseur', 'UX Designer', ARRAY['Figma','Research','Prototyping'], 20, 'Refusé', 70, 'from-violet-600 to-violet-400'),
  (6, 'Cheikh Mbaye', 'DevOps Engineer', ARRAY['Docker','Kubernetes','AWS'], 88, 'Retenu', 3, 'from-sky-700 to-sky-500')
ON CONFLICT (id) DO NOTHING;
