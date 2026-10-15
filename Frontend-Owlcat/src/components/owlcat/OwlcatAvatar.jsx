import { useState, useEffect } from 'react';
import owlcatImg from '../../assets/owlcat-reference.jpg';
import { getEmotionDetails } from '../../utils/emotion';

export function OwlcatAvatar({ emotion = 'happy', lastAction = null, stage = null, isInteracting = false }) {
  const [particles, setParticles] = useState([]);
  const emotionInfo = getEmotionDetails(emotion);

  // Trigger floating particles when an action happens
  useEffect(() => {
    if (!lastAction) return;

    const actionType = lastAction.type;
    const count = 4;
    const newParticles = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        type: actionType,
        left: 25 + Math.random() * 50,
        delay: i * 150
      });
    }

    const timer = setTimeout(() => {
      setParticles(newParticles);
    }, 10);

    const clearTimer = setTimeout(() => setParticles([]), 1800);
    return () => {
      clearTimeout(timer);
      clearTimeout(clearTimer);
    };
  }, [lastAction]);

  // Determine avatar animation class
  let animClass = 'anim-idle';
  if (isInteracting) {
    animClass = 'anim-bounce';
  } else if (emotion === 'happy') {
    animClass = 'anim-happy';
  } else if (emotion === 'curious') {
    animClass = 'anim-curious';
  } else if (emotion === 'affectionate') {
    animClass = 'anim-affectionate';
  } else if (emotion === 'sleepy') {
    animClass = 'anim-sleepy';
  } else if (emotion === 'sad') {
    animClass = 'anim-sad';
  }

  return (
    <div style={{
      position: 'relative',
      width: '260px',
      height: '260px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Dynamic Emotion Glow Background */}
      <div style={{
        position: 'absolute',
        inset: '-10px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${emotionInfo.textColor}33 0%, transparent 70%)`,
        filter: 'blur(20px)',
        transition: 'background 0.8s ease',
        pointerEvents: 'none'
      }} />

      {/* Outer Ring with Stage styling */}
      <div style={{
        position: 'absolute',
        inset: '8px',
        borderRadius: '50%',
        border: `2px dashed ${emotionInfo.textColor}60`,
        animation: 'rotateSlow 30s linear infinite',
        pointerEvents: 'none'
      }} />

      {/* Main Avatar Character Container */}
      <div
        className={`owlcat-character ${animClass}`}
        style={{
          position: 'relative',
          width: '210px',
          height: '210px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: `0 12px 35px rgba(0, 0, 0, 0.5), 0 0 25px ${emotionInfo.textColor}40`,
          border: `3px solid ${emotionInfo.textColor}80`,
          background: '#1e293b'
        }}
      >
        <img
          src={owlcatImg}
          alt="Owlcat Companion"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            transition: 'filter 0.5s ease, transform 0.5s ease'
          }}
        />

        {/* Emotion Overlay Tint */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, transparent 40%, ${emotionInfo.textColor}25 100%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none'
        }} />

        {/* Sleepy Eyes Overlay */}
        {emotion === 'sleepy' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(1px)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
        )}
      </div>

      {/* Floating Action Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            bottom: '60px',
            left: `${p.left}%`,
            pointerEvents: 'none',
            fontSize: '1.4rem',
            animation: 'floatUpParticle 1.4s ease-out forwards',
            animationDelay: `${p.delay}ms`,
            zIndex: 10
          }}
        >
          {p.type === 'pet' && '💖'}
          {p.type === 'play' && '⭐'}
          {p.type === 'talk' && '✨'}
          {p.type === 'care' && '💤'}
        </div>
      ))}

      {/* Stage Badge Bottom Tag */}
      {stage && (
        <div style={{
          position: 'absolute',
          bottom: '-6px',
          background: 'rgba(15, 23, 42, 0.9)',
          border: `1px solid ${emotionInfo.textColor}80`,
          color: emotionInfo.textColor,
          borderRadius: 'var(--radius-full)',
          padding: '0.25rem 0.8rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
          zIndex: 5
        }}>
          {stage.name}
        </div>
      )}

      <style>{`
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatUpParticle {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          20% { opacity: 1; transform: translateY(-15px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.9); }
        }
        .anim-idle {
          animation: breathFloat 4s ease-in-out infinite;
        }
        .anim-happy {
          animation: happyHop 1.8s ease-in-out infinite;
        }
        .anim-curious {
          animation: curiousTilt 3.5s ease-in-out infinite;
        }
        .anim-affectionate {
          animation: affectionatePulse 2s ease-in-out infinite;
        }
        .anim-sleepy {
          animation: sleepySway 5s ease-in-out infinite;
        }
        .anim-sad {
          animation: sadSlump 4.5s ease-in-out infinite;
        }
        .anim-bounce {
          animation: happyHop 0.7s ease-in-out infinite;
        }

        @keyframes breathFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.02); }
        }
        @keyframes happyHop {
          0%, 100% { transform: translateY(0) scale(1); }
          35% { transform: translateY(-12px) scale(1.04, 0.97); }
          60% { transform: translateY(0) scale(0.98, 1.02); }
        }
        @keyframes curiousTilt {
          0%, 100% { transform: rotate(0deg) scale(1); }
          30% { transform: rotate(-5deg) translateY(-4px) scale(1.02); }
          70% { transform: rotate(4deg) translateY(-2px) scale(1.01); }
        }
        @keyframes affectionatePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 15px #ec4899); }
        }
        @keyframes sleepySway {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.95; }
          50% { transform: translateY(3px) rotate(1.5deg); opacity: 0.85; }
        }
        @keyframes sadSlump {
          0%, 100% { transform: translateY(0) scale(0.98); opacity: 0.88; }
          50% { transform: translateY(4px) scale(0.96); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
