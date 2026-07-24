import { useEffect, useState } from 'react';
import Header, { type Page } from '@/components/Header';
import Footer from '@/components/Footer';
import AgentWidget from '@/components/AgentWidget';
import Home from '@/pages/Home';
import Candidates from '@/pages/Candidates';
import Contact from '@/pages/Contact';
import { candidates as initialCandidates, type Candidate, type CandidateStatus } from '@/data/candidates';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [page]);

  function updateStatus(id: number, status: CandidateStatus) {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header current={page} onNavigate={setPage} />
      <main className="flex-1">
        {page === 'home' && <Home onNavigate={setPage} />}
        {page === 'candidates' && (
          <Candidates candidates={candidates} updateStatus={updateStatus} />
        )}
        {page === 'contact' && <Contact />}
      </main>
      <Footer onNavigate={setPage} />
      <AgentWidget candidates={candidates} />
    </div>
  );
}
