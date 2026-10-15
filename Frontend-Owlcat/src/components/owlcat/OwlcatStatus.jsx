import { OwlcatAvatar } from './OwlcatAvatar';
import { EmotionBadge } from './EmotionBadge';
import { getEmotionDetails } from '../../utils/emotion';

export function OwlcatStatus({ owlcat, lastResult, isInteracting }) {
  const emotion = owlcat?.emotion || 'happy';
  const emotionInfo = getEmotionDetails(emotion);
  const speechText = lastResult?.message || emotionInfo.defaultQuote;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.25rem',
      position: 'relative'
    }}>
      {/* Header Info: Name & Emotion */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          letterSpacing: '-0.5px'
        }}>
          {owlcat?.name || 'Owlcat'}
        </h1>
        <EmotionBadge emotion={emotion} />
      </div>

      {/* Speech Bubble */}
      <div style={{
        position: 'relative',
        background: 'rgba(30, 41, 59, 0.92)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.9rem 1.4rem',
        maxWidth: '440px',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        animation: 'bubblePop 0.3s ease-out'
      }}>
        <p style={{
          fontSize: '0.96rem',
          color: 'var(--text-main)',
          lineHeight: 1.45,
          fontStyle: 'italic'
        }}>
          "{speechText}"
        </p>

        {/* Speech Bubble Pointer */}
        <div style={{
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '16px',
          height: '16px',
          background: 'rgba(30, 41, 59, 0.92)',
          borderRight: '1px solid var(--border-glass)',
          borderBottom: '1px solid var(--border-glass)'
        }} />
      </div>

      {/* Avatar Container */}
      <OwlcatAvatar
        emotion={emotion}
        lastAction={lastResult?.interaction}
        stage={owlcat?.stage}
        isInteracting={isInteracting}
      />

      <style>{`
        @keyframes bubblePop {
          0% { transform: scale(0.95); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
