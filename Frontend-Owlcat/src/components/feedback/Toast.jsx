import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={20} color="var(--success)" />,
    error: <AlertCircle size={20} color="var(--error)" />,
    warning: <AlertTriangle size={20} color="var(--warning)" />,
    info: <Info size={20} color="var(--info)" />
  };

  const borderColors = {
    success: 'var(--success)',
    error: 'var(--error)',
    warning: 'var(--warning)',
    info: 'var(--info)'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${borderColors[toast.type] || 'var(--border-glass)'}`,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
      padding: '0.85rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-main)',
      maxWidth: '420px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {icons[toast.type] || icons.info}
      <span style={{ fontSize: '0.9rem', flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          padding: '2px'
        }}
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
