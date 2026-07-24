import { useMemo, useState } from 'react';
import {
  Search,
  Eye,
  Check,
  X,
  Sparkles,
  Users,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { type Candidate, type CandidateStatus } from '@/data/candidates';

type Filter = 'all' | 'high' | 'mid' | 'low';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'high', label: 'Score > 80%' },
  { id: 'mid', label: 'Score 50-80%' },
  { id: 'low', label: 'Score < 50%' },
];

function scoreColor(match: number) {
  if (match > 80) return { bar: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-100' };
  if (match >= 50) return { bar: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-100' };
  return { bar: 'bg-rose-500', text: 'text-rose-600', ring: 'ring-rose-100' };
}

function statusStyle(status: CandidateStatus) {
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

interface CandidatesProps {
  candidates: Candidate[];
  updateStatus: (id: number, status: CandidateStatus) => void;
}

export default function Candidates({ candidates: list, updateStatus }: CandidatesProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    return list.filter((c) => {
      const matchesQuery =
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.role.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'high' && c.match > 80) ||
        (filter === 'mid' && c.match >= 50 && c.match <= 80) ||
        (filter === 'low' && c.match < 50);
      return matchesQuery && matchesFilter;
    });
  }, [list, filter, query]);

  const counts = useMemo(
    () => ({
      all: list.length,
      high: list.filter((c) => c.match > 80).length,
      mid: list.filter((c) => c.match >= 50 && c.match <= 80).length,
      low: list.filter((c) => c.match < 50).length,
    }),
    [list]
  );

  function handleStatus(id: number, status: CandidateStatus) {
    updateStatus(id, status);
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  const retained = list.filter((c) => c.status === 'Retenu').length;
  const avgMatch = Math.round(list.reduce((s, c) => s + c.match, 0) / list.length);

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
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles className="h-4 w-4 text-accent-500" />
            <span>Matching IA actif</span>
          </div>
        </div>

        {/* KPI cards */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Candidats analysés', value: list.length, color: 'text-corporate-700', bg: 'bg-corporate-50' },
            { icon: TrendingUp, label: 'Match moyen', value: `${avgMatch}%`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: Check, label: 'Profils retenus', value: retained, color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: Clock, label: 'À trier', value: list.filter((c) => c.status === 'À trier').length, color: 'text-slate-600', bg: 'bg-slate-100' },
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

        {/* Candidate grid */}
        {filtered.length === 0 ? (
          <div className="mt-12 text-center py-16 rounded-2xl border border-dashed border-slate-300 bg-white">
            <p className="text-slate-500">Aucun candidat ne correspond à ce filtre.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const sc = scoreColor(c.match);
              const isNew = c.receivedHoursAgo < 24;
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
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${c.avatarColor} text-white font-semibold text-sm shrink-0`}
                    >
                      {initials(c.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{c.name}</h3>
                      <p className="text-sm text-slate-500 truncate">{c.role}</p>
                    </div>
                  </div>

                  {/* Match score */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Score de Match</span>
                      <span className={`font-bold ${sc.text}`}>{c.match}%</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sc.bar} transition-all duration-700`}
                        style={{ width: `${c.match}%` }}
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.skills.map((skill) => (
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
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle(c.status)}`}
                    >
                      {c.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Reçu il y a {c.receivedHoursAgo}h
                    </span>
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
                        c.status === 'Retenu'
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
                        c.status === 'Refusé'
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
            <div className={`h-24 bg-gradient-to-r ${selected.avatarColor} relative`}>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 pb-6 -mt-10">
              <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${selected.avatarColor} text-white text-2xl font-bold ring-4 ring-white`}>
                {initials(selected.name)}
              </div>
              <h2 className="mt-3 text-xl font-bold text-slate-900">{selected.name}</h2>
              <p className="text-slate-500">{selected.role}</p>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Score de Match</p>
                  <p className={`text-3xl font-extrabold ${scoreColor(selected.match).text}`}>
                    {selected.match}%
                  </p>
                </div>
                <div className="flex-1">
                  <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${scoreColor(selected.match).bar}`}
                      style={{ width: `${selected.match}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Statut :{' '}
                    <span className="font-semibold text-slate-700">{selected.status}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-700">Compétences clés</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.skills.map((s) => (
                    <span key={s} className="rounded-md bg-corporate-50 px-3 py-1.5 text-sm font-medium text-corporate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">CV reçu</p>
                  <p className="font-medium text-slate-700">Il y a {selected.receivedHoursAgo}h</p>
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
