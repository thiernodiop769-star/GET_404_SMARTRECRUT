import {
  ArrowRight,
  PlayCircle,
  FileSearch,
  Brain,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import type { Page } from '@/components/Header';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  { value: '1 240', label: 'CVs analysés' },
  { value: '85%', label: 'Taux de match moyen' },
  { value: '12', label: 'Postes à pourvoir' },
];

const features = [
  {
    icon: FileSearch,
    title: 'Tri automatique des CVs',
    desc: "Importez vos candidatures, l'IA les classe instantanément selon la fiche de poste.",
  },
  {
    icon: Brain,
    title: 'Score de correspondance',
    desc: 'Chaque profil reçoit un Match Score précis basé sur les compétences et l\'expérience.',
  },
  {
    icon: ShieldCheck,
    title: 'Biais humains réduits',
    desc: 'Une évaluation objective centrée sur les compétences, pas sur les impressions.',
  },
];

const steps = [
  { n: '01', title: 'Déposez la fiche de poste', desc: 'Décrivez le poste et les compétences requises.' },
  { n: '02', title: 'Importez les CVs', desc: 'Glissez vos candidatures, SmartRecrut fait le reste.' },
  { n: '03', title: 'Analysez les profils', desc: 'Consultez les scores et retenez les meilleurs talents.' },
];

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-corporate-50 via-white to-white pt-28 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-corporate-200/40 blur-3xl" />
          <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-accent-200/30 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-corporate-50 border border-corporate-200 px-4 py-1.5 text-sm font-medium text-corporate-700">
              <Zap className="h-4 w-4 text-accent-500" />
              Matching IA pour le recrutement
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 text-balance leading-[1.1]">
              Recrutez <span className="text-corporate-700">3x plus vite</span> avec le
              matching IA
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed text-balance">
              SmartRecrut analyse vos CVs et identifie les meilleurs talents en quelques
              secondes.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('candidates')}
                className="group inline-flex items-center gap-2 rounded-xl bg-corporate-700 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-corporate-700/20 transition-all hover:bg-corporate-800 hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                Lancer une analyse
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate('candidates')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-corporate-300 hover:text-corporate-700 w-full sm:w-auto justify-center"
              >
                <PlayCircle className="h-5 w-5 text-accent-500" />
                Voir la démo
              </button>
            </div>
          </div>

          {/* Dashboard preview mock */}
          <div className="mt-16 mx-auto max-w-4xl animate-fade-up" style={{ animationDelay: '150ms' }}>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-corporate-700/10 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 bg-slate-50">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-slate-400 font-medium">smartrecrut.sn/candidats</span>
              </div>
              <div className="grid grid-cols-3 gap-4 p-6">
                {[
                  { name: 'Amina Diallo', role: 'Data Scientist', score: 95 },
                  { name: 'Cheikh Mbaye', role: 'DevOps Engineer', score: 88 },
                  { name: 'Ousmane Ba', role: 'Fullstack', score: 82 },
                ].map((c) => (
                  <div key={c.name} className="rounded-xl border border-slate-200 p-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-corporate-700 to-corporate-500" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.role}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Match</span>
                      <span className="font-bold text-emerald-600">{c.score}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-corporate-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
                  {s.value}
                </p>
                <p className="mt-2 text-base font-medium text-corporate-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Une plateforme pensée pour les RH
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Du dépôt de l'appel d'offre à la sélection finale, SmartRecrut fluidifie
              chaque étape du recrutement.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:shadow-card-hover hover:-translate-y-1 hover:border-corporate-200"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-corporate-50 text-corporate-700 transition-colors group-hover:bg-corporate-700 group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 uppercase tracking-wider">
              <TrendingUp className="h-4 w-4" /> Comment ça marche
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Trois étapes, un recrutement plus rapide
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <span className="text-5xl font-extrabold text-corporate-100">{s.n}</span>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('candidates')}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-500/20 transition-all hover:bg-accent-600 hover:-translate-y-0.5"
            >
              Découvrir les candidats
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-corporate-700 px-8 py-12 sm:px-14 sm:py-16 text-center">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent-500/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Prêt à réduire votre temps de recrutement de 70% ?
            </h2>
            <p className="relative mt-4 text-corporate-200 text-lg">
              Rejoignez les équipes RH qui recrutent plus vite, plus juste.
            </p>
            <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-accent-600 hover:-translate-y-0.5"
              >
                Contacter l'équipe RH
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigate('candidates')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10"
              >
                <CheckCircle2 className="h-5 w-5" />
                Lancer une analyse
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
