import { candidates, type Candidate, type CandidateStatus } from '@/data/candidates';

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

const norm = (s: string) => s.toLowerCase().trim();

function findByName(query: string, list: Candidate[]): Candidate[] {
  const q = norm(query);
  return list.filter((c) => {
    const full = `${c.name} ${c.role}`.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      full.includes(q) ||
      c.name.toLowerCase().split(' ').some((part) => part.startsWith(q))
    );
  });
}

function extractNames(query: string, list: Candidate[]): Candidate[] {
  const found: Candidate[] = [];
  for (const c of list) {
    const parts = c.name.toLowerCase().split(' ');
    if (parts.some((p) => p.length > 2 && query.includes(p))) {
      found.push(c);
    }
  }
  return found;
}

function recommendBest(list: Candidate[], role?: string): string {
  let pool = list;
  if (role) {
    const r = norm(role);
    pool = list.filter((c) => norm(c.role).includes(r) || r.includes(norm(c.role)));
  }
  if (pool.length === 0) return `Je n'ai trouvé aucun candidat correspondant au poste « ${role} ».`;
  const sorted = [...pool].sort((a, b) => b.match - a.match);
  const top = sorted.slice(0, 3);
  let lines = top
    .map(
      (c, i) =>
        `${i + 1}. ${c.name} — ${c.role} (${c.match}%) · ${c.skills.join(', ')} · Statut : ${c.status}`
    )
    .join('\n');
  return `Voici les profils les plus pertinents${role ? ` pour le poste de ${role}` : ''} :\n\n${lines}\n\nJe recommande de prioriser ${top[0].name} (score ${top[0].match}%), c'est le meilleur match.`;
}

function compareTwo(a: Candidate, b: Candidate): string {
  const winner = a.match >= b.match ? a : b;
  const lines = [
    `Comparaison entre ${a.name} et ${b.name} :`,
    ``,
    `${a.name} — ${a.role}`,
    `  Score : ${a.match}% | Compétences : ${a.skills.join(', ')} | Statut : ${a.status}`,
    ``,
    `${b.name} — ${b.role}`,
    `  Score : ${b.match}% | Compétences : ${b.skills.join(', ')} | Statut : ${b.status}`,
    ``,
    `Écart de match : ${Math.abs(a.match - b.match)} points en faveur de ${winner.name}.`,
  ];
  return lines.join('\n');
}

function statsSummary(list: Candidate[]): string {
  const retained = list.filter((c) => c.status === 'Retenu').length;
  const refused = list.filter((c) => c.status === 'Refusé').length;
  const pending = list.filter((c) => c.status === 'À trier').length;
  const avg = Math.round(list.reduce((s, c) => s + c.match, 0) / list.length);
  const best = [...list].sort((a, b) => b.match - a.match)[0];
  return [
    `Voici un résumé du vivier de candidats :`,
    ``,
    `• Total analysé : ${list.length}`,
    `• Score moyen : ${avg}%`,
    `• Retenus : ${retained} | À trier : ${pending} | Refusés : ${refused}`,
    `• Meilleur profil : ${best.name} (${best.match}%) — ${best.role}`,
  ].join('\n');
}

function filterByRole(role: string, list: Candidate[]): string {
  const r = norm(role);
  const matches = list.filter((c) => norm(c.role).includes(r) || r.includes(norm(c.role)));
  if (matches.length === 0) return `Aucun candidat ne vise le poste « ${role} ».`;
  const lines = matches
    .sort((a, b) => b.match - a.match)
    .map((c) => `• ${c.name} — ${c.match}% — ${c.skills.join(', ')}`)
    .join('\n');
  return `Candidats pour le poste de ${role} :\n\n${lines}`;
}

function filterBySkill(skill: string, list: Candidate[]): string {
  const s = norm(skill);
  const matches = list.filter((c) => c.skills.some((sk) => norm(sk).includes(s)));
  if (matches.length === 0) return `Aucun candidat ne maîtrise « ${skill} ».`;
  const lines = matches
    .sort((a, b) => b.match - a.match)
    .map((c) => `• ${c.name} (${c.role}) — ${c.match}%`)
    .join('\n');
  return `Candidats maîtrisant ${skill} :\n\n${lines}`;
}

