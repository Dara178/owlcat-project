import { BookOpen, Star, Trophy, Sparkles, Heart } from 'lucide-react';
import { formatRelativeTime, formatFullDate } from '../../utils/formatters';
import { EmotionBadge } from '../owlcat/EmotionBadge';

export function JournalEntry({ entry }) {
  const getEventIcon = (type) => {
    switch (type) {
      case 'adoption':
        return <Heart size={18} color="var(--emotion-affectionate)" />;
      case 'level_up':
        return <Star size={18} color="var(--primary)" />;
      case 'evolution':
        return <Trophy size={18} color="var(--secondary)" />;
      case 'skill_unlock':
        return <Sparkles size={18} color="#10b981" />;
      default:
        return <BookOpen size={18} color="var(--text-muted)" />;
    }
  };

  const getEventLabel = (type) => {
    switch (type) {
      case 'adoption':
        return 'Adopción';
      case 'level_up':
        return 'Subida de Nivel';
      case 'evolution':
        return 'Evolución';
      case 'skill_unlock':
        return 'Habilidad';
      case 'interaction_talk':
        return 'Charla';
      default:
        return 'Recuerdo';
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        padding: '1.25rem',
        borderLeft: '3px solid rgba(245, 158, 11, 0.3)'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {getEventIcon(entry.type)}
          </div>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'var(--primary)'
          }}>
            {getEventLabel(entry.type)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {entry.emotion && (
            <EmotionBadge emotion={entry.emotion} />
          )}
          <span
            style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
            title={formatFullDate(entry.created_at)}
          >
            {formatRelativeTime(entry.created_at)}
          </span>
        </div>
      </div>

      <h4 style={{
        fontSize: '1.05rem',
        fontWeight: 700,
        color: 'var(--text-main)',
        margin: 0
      }}>
        {entry.title}
      </h4>

      <p style={{
        fontSize: '0.92rem',
        color: 'var(--text-muted)',
        lineHeight: 1.5,
        margin: 0
      }}>
        {entry.description}
      </p>
    </div>
  );
}
