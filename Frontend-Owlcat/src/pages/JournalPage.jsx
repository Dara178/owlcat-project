import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useOwlcat } from '../hooks/useOwlcat';
import { JournalEntry } from '../components/journal/JournalEntry';
import { BookOpen, ArrowLeft } from 'lucide-react';

export function JournalPage() {
  const { owlcat, journalEntries } = useOwlcat();
  const [filter, setFilter] = useState('all');

  const filteredEntries = useMemo(() => {
    if (!journalEntries) return [];
    if (filter === 'all') return journalEntries;
    if (filter === 'milestones') {
      return journalEntries.filter(e => e.type === 'level_up' || e.type === 'evolution' || e.type === 'adoption');
    }
    if (filter === 'skills') {
      return journalEntries.filter(e => e.type === 'skill_unlock');
    }
    if (filter === 'interactions') {
      return journalEntries.filter(e => e.type.startsWith('interaction_'));
    }
    return journalEntries;
  }, [journalEntries, filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              marginBottom: '0.5rem'
            }}
          >
            <ArrowLeft size={16} />
            <span>Volver a {owlcat?.name || 'Mascota'}</span>
          </Link>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <BookOpen size={28} color="var(--primary)" />
            <span>Diario Emocional</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Momentos, hitos y conversaciones grabadas de {owlcat?.name || 'tu Owlcat'}
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '0.25rem'
        }}>
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'btn-primary' : 'btn-ghost'}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
          >
            Todos ({journalEntries.length})
          </button>
          <button
            onClick={() => setFilter('milestones')}
            className={filter === 'milestones' ? 'btn-primary' : 'btn-ghost'}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
          >
            Hitos
          </button>
          <button
            onClick={() => setFilter('skills')}
            className={filter === 'skills' ? 'btn-primary' : 'btn-ghost'}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
          >
            Habilidades
          </button>
          <button
            onClick={() => setFilter('interactions')}
            className={filter === 'interactions' ? 'btn-primary' : 'btn-ghost'}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
          >
            Charlas
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredEntries.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <BookOpen size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.4rem' }}>No hay recuerdos en esta categoría</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Interactúa con tu Owlcat para crear nuevos recuerdos y vivencias juntos.
            </p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <JournalEntry key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
