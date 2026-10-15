import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOwlcat } from '../hooks/useOwlcat';
import { Sparkles, Heart, Zap, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import owlcatImg from '../assets/owlcat-reference.jpg';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { owlcat } = useOwlcat();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', padding: '2rem 0' }}>
      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--primary)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            width: 'fit-content',
            fontSize: '0.88rem',
            fontWeight: 700
          }}>
            <Sparkles size={16} />
            <span>Mascota Virtual Evolutiva</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            color: 'var(--text-main)'
          }}>
            Tu compañero digital que <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>siente y evoluciona</span> contigo.
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '520px'
          }}>
            Owlcat Digital es una pequeña criatura mitad búho y mitad gato.
            Interactúa, juega, habla y cuídala día a día para desbloquear habilidades místicas y forjar un vínculo inquebrantable.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {isAuthenticated ? (
              <button
                onClick={() => navigate(owlcat ? '/dashboard' : '/adopt')}
                className="btn-primary"
                style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}
              >
                <span>{owlcat ? 'Ir a mi Owlcat' : 'Adoptar ahora'}</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}
                >
                  <span>Adoptar mi Owlcat</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="btn-outline"
                  style={{ padding: '0.9rem 1.8rem', fontSize: '1.05rem' }}
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Visual Preview */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Glowing Backlight */}
          <div style={{
            position: 'absolute',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 75%)',
            filter: 'blur(35px)',
            pointerEvents: 'none'
          }} />

          <div className="glass-panel animate-float" style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            maxWidth: '360px',
            width: '100%',
            position: 'relative'
          }}>
            <div style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)',
              border: '3px solid rgba(245, 158, 11, 0.7)'
            }}>
              <img
                src={owlcatImg}
                alt="Owlcat Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Michi Polluelo</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                Etapa 1 · Nivel 1
              </span>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}>
              <span>💖 Vínculo: 15%</span>
              <span>•</span>
              <span>⚡ Energía: 70%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            ¿Qué hace a Owlcat tan especial?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
            Un sistema emocional vivo respaldado por arquitectura transaccional
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          <div className="glass-card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(236, 72, 153, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--emotion-affectionate)',
              marginBottom: '1rem'
            }}>
              <Heart size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Sistema Emocional Real
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Reacciona a 7 estados de ánimo: feliz, curioso, afectuoso, triste, aburrido o con sueño, según cómo lo trates.
            </p>
          </div>

          <div className="glass-card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '1rem'
            }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Evolución y Niveles
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Acumula experiencia en cada interacción. Observa cómo crece de Polluelo a Joven Explorador y Compañero Místico.
            </p>
          </div>

          <div className="glass-card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
              marginBottom: '1rem'
            }}>
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Diario Emocional
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Cada momento especial, subida de nivel y diálogo queda inmortalizado en un diario automático con fecha y emoción.
            </p>
          </div>

          <div className="glass-card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(20, 184, 166, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-teal)',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Habilidades Mágicas
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Desbloquea habilidades únicas como Ronroneo Suave, Pregunta Curiosa y Memoria Empática a medida que profundizas tu lazo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
