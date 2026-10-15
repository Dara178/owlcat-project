import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwlcat } from '../hooks/useOwlcat';
import { Heart, Sparkles, Wand2 } from 'lucide-react';
import owlcatImg from '../assets/owlcat-reference.jpg';

const SUGGESTED_NAMES = ['Michi', 'Plumitas', 'Aura', 'Nyx', 'Kiko', 'Lumos', 'Chispita'];

export function AdoptPage() {
  const { owlcat, adoptOwlcat, isLoading: contextLoading } = useOwlcat();
  const [name, setName] = useState('Michi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already adopted, redirect straight to dashboard
  useEffect(() => {
    if (owlcat && !contextLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [owlcat, contextLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa un nombre para tu Owlcat.');
      return;
    }
    if (name.length > 50) {
      setError('El nombre no debe superar los 50 caracteres.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await adoptOwlcat(name.trim());
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al adoptar el Owlcat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickRandomName = () => {
    const random = SUGGESTED_NAMES[Math.floor(Math.random() * SUGGESTED_NAMES.length)];
    setName(random);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '75vh',
      padding: '1rem 0'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Animated Adoption Avatar */}
        <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 1.5rem' }}>
          <div style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
            filter: 'blur(15px)'
          }} />

          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--primary)',
            boxShadow: '0 0 25px var(--primary-glow)',
            position: 'relative'
          }}>
            <img
              src={owlcatImg}
              alt="Owlcat Polluelo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '10px',
            background: 'var(--emotion-affectionate)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px rgba(236, 72, 153, 0.6)'
          }}>
            <Heart size={20} />
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.4rem'
        }}>
          <Sparkles size={16} />
          <span>Ceremonia de Adopción</span>
        </div>

        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          ¡Dale un nombre a tu compañero!
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.8rem', lineHeight: 1.5 }}>
          Un pequeño Polluelo ha nacido en el mundo digital y busca a alguien especial para crecer y aprender juntos.
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            color: '#ef4444',
            fontSize: '0.88rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                required
                maxLength={50}
                placeholder="Nombre de tu Owlcat (ej. Michi)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ fontSize: '1.1rem', textAlign: 'center', fontWeight: 600 }}
                disabled={isSubmitting}
                autoFocus
              />
              <button
                type="button"
                className="btn-outline"
                onClick={pickRandomName}
                title="Elegir nombre al azar"
                disabled={isSubmitting}
                style={{ padding: '0 1rem' }}
              >
                <Wand2 size={18} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.3rem' }}>
              Sugerencias:
            </span>
            {SUGGESTED_NAMES.slice(0, 5).map(sug => (
              <button
                key={sug}
                type="button"
                onClick={() => setName(sug)}
                className="btn-ghost"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.2rem 0.6rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {sug}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <Sparkles size={18} className="animate-spin" /> Conectando almas digitales...
              </span>
            ) : (
              `¡Adoptar a ${name || 'mi Owlcat'}!`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
