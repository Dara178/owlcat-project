import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOwlcat } from '../../hooks/useOwlcat';
import { useApiStatus } from '../../hooks/useApi';
import { Toast } from '../feedback/Toast';
import { EvolutionModal } from '../feedback/EvolutionModal';
import { Sparkles, BookOpen, Award, LogOut, User, Wifi, WifiOff } from 'lucide-react';
import owlcatLogo from '../../assets/hero.png';

export function AppShell() {
  const { user, logout } = useAuth();
  const { owlcat, celebration, closeCelebration, feedbackToast, closeToast } = useOwlcat();
  const { isOnline } = useApiStatus();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '0.75rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Brand Logo */}
          <NavLink
            to={owlcat ? "/dashboard" : "/"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: 'var(--text-main)',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.5px'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px var(--primary-glow)'
            }}>
              <img src={owlcatLogo} alt="Owlcat Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            </div>
            <span>Owlcat<span style={{ color: 'var(--primary)' }}>Digital</span></span>
          </NavLink>

          {/* Navigation Links (when pet exists or authenticated) */}
          {user && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <NavLink
                to="/dashboard"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <Sparkles size={16} />
                <span>Mascota</span>
              </NavLink>

              <NavLink
                to="/journal"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <BookOpen size={16} />
                <span>Diario</span>
              </NavLink>

              <NavLink
                to="/skills"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <Award size={16} />
                <span>Habilidades</span>
              </NavLink>
            </nav>
          )}

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Backend API Status Pill */}
            <div
              title={isOnline ? "Conectado a la API Laravel" : "Modo Local / Demo activo (Backend desconectado)"}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isOnline ? 'var(--success)' : 'var(--warning)',
                background: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isOnline ? 'Laravel API' : 'Modo Demo'}</span>
            </div>

            {user ? (
              <>
                {/* User & Pet badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}>
                  <User size={15} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>{user.name}</span>
                  {owlcat && (
                    <span style={{
                      background: 'var(--primary)',
                      color: '#0f172a',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      Nv.{owlcat.level?.number || 1}
                    </span>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn-ghost"
                  title="Cerrar sesión"
                  style={{ padding: '0.45rem 0.7rem' }}
                >
                  <LogOut size={16} />
                  <span style={{ display: 'none', sm: 'inline' }}>Salir</span>
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <NavLink to="/login" className="btn-outline" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                  Iniciar sesión
                </NavLink>
                <NavLink to="/register" className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                  Adoptar
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '1.5rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>

      {/* Global Feedback: Toast & Evolution Celebration Modal */}
      <Toast toast={feedbackToast} onClose={closeToast} />
      <EvolutionModal celebration={celebration} onClose={closeCelebration} />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        background: 'rgba(15, 23, 42, 0.5)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Owlcat Digital &copy; 2026 — Mascota Virtual Evolutiva</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Frontend SPA Vite + React 19</span>
            <span>•</span>
            <span>REST API Ready</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
