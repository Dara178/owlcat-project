import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOwlcat } from '../hooks/useOwlcat';
import { OwlcatStatus } from '../components/owlcat/OwlcatStatus';
import { InteractionBar } from '../components/owlcat/InteractionBar';
import { StatBar } from '../components/owlcat/StatBar';
import { LevelProgress } from '../components/evolution/LevelProgress';
import { BookOpen, Award, ArrowRight } from 'lucide-react';

export function DashboardPage() {
  const {
    owlcat,
    journalEntries,
    isLoading,
    actionLoading,
    lastInteractionResult,
    interact
  } = useOwlcat();

  const navigate = useNavigate();

  // If user has no owlcat, redirect to adoption page
  useEffect(() => {
    if (!isLoading && !owlcat) {
      navigate('/adopt', { replace: true });
    }
  }, [owlcat, isLoading, navigate]);

  if (isLoading && !owlcat) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(245, 158, 11, 0.2)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: 'var(--text-muted)' }}>Despertando a tu Owlcat...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!owlcat) return null;

  const stats = owlcat.stats || {
    happiness: 50,
    energy: 50,
    curiosity: 50,
    boredom: 50,
    bond: 0
  };

  const unlockedSkillsCount = (owlcat.skills || []).length;
  const journalCount = (journalEntries || []).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      {/* Central Owlcat Focus Area */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '0.5rem'
      }}>
        <OwlcatStatus
          owlcat={owlcat}
          lastResult={lastInteractionResult}
          isInteracting={actionLoading}
        />
      </section>

      {/* 4 Interaction Actions */}
      <section style={{ maxWidth: '680px', width: '100%', margin: '0 auto' }}>
        <InteractionBar
          onInteract={interact}
          isLoading={actionLoading}
        />
      </section>

      {/* Experience & Evolution Progress */}
      <section style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
        <LevelProgress level={owlcat.level} stage={owlcat.stage} />
      </section>

      {/* Emotional Variables Grid */}
      <section style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>Estado y Variables Emocionales</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '0.85rem'
        }}>
          <StatBar statKey="happiness" value={stats.happiness} />
          <StatBar statKey="energy" value={stats.energy} />
          <StatBar statKey="curiosity" value={stats.curiosity} />
          <StatBar statKey="boredom" value={stats.boredom} />
          <StatBar statKey="bond" value={stats.bond} />
        </div>
      </section>

      {/* Quick Access to Journal & Skills */}
      <section style={{
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        <Link
          to="/journal"
          className="glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.12)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={22} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Diario Emocional
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {journalCount} {journalCount === 1 ? 'recuerdo registrado' : 'recuerdos registrados'}
              </p>
            </div>
          </div>
          <ArrowRight size={18} color="var(--primary)" />
        </Link>

        <Link
          to="/skills"
          className="glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(139, 92, 246, 0.12)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={22} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Habilidades
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {unlockedSkillsCount} desbloqueadas
              </p>
            </div>
          </div>
          <ArrowRight size={18} color="var(--secondary)" />
        </Link>
      </section>
    </div>
  );
}
