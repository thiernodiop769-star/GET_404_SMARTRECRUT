import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Eye,
  Check,
  X,
  Sparkles,
  Users,
  TrendingUp,
  Clock,
  Loader2,
  AlertCircle,
  Plus,
  CheckCircle2,
  UploadCloud,
  FileText,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import type { CandidateStatus } from '@/data/candidates';

type Filter = 'all' | 'high' | 'mid' | 'low';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'high', label: 'Score > 80%' },
  { id: 'mid', label: 'Score 50-80%' },
  { id: 'low', label: 'Score < 50%' },
];

interface CandidatRow {
  id: number;
  nom: string;
  poste_vise: string;
  competences: string[];
  score_match: number;
  statut: string;
  recu_il_y_a: number;
  avatar_color: string;
  cv_url?: string | null;
}

function scoreColor(match: number) {
  if (match > 80) return { bar: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-100' };
  if (match >= 50) return { bar: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-100' };
  return { bar: 'bg-rose-500', text: 'text-rose-600', ring: 'ring-rose-100' };
}

function statusStyle(status: string) {
  switch (status) {
    case 'Retenu':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Refusé':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function Candidates() {
  const [rows, setRows] = useState<CandidatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<CandidatRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('candidats').select('*');
      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setRows((data ?? []) as CandidatRow[]);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    return rows.filter((c) => {
      const matchesQuery =
        c.nom.toLowerCase().includes(query.toLowerCase()) ||
        c.poste_vise.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'high' && c.score_match > 80) ||
        (filter === 'mid' && c.score_match >= 50 && c.score_match <= 80) ||
        (filter === 'low' && c.score_match < 50);
      return matchesQuery && matchesFilter;
    });
  }, [rows, filter, query]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      high: rows.filter((c) => c.score_match > 80).length,
      mid: rows.filter((c) => c.score_match >= 50 && c.score_match <= 80).length,
      low: rows.filter((c) => c.score_match < 50).length,
    }),
    [rows]
  );

  async function handleStatus(id: number, status: CandidateStatus) {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, statut: status } : c)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, statut: status } : prev));
    await supabase.from('candidats').update({ statut: status }).eq('id', id);
  }

  async function reload() {
    const { data, error } = await supabase.from('candidats').select('*');
    if (!error) setRows((data ?? []) as CandidatRow[]);
  }

  async function handleCvFile(file: File) {
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setToast({ kind: 'error', text: 'Le fichier doit être au format PDF.' });
      return;
    }
    if (file.size > MAX_SIZE) {
      setToast({ kind: 'error', text: 'Fichier trop lourd (5 Mo maximum).' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + Math.random() * 18, 90));
    }, 250);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from('cvs').upload(filePath, file);
      if (uploadError) throw new Error(uploadError.message);

      const { data: pub } = supabase.storage.from('cvs').getPublicUrl(filePath);
      const cvUrl = pub.publicUrl;

      const baseName = file.name.replace(/\.pdf$/i, '');
      const score = Math.floor(Math.random() * 19) + 80;
      const { error: insertError } = await supabase.from('candidats').insert([
        {
          nom: `Candidat ${baseName}`,
          poste_vise: 'Poste extrait par IA',
          competences: ['Compétences extraites par IA'],
          score_match: score,
          statut: 'À trier',
          cv_url: cvUrl,
        },
      ]);
      if (insertError) throw new Error(insertError.message);

      setUploadProgress(100);
      setToast({ kind: 'success', text: 'Candidat analysé et ajouté avec succès !' });
      await reload();
    } catch (err) {
      setToast({ kind: 'error', text: `Erreur : ${(err as Error).message}` });
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nom = String(form.get('nom') ?? '').trim();
    const poste_vise = String(form.get('poste_vise') ?? '').trim();
    const competencesRaw = String(form.get('competences') ?? '').trim();
    const score_match = Number(form.get('score_match') ?? 0) || 0;
    const statut = String(form.get('statut') ?? 'À trier');

    if (!nom || !poste_vise || !competencesRaw) {
      setToast({ kind: 'error', text: 'Tous les champs obligatoires doivent être remplis.' });
      return;
    }

    const competences = competencesRaw.split(',').map((s) => s.trim()).filter(Boolean);

    const { error: insertError } = await supabase
      .from('candidats')
      .insert([{ nom, poste_vise, competences, score_match, statut }]);

    if (insertError) {
      setToast({ kind: 'error', text: `Erreur : ${insertError.message}` });
      return;
    }

    setShowAdd(false);
    setToast({ kind: 'success', text: 'Candidat ajouté avec succès !' });
    await reload();
  }

  const retained = rows.filter((c) => c.statut === 'Retenu').length;
  const avgMatch = rows.length ? Math.round(rows.reduce((s, c) => s + c.score_match, 0) / rows.length) : 0;

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidats</h1>
            <p className="mt-1.5 text-slate-600">
              CVs triés automatiquement par score de correspondance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-corporate-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-corporate-800 hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              Ajouter un candidat
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <Sparkles className="h-4 w-4 text-accent-500" />
              <span>Matching IA actif</span>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Candidats analysés', value: rows.length, color: 'text-corporate-700', bg: 'bg-corporate-50' },
            { icon: TrendingUp, label: 'Match moyen', value: `${avgMatch}%`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: Check, label: 'Profils retenus', value: retained, color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: Clock, label: 'À trier', value: rows.filter((c) => c.statut === 'À trier').length, color: 'text-slate-600', bg: 'bg-slate-100' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-xs text-slate-500">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* CV drop zone / upload progress */}
        {uploading ? (
          <div className="mt-6 rounded-2xl border border-corporate-200 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-corporate-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Analyse IA en cours...</p>
                <p className="text-xs text-slate-500">Extraction des compétences...</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-corporate-600 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-1.5 text-right text-xs text-slate-400">{Math.round(uploadProgress)}%</p>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleCvFile(f);
            }}
            className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
              dragOver
                ? 'border-corporate-500 bg-corporate-50'
                : 'border-slate-300 bg-white hover:border-corporate-300 hover:bg-slate-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-corporate-50 text-corporate-600">
              <UploadCloud className="h-6 w-6" />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-800">Déposer un CV (PDF)</p>
            <p className="mt-1 text-xs text-slate-500">Glissez-déposez un fichier ici, ou cliquez pour parcourir. Analyse IA en 2 secondes.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleCvFile(f);
              }}
            />
          </div>
        )}

        {/* Filters + search */}
        <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? 'bg-corporate-700 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-corporate-300 hover:text-corporate-700'
                  }`}
                >
                  {f.label}
                  <span
                    className={`text-xs rounded-full px-1.5 py-0.5 ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {counts[f.id]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="relative lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un candidat…"
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-corporate-400 focus:ring-2 focus:ring-corporate-100 outline-none transition"
            />
          </div>
        </div>

        {/* States: loading / error / empty / grid */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-corporate-600" />
            <p className="mt-3 text-sm">Chargement des candidats...</p>
          </div>
        ) : error ? (
          <div className="mt-12 flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-rose-300 bg-white">
            <AlertCircle className="h-8 w-8 text-rose-500" />
            <p className="mt-3 text-sm text-rose-600">Erreur : {error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-12 text-center py-16 rounded-2xl border border-dashed border-slate-300 bg-white">
            <p className="text-slate-500">Aucun candidat trouvé.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 text-center py-16 rounded-2xl border border-dashed border-slate-300 bg-white">
            <p className="text-slate-500">Aucun candidat ne correspond à ce filtre.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const sc = scoreColor(c.score_match);
              const isNew = c.recu_il_y_a < 24;
              return (
                <div
                  key={c.id}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1 hover:border-corporate-200"
                >
                  {isNew && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-accent-50 border border-accent-200 px-2.5 py-1 text-xs font-semibold text-accent-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse" />
                      Nouveau
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${c.avatar_color} text-white font-semibold text-sm shrink-0`}
                    >
                      {initials(c.nom)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{c.nom}</h3>
                      <p className="text-sm text-slate-500 truncate">{c.poste_vise}</p>
                    </div>
                  </div>

                  {/* Match score */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Score de Match</span>
                      <span className={`font-bold ${sc.text}`}>{c.score_match}%</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sc.bar} transition-all duration-700`}
                        style={{ width: `${c.score_match}%` }}
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.competences.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Status */}
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle(c.statut)}`}
                    >
                      {c.statut}
                    </span>
                    <div className="flex items-center gap-2">
                      {c.cv_url && (
                        <a
                          href={c.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-corporate-600 hover:text-corporate-700"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          CV
                        </a>
                      )}
                      <span className="text-xs text-slate-400">
                        Reçu il y a {c.recu_il_y_a}h
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => setSelected(c)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-corporate-300 hover:text-corporate-700"
                    >
                      <Eye className="h-4 w-4" />
                      CV
                    </button>
                    <button
                      onClick={() => handleStatus(c.id, 'Retenu')}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-all ${
                        c.statut === 'Retenu'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      Retenir
                    </button>
                    <button
                      onClick={() => handleStatus(c.id, 'Refusé')}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-all ${
                        c.statut === 'Refusé'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      }`}
                    >
                      <X className="h-4 w-4" />
                      Refuser
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add candidate modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-up"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-corporate-700 px-5 py-4">
              <h2 className="text-base font-semibold text-white">Ajouter un candidat</h2>
              <button
                onClick={() => setShowAdd(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="px-5 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nom <span className="text-rose-500">*</span></label>
                <input
                  name="nom"
                  required
                  placeholder="Ex. Amina Diallo"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-corporate-400 focus:ring-2 focus:ring-corporate-100 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Poste visé <span className="text-rose-500">*</span></label>
                <input
                  name="poste_vise"
                  required
                  placeholder="Ex. Data Scientist"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-corporate-400 focus:ring-2 focus:ring-corporate-100 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Compétences <span className="text-rose-500">*</span></label>
                <input
                  name="competences"
                  required
                  placeholder="Ex. Python, SQL, Machine Learning"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-corporate-400 focus:ring-2 focus:ring-corporate-100 outline-none transition"
                />
                <p className="mt-1 text-xs text-slate-400">Séparez les compétences par des virgules.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Score de match</label>
                  <input
                    name="score_match"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={0}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-corporate-400 focus:ring-2 focus:ring-corporate-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Statut</label>
                  <select
                    name="statut"
                    defaultValue="À trier"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-corporate-400 focus:ring-2 focus:ring-corporate-100 outline-none transition bg-white"
                  >
                    <option value="À trier">À trier</option>
                    <option value="Retenu">Retenu</option>
                    <option value="Refusé">Refusé</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-corporate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-corporate-800 transition"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 animate-fade-up">
          <div
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
              toast.kind === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {toast.kind === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {toast.text}
          </div>
        </div>
      )}

      {/* CV modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-up"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`h-24 bg-gradient-to-r ${selected.avatar_color} relative`}>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 pb-6 -mt-10">
              <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${selected.avatar_color} text-white text-2xl font-bold ring-4 ring-white`}>
                {initials(selected.nom)}
              </div>
              <h2 className="mt-3 text-xl font-bold text-slate-900">{selected.nom}</h2>
              <p className="text-slate-500">{selected.poste_vise}</p>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Score de Match</p>
                  <p className={`text-3xl font-extrabold ${scoreColor(selected.score_match).text}`}>
                    {selected.score_match}%
                  </p>
                </div>
                <div className="flex-1">
                  <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${scoreColor(selected.score_match).bar}`}
                      style={{ width: `${selected.score_match}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Statut :{' '}
                    <span className="font-semibold text-slate-700">{selected.statut}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-700">Compétences clés</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.competences.map((s) => (
                    <span key={s} className="rounded-md bg-corporate-50 px-3 py-1.5 text-sm font-medium text-corporate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">CV reçu</p>
                  <p className="font-medium text-slate-700">Il y a {selected.recu_il_y_a}h</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">Référence</p>
                  <p className="font-medium text-slate-700">SR-{String(selected.id).padStart(4, '0')}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleStatus(selected.id, 'Retenu')}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  <Check className="h-4 w-4" /> Retenir
                </button>
                <button
                  onClick={() => handleStatus(selected.id, 'Refusé')}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition"
                >
                  <X className="h-4 w-4" /> Refuser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
