export function clamp(val, min = 0, max = 100) {
  const n = Number(val);
  if (isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

export function formatRelativeTime(dateString) {
  if (!dateString) return 'Recientemente';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recientemente';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return 'Hace un momento';
  if (diffInSeconds < 60) return `Hace ${diffInSeconds} s`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} m`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} h`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays} días`;

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatFullDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatLabel(statKey) {
  const map = {
    happiness: 'Felicidad',
    energy: 'Energía',
    curiosity: 'Curiosidad',
    boredom: 'Aburrimiento',
    bond: 'Vínculo'
  };
  return map[statKey] || statKey;
}

export function getStatColor(statKey, value) {
  if (statKey === 'boredom') {
    // Boredom is inverse (lower is better)
    if (value > 70) return '#ef4444'; // red
    if (value > 40) return '#f59e0b'; // orange
    return '#10b981'; // green
  }
  if (value < 25) return '#ef4444';
  if (value < 60) return '#f59e0b';
  return '#10b981';
}