function statusSummary(status: string, list: Candidate[]): string {
  const s = norm(status);
  let group: Candidate[] = [];
  let label = status;
  if (s.includes('retenu')) {
    group = list.filter((c) => c.status === 'Retenu');
    label = 'retenus';
  } else if (s.includes('refus')) {
    group = list.filter((c) => c.status === 'Refusé');
    label = 'refusés';
  } else if (s.includes('trier') || s.includes('tri') || s.includes('pending')) {
    group = list.filter((c) => c.status === 'À trier');
    label = 'à trier';
  }
  if (group.length === 0) return `Aucun candidat ${label}.`;
  const lines = group
    .map((c) => `• ${c.name} — ${c.role} — ${c.match}%`)
    .join('\n');
  return `${group.length} candidat(s) ${label} :\n\n${lines}`;
}

const ROLES = ['data scientist', 'fullstack', 'devops', 'chef de projet', 'data analyst', 'ux designer'];
const SKILLS = ['python', 'sql', 'machine learning', 'react', 'node.js', 'mongodb', 'agile', 'jira', 'scrum', 'excel', 'powerbi', 'figma', 'docker', 'kubernetes', 'aws'];

export function getAgentResponse(input: string, list: Candidate[]): string {
  const q = norm(input);

  if (!q) return "Je n'ai pas compris votre demande. Pouvez-vous reformuler ?";

  // Greeting
  if (/^(bonjour|salut|hello|hey|coucou|bonsoir|bonjour myrecrut)/.test(q)) {
    return `Bonjour ! Je suis myrecrut, votre assistant IA de recrutement. Je peux vous aider à :\n• Recommander les meilleurs profils\n• Comparer deux candidats\n• Résumer les statistiques du vivier\n• Filtrer par poste, compétence ou statut\n\nQue souhaitez-vous faire ?`;
  }

  // Help
  if (/(que peux.tu faire|aide|help|capacit|comment.*marche|tu sais quoi faire)/.test(q)) {
    return `Voici ce que je peux faire pour vous :\n\n1. Recommander — « Quel est le meilleur candidat pour Data Scientist ? »\n2. Comparer — « Compare Amina et Cheikh »\n3. Statistiques — « Résumé des candidats »\n4. Filtrer par poste — « Candidats DevOps »\n5. Filtrer par compétence — « Qui maîtrise Python ? »\n6. Filtrer par statut — « Qui est retenu ? »`;
  }

  // Comparison
  if (/(compare|versus|\bvs\b|diff.rence entre|mieux entre)/.test(q)) {
    const named = extractNames(q, list);
    if (named.length >= 2) {
      return compareTwo(named[0], named[1]);
    }
    return `Pour comparer deux candidats, citez leurs prénoms, par exemple : « Compare Amina et Cheikh ».`;
  }

  // Recommendation
  if (/(meilleur|recommand|conseill|top|qui recruter|quel profil|sugg.re|propose)/.test(q)) {
    const roleMatch = ROLES.find((r) => q.includes(r));
    return recommendBest(list, roleMatch);
  }

  // Stats
  if (/(combien|statistique|stat|résum|resume|synth.se|nombre de candidat|moyenne)/.test(q)) {
    return statsSummary(list);
  }

  // Status
  if (/(retenu|refus|trier|tri)/.test(q)) {
    const m = q.match(/(retenu|refus|trier|tri)/);
    return statusSummary(m ? m[1] : '', list);
  }

  // Role filter
  const roleMatch = ROLES.find((r) => q.includes(r));
  if (roleMatch) return filterByRole(roleMatch, list);

  // Skill filter
  const skillMatch = SKILLS.find((s) => q.includes(s));
  if (skillMatch) return filterBySkill(skillMatch, list);

  // Specific candidate by name
  const named = extractNames(q, list);
  if (named.length === 1) {
    const c = named[0];
    return `${c.name} — ${c.role}\n\nScore de match : ${c.match}%\nCompétences : ${c.skills.join(', ')}\nStatut : ${c.status}\nCV reçu il y a ${c.receivedHoursAgo}h\n\n${c.match > 80 ? 'Profil fortement recommandé.' : c.match >= 50 ? 'Profil moyen, à approfondir en entretien.' : 'Profil faible par rapport à la fiche de poste.'}`;
  }

  return `Je n'ai pas saisi votre demande. Essayez par exemple :\n• « Recommande-moi les meilleurs profils »\n• « Compare Amina et Cheikh »\n• « Qui maîtrise Docker ? »\n• « Résumé des candidats »`;
}

export const suggestedPrompts = [
  'Recommande les meilleurs profils',
  'Compare Amina et Cheikh',
  'Qui maîtrise Python ?',
  'Résumé des candidats',
  'Qui est retenu ?',
];

export { candidates };
export type { Candidate, CandidateStatus };
