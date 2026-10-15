import { useState } from 'react';
import { Heart, Sparkles, MessageCircle, Coffee, Send, ChevronDown, ChevronUp } from 'lucide-react';

export function InteractionBar({ onInteract, isLoading }) {
  const [talkMessage, setTalkMessage] = useState('');
  const [showTalkInput, setShowTalkInput] = useState(false);

  const handleAction = (type) => {
    if (isLoading) return;
    if (type === 'talk' && !showTalkInput) {
      setShowTalkInput(true);
      return;
    }
    onInteract(type, type === 'talk' ? talkMessage : '');
    if (type === 'talk') {
      setTalkMessage('');
      setShowTalkInput(false);
    }
  };

  const submitTalk = (e) => {
    e.preventDefault();
    if (isLoading) return;
    onInteract('talk', talkMessage);
    setTalkMessage('');
    setShowTalkInput(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* 4 Main Action Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.85rem',
        width: '100%'
      }}>
        {/* Acariciar */}
        <button
          className="action-card pet"
          disabled={isLoading}
          onClick={() => handleAction('pet')}
          title="Acariciar: aumenta felicidad y vínculo"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(236, 72, 153, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--emotion-affectionate)'
          }}>
            <Heart size={22} />
          </div>
          <span style={{ fontSize: '0.92rem' }}>Acariciar</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>+Vínculo +Felicidad</span>
        </button>

        {/* Jugar */}
        <button
          className="action-card play"
          disabled={isLoading}
          onClick={() => handleAction('play')}
          title="Jugar: aumenta felicidad y curiosidad, consume energía"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--emotion-happy)'
          }}>
            <Sparkles size={22} />
          </div>
          <span style={{ fontSize: '0.92rem' }}>Jugar</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>+Felicidad +XP</span>
        </button>

        {/* Hablar */}
        <button
          className="action-card talk"
          disabled={isLoading}
          onClick={() => handleAction('talk')}
          title="Hablar: comparte pensamientos y estimula la curiosidad"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--emotion-curious)'
          }}>
            <MessageCircle size={22} />
          </div>
          <span style={{ fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Hablar {showTalkInput ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>+Curiosidad +Vínculo</span>
        </button>

        {/* Cuidar */}
        <button
          className="action-card care"
          disabled={isLoading}
          onClick={() => handleAction('care')}
          title="Cuidar: recupera energía y reduce aburrimiento"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--emotion-sleepy)'
          }}>
            <Coffee size={22} />
          </div>
          <span style={{ fontSize: '0.92rem' }}>Cuidar</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>+Energía -Aburrimiento</span>
        </button>
      </div>

      {/* Expandable Message Box for "Hablar" */}
      {showTalkInput && (
        <form
          onSubmit={submitTalk}
          className="glass-card"
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.85rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <input
            type="text"
            placeholder="Escribe algo para decirle a tu Owlcat (opcional)..."
            value={talkMessage}
            onChange={(e) => setTalkMessage(e.target.value)}
            maxLength={200}
            autoFocus
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ padding: '0.75rem 1.2rem', whiteSpace: 'nowrap' }}
          >
            <Send size={16} />
            <span>Enviar</span>
          </button>
        </form>
      )}

      {isLoading && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <Sparkles size={14} className="animate-spin" />
          <span>Tu Owlcat está reaccionando...</span>
        </div>
      )}
    </div>
  );
}
