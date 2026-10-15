import { Link } from 'react-router-dom';
import { useOwlcat } from '../hooks/useOwlcat';
import { SkillCard } from '../components/skills/SkillCard';
import { Award, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

export function SkillsPage() {
  const { owlcat, skills } = useOwlcat();

  const unlocked = skills.unlocked || [];
  const locked = skills.locked || [];
  const total = unlocked.length + locked.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '850px', margin: '0 auto' }}>
      {/* Header */}
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
          <Award size={28} color="var(--secondary)" />
          <span>Árbol de Habilidades</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Capacidades y trucos especiales aprendidos por {owlcat?.name || 'tu Owlcat'}
        </p>
      </div>

      {/* Progress Summary Card */}
      <div className="glass-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderLeft: '4px solid var(--secondary)'
      }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Progreso de Maestría
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.2rem 0 0 0' }}>
            {unlocked.length} de {total} Habilidades Desbloqueadas
          </h3>
        </div>
        <div style={{
          background: 'rgba(139, 92, 246, 0.15)',
          color: 'var(--secondary)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
          fontSize: '0.95rem'
        }}>
          Nivel {owlcat?.level?.number || 1} · {owlcat?.stage?.name || 'Polluelo'}
        </div>
      </div>

      {/* Desbloqueadas Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} color="var(--success)" />
          <span>Habilidades Desbloqueadas ({unlocked.length})</span>
        </h3>

        {unlocked.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              Aún no has desbloqueado ninguna habilidad. ¡Sube al Nivel 2 interactuando con tu Owlcat!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {unlocked.map(skill => (
              <SkillCard key={skill.code} skill={skill} isUnlocked={true} />
            ))}
          </div>
        )}
      </section>

      {/* Bloqueadas Section */}
      {locked.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Lock size={18} />
            <span>Por Desbloquear ({locked.length})</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {locked.map(skill => (
              <SkillCard key={skill.code} skill={skill} isUnlocked={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
