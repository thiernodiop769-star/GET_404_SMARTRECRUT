import { Briefcase, Mail, MapPin, Phone } from 'lucide-react';
import type { Page } from './Header';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const team = [
  { name: 'Claude Emmanuel Tendeng', role: 'Chef de produit' },
  { name: 'Thierno Diop', role: 'Dev UI' },
  { name: 'Fatoumata Binetou SEYE', role: 'Prompt Engineer' },
  { name: 'Caroline Ndiaye', role: 'Responsable Impact' },
  { name: 'Abdoulaye SOUMARE', role: 'Dev UI' },
];

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-corporate-700 text-white">
                <Briefcase className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold text-white">
                Quick<span className="text-corporate-300">Recrut</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              La plateforme IA qui trie vos CVs et identifie les meilleurs talents en
              quelques secondes.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-accent-400 transition-colors">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('candidates')} className="hover:text-accent-400 transition-colors">
                  Candidats
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-accent-400 transition-colors">
                  Contact RH
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-accent-400 shrink-0" />
                <span>Immeuble Le Diamant, Plateau, Dakar, Sénégal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent-400 shrink-0" />
                <span>contact@smartrecrut.sn</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent-400 shrink-0" />
                <span>+221 33 800 00 00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Équipe projet
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {team.map((m) => (
                <li key={m.name} className="flex flex-col">
                  <span className="text-slate-200 font-medium">{m.name}</span>
                  <span className="text-xs text-slate-500">{m.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} QuickRecrut. Tous droits réservés.</p>
          <div className="flex gap-5">
            <button className="hover:text-slate-300 transition-colors">Mentions légales</button>
            <button className="hover:text-slate-300 transition-colors">Politique de confidentialité</button>
            <button className="hover:text-slate-300 transition-colors">CGU</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
