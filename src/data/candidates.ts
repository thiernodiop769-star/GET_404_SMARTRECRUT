export type CandidateStatus = 'À trier' | 'Retenu' | 'Refusé';

export interface Candidate {
  id: number;
  name: string;
  role: string;
  match: number;
  skills: string[];
  status: CandidateStatus;
  receivedHoursAgo: number;
  avatarColor: string;
}

export const candidates: Candidate[] = [
  {
    id: 1,
    name: 'Amina Diallo',
    role: 'Data Scientist',
    match: 95,
    skills: ['Python', 'SQL', 'Machine Learning'],
    status: 'À trier',
    receivedHoursAgo: 5,
    avatarColor: 'from-corporate-700 to-corporate-500',
  },
  {
    id: 2,
    name: 'Ousmane Ba',
    role: 'Développeur Fullstack',
    match: 82,
    skills: ['React', 'Node.js', 'MongoDB'],
    status: 'Retenu',
    receivedHoursAgo: 30,
    avatarColor: 'from-accent-500 to-accent-400',
  },
  {
    id: 3,
    name: 'Fatou Sow',
    role: 'Chef de Projet IT',
    match: 65,
    skills: ['Agile', 'Jira', 'Scrum'],
    status: 'À trier',
    receivedHoursAgo: 8,
    avatarColor: 'from-emerald-600 to-emerald-400',
  },
  {
    id: 4,
    name: 'Ibrahima Ndiaye',
    role: 'Data Analyst',
    match: 40,
    skills: ['Excel', 'PowerBI', 'SQL'],
    status: 'Refusé',
    receivedHoursAgo: 52,
    avatarColor: 'from-rose-600 to-rose-400',
  },
  {
    id: 5,
    name: 'Marie Vasseur',
    role: 'UX Designer',
    match: 20,
    skills: ['Figma', 'Research', 'Prototyping'],
    status: 'Refusé',
    receivedHoursAgo: 70,
    avatarColor: 'from-violet-600 to-violet-400',
  },
  {
    id: 6,
    name: 'Cheikh Mbaye',
    role: 'DevOps Engineer',
    match: 88,
    skills: ['Docker', 'Kubernetes', 'AWS'],
    status: 'Retenu',
    receivedHoursAgo: 3,
    avatarColor: 'from-sky-700 to-sky-500',
  },
];
