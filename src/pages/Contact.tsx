import { useState } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle2, Building2, Clock } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const empty: FormState = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);

  function validate() {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Veuillez indiquer votre nom complet.';
    if (!form.email.trim()) e.email = 'Veuillez indiquer votre e-mail entreprise.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Adresse e-mail invalide.';
    if (!form.message.trim()) e.message = 'Veuillez écrire votre message.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSent(true);
    setForm(empty);
    setTimeout(() => setSent(false), 5000);
  }

  const field = (key: keyof FormState, label: string, type = 'text', placeholder = '', textarea = false) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          rows={5}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:ring-2 ${
            errors[key]
              ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
              : 'border-slate-200 focus:border-corporate-400 focus:ring-corporate-100'
          }`}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:ring-2 ${
            errors[key]
              ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
              : 'border-slate-200 focus:border-corporate-400 focus:ring-corporate-100'
          }`}
        />
      )}
      {errors[key] && <p className="mt-1.5 text-xs text-rose-600">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Contactez l'équipe RH
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Une question sur SmartRecrut, une démo ou un partenariat ? Écrivez-nous.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Info column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="text-lg font-semibold text-slate-900">Nos coordonnées</h3>
              <ul className="mt-5 space-y-5">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-corporate-50 text-corporate-700 shrink-0">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Adresse</p>
                    <p className="text-sm text-slate-600">Immeuble Le Diamant, Plateau</p>
                    <p className="text-sm text-slate-600">Dakar, Sénégal</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-corporate-50 text-corporate-700 shrink-0">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">E-mail</p>
                    <p className="text-sm text-slate-600">contact@smartrecrut.sn</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-corporate-50 text-corporate-700 shrink-0">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Téléphone</p>
                    <p className="text-sm text-slate-600">+221 33 800 00 00</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-corporate-50 text-corporate-700 shrink-0">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Horaires</p>
                    <p className="text-sm text-slate-600">Lun – Ven : 9h00 – 18h00</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-card h-64">
              <iframe
                title="SmartRecrut — Immeuble Le Diamant, Plateau, Dakar"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-17.448%2C14.668%2C-17.428%2C14.688&layer=mapnik&marker=14.678%2C-17.438"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
              {sent && (
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 animate-fade-up">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <p className="text-sm font-medium text-emerald-700">
                    Votre message a bien été envoyé. Nous vous répondrons sous 48h.
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                {field('name', 'Nom complet', 'text', 'Ex. Awa Ndiaye')}
                {field('email', 'E-mail entreprise', 'email', 'vous@entreprise.com')}
                {field('phone', 'Téléphone', 'tel', '+221 …')}
                {field('message', 'Message', 'text', 'Décrivez votre besoin…', true)}
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-corporate-700 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-corporate-700/20 transition-all hover:bg-corporate-800 hover:-translate-y-0.5"
                >
                  <Send className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
