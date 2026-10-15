import { Heart, Zap, Compass, Clock, Shield } from 'lucide-react';
import { clamp, getStatLabel } from '../../utils/formatters';

const statIcons = {
  happiness: <Heart size={16} color="#10b981" />,
  energy: <Zap size={16} color="#f59e0b" />,
  curiosity: <Compass size={16} color="#06b6d4" />,
  boredom: <Clock size={16} color="#64748b" />,
  bond: <Shield size={16} color="#ec4899" />
};

function getDescriptor(key, val) {
  if (key === 'boredom') {
    if (val >= 75) return 'Muy aburrido';
    if (val >= 40) return 'Distraído';
    return 'Entretenido';
  }
  if (key === 'energy') {
    if (val <= 20) return 'Agotado';
    if (val <= 50) return 'Con sueño';
    return 'Lleno de vigor';
  }
  if (key === 'happiness') {
    if (val <= 25) return 'Triste';
    if (val <= 60) return 'Animado';
    return 'Radiante';
  }
  if (key === 'curiosity') {
    if (val >= 70) return 'Fascinado';
    if (val >= 40) return 'Atento';
    return 'Pasivo';
  }
  if (key === 'bond') {
    if (val >= 75) return 'Inseparable';
    if (val >= 40) return 'Cercano';
    return 'Conociéndote';
  }
  return '';
}

function getBarGradient(key, val) {
  if (key === 'boredom') {
    if (val >= 70) return 'linear-gradient(90deg, #f59e0b, #ef4444)';
    if (val >= 40) return 'linear-gradient(90deg, #64748b, #f59e0b)';
    return 'linear-gradient(90deg, #10b981, #06b6d4)';
  }
  if (key === 'energy') return 'linear-gradient(90deg, #eab308, #f59e0b)';
  if (key === 'happiness') return 'linear-gradient(90deg, #34d399, #10b981)';
  if (key === 'curiosity') return 'linear-gradient(90deg, #38bdf8, #06b6d4)';
  if (key === 'bond') return 'linear-gradient(90deg, #f472b6, #ec4899)';
  return 'linear-gradient(90deg, #f59e0b, #d97706)';
}

export function StatBar({ statKey, value }) {
  const clampedVal = clamp(value, 0, 100);
  const label = getStatLabel(statKey);
  const descriptor = getDescriptor(statKey, clampedVal);
  const icon = statIcons[statKey] || <Heart size={16} />;
  const gradient = getBarGradient(statKey, clampedVal);

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.45)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.45rem',
      transition: 'border-color var(--transition-fast)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>
          {icon}
          <span>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{descriptor}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', minWidth: '34px', textAlign: 'right' }}>
            {clampedVal}%
          </span>
        </div>
      </div>

      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div
          style={{
            height: '100%',
            width: `${clampedVal}%`,
            background: gradient,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 10px rgba(245, 158, 11, 0.2)`
          }}
        />
      </div>
    </div>
  );
}
