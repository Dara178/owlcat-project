import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '65vh',
      textAlign: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(245, 158, 11, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary)',
        marginBottom: '1.5rem'
      }}>
        <Compass size={32} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        404
      </h1>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.8rem' }}>
        Página no encontrada
      </h2>

      <p style={{ color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Parece que tu Owlcat voló demasiado lejos. La página que buscas no existe o ha cambiado de lugar.
      </p>

      <Link to="/" className="btn-primary" style={{ padding: '0.85rem 1.8rem' }}>
        <Home size={18} />
        <span>Volver al inicio</span>
      </Link>
    </div>
  );
}
