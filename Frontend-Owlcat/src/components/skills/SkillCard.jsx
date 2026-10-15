import { Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export function SkillCard({ skill, isUnlocked = false }) {
  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        borderLeft: isUnlocked ? '3px solid var(--primary)' : '3px solid #475569',
        opacity: isUnlocked ? 1 : 0.75,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-sm)',
            background: isUnlocked ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isUnlocked ? 'var(--primary)' : 'var(--text-muted)'
          }}>
            {isUnlocked ? <Sparkles size={20} /> : <Lock size={18} />}
          </div>
          <div>
            <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {skill.name}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Código: {skill.code}
            </span>
          </div>
        </div>

        <div>
          {isUnlocked ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--success)',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)'
            }}>
              <CheckCircle2 size={13} />
              Desbloqueada
            </span>
          ) : (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)'
            }}>
              <Lock size={12} />
              Bloqueada
            </span>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
        {skill.description}
      </p>

      <div style={{
        marginTop: 'auto',
        paddingTop: '0.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        fontSize: '0.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        color: isUnlocked ? 'var(--text-muted)' : 'var(--warning)'
      }}>
        {isUnlocked ? (
          <span>Desbloqueada {formatRelativeTime(skill.unlocked_at)}</span>
        ) : (
          <span>
            Requiere: Nivel {skill.required_level || 1}
            {skill.required_stage_name ? ` · Etapa ${skill.required_stage_name}` : ''}
          </span>
        )}
      </div>
    </div>
  );
}
