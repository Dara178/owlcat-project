import { Award, Zap } from 'lucide-react';

export function LevelProgress({ level, stage }) {
  const currentLevel = level?.number || 1;
  const levelName = level?.name || 'Polluelo Curioso';
  const currentXp = level?.experience || 0;
  const nextLevelXp = level?.next_level_experience || 100;
  const stageName = stage?.name || 'Polluelo';

  // Calculate percentage relative to level milestone
  const prevLevelThreshold = currentLevel === 1 ? 0 : 
    currentLevel === 2 ? 100 : 
    currentLevel === 3 ? 250 : 
    currentLevel === 4 ? 450 : 700;

  const xpInCurrentLevel = Math.max(0, currentXp - prevLevelThreshold);
  const xpNeededForLevel = Math.max(1, nextLevelXp - prevLevelThreshold);
  const percentage = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100));

  return (
    <div className="glass-card" style={{ padding: '1.2rem 1.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary) 0%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            fontWeight: 800,
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            {currentLevel}
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>
              Nivel {currentLevel}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {levelName}
            </div>
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          color: 'var(--secondary)',
          borderRadius: 'var(--radius-full)',
          padding: '0.3rem 0.8rem',
          fontSize: '0.82rem',
          fontWeight: 600
        }}>
          <Award size={14} />
          <span>Etapa: {stageName}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Zap size={14} color="var(--primary)" />
          Experiencia total: <strong style={{ color: 'var(--primary)' }}>{currentXp} XP</strong>
        </span>
        <span>Próximo nivel en {nextLevelXp} XP ({percentage}%)</span>
      </div>

      <div style={{
        width: '100%',
        height: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden'
      }}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.6s ease-out',
            boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
          }}
        />
      </div>
    </div>
  );
}
