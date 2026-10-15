import { Smile, Frown, Meh, Compass, Heart, Moon, Sun } from 'lucide-react';
import { getEmotionDetails } from '../../utils/emotion';

export function EmotionBadge({ emotion, showDescription = false }) {
  const details = getEmotionDetails(emotion);

  const icons = {
    Smile: <Smile size={16} />,
    Frown: <Frown size={16} />,
    Meh: <Meh size={16} />,
    Compass: <Compass size={16} />,
    Heart: <Heart size={16} />,
    Moon: <Moon size={16} />,
    Sun: <Sun size={16} />
  };

  const iconElement = icons[details.icon] || <Smile size={16} />;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: details.bg,
          color: details.textColor,
          border: `1px solid ${details.textColor}40`,
          borderRadius: 'var(--radius-full)',
          padding: '0.35rem 0.85rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: `0 0 12px ${details.textColor}25`
        }}
        title={details.description}
      >
        {iconElement}
        <span>{details.label}</span>
      </span>
      {showDescription && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          {details.description}
        </span>
      )}
    </div>
  );
}
