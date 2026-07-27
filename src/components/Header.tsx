
export type Page = 'home' | 'candidates' | 'contact';

interface HeaderProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string }[] = [
  { id: 'home', label: 'Accueil' },
  { id: 'candidates', label: 'Candidats' },
  { id: 'contact', label: 'Contact RH' },
];

export default function Header({ current, onNavigate }: HeaderProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <img
              src="/logo.svg"
              alt="QuickRecrut"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl transition-transform group-hover:scale-105"
            />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-corporate-700">Quick</span>
              <span className="text-accent-500">Recrut</span>
            </span>
          </button>

          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-corporate-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-corporate-700 hover:bg-corporate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
