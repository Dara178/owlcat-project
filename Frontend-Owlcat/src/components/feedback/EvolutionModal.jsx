import { Sparkles, Trophy, Star } from 'lucide-react';

export function EvolutionModal({ celebration, onClose }) {
  if (!celebration) return null;

  const isEvolution = celebration.type === 'evolved';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(15, 23, 42, 0.82)',
      backdropFilter: 'blur(10px)',
      padding: '1rem',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 0 50px rgba(245, 158, 11, 0.35)',
        animation: 'popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <div style={{
          width: '76px',
          height: '76px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          background: isEvolution 
            ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' 
            : 'linear-gradient(135deg, #f59e0b, #eab308)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: isEvolution 
            ? '0 0 30px rgba(139, 92, 246, 0.6)' 
            : '0 0 30px rgba(245, 158, 11, 0.6)',
          animation: 'pulseGlow 2s infinite'
        }}>
          {isEvolution ? <Trophy size={40} /> : <Star size={40} />}
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
          marginBottom: '0.5rem'
        }}>
          <Sparkles size={16} />
          {isEvolution ? '¡GRAN EVOLUCIÓN!' : '¡NUEVO LOGRO!'}
        </div>

        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          marginBottom: '0.8rem',
          lineHeight: 1.2
        }}>
          {celebration.title}
        </h2>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          marginBottom: '2rem',
          lineHeight: 1.5
        }}>
          {celebration.message}
        </p>

        {isEvolution && celebration.stage && (
          <div style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.3rem' }}>
              Etapa: {celebration.stage.name}
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
              {celebration.stage.description}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
        >
          ¡Continuar con mi Owlcat!
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
