export const emotionPresentation = {
  happy: {
    label: 'Feliz',
    color: 'var(--emotion-happy)',
    bg: 'var(--emotion-happy-bg)',
    textColor: '#10b981',
    animation: 'happy',
    icon: 'Smile',
    description: 'Se siente alegre y lleno de vitalidad.',
    defaultQuote: '¡Me alegra mucho estar contigo!'
  },
  sad: {
    label: 'Triste',
    color: 'var(--emotion-sad)',
    bg: 'var(--emotion-sad-bg)',
    textColor: '#3b82f6',
    animation: 'sad',
    icon: 'Frown',
    description: 'Necesita un poco de cariño y atención.',
    defaultQuote: 'Me siento un poco decaído... ¿me acaricias?'
  },
  bored: {
    label: 'Aburrido',
    color: 'var(--emotion-bored)',
    bg: 'var(--emotion-bored-bg)',
    textColor: '#94a3b8',
    animation: 'idle',
    icon: 'Meh',
    description: 'Bosteza y busca algo emocionante que hacer.',
    defaultQuote: 'Qué aburrido... ¿y si jugamos un rato?'
  },
  curious: {
    label: 'Curioso',
    color: 'var(--emotion-curious)',
    bg: 'var(--emotion-curious-bg)',
    textColor: '#f59e0b',
    animation: 'curious',
    icon: 'Compass',
    description: 'Observa todo con sus grandes ojos atentos.',
    defaultQuote: '¡Tengo tantas preguntas sobre el mundo!'
  },
  affectionate: {
    label: 'Afectuoso',
    color: 'var(--emotion-affectionate)',
    bg: 'var(--emotion-affectionate-bg)',
    textColor: '#ec4899',
    animation: 'affectionate',
    icon: 'Heart',
    description: 'Siente un vínculo muy fuerte contigo y ronronea.',
    defaultQuote: '¡Prrr... eres mi persona favorita!'
  },
  sleepy: {
    label: 'Con sueño',
    color: 'var(--emotion-sleepy)',
    bg: 'var(--emotion-sleepy-bg)',
    textColor: '#8b5cf6',
    animation: 'sleepy',
    icon: 'Moon',
    description: 'Sus párpados pesan y necesita descansar.',
    defaultQuote: 'Zzz... necesito una siestita reparadora...'
  },
  neutral: {
    label: 'Tranquilo',
    color: 'var(--accent-sky)',
    bg: 'rgba(6, 182, 212, 0.15)',
    textColor: '#06b6d4',
    animation: 'idle',
    icon: 'Sun',
    description: 'Descansa plácidamente en equilibrio.',
    defaultQuote: 'Todo está tranquilo hoy.'
  }
};

export function getEmotionDetails(emotionKey) {
  const key = (emotionKey || 'happy').toLowerCase();
  return emotionPresentation[key] || emotionPresentation.happy;
}
