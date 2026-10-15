import { storage } from '../utils/storage';
import { clamp } from '../utils/formatters';

const DEFAULT_STAGES = [
  { id: 1, code: 'hatchling', name: 'Polluelo', description: 'Un pequeño gato-búho recién nacido, curioso y adorable.', min_level: 1, max_level: 2 },
  { id: 2, code: 'young', name: 'Joven Explorador', description: 'Más ágil y avispado, con plumaje suave y reflejos veloces.', min_level: 3, max_level: 4 },
  { id: 3, code: 'companion', name: 'Compañero Místico', description: 'Una mascota sabia y profundamente vinculada con su cuidador.', min_level: 5, max_level: null }
];

const ALL_SKILLS = [
  { id: 1, code: 'soft_purr', name: 'Ronroneo Suave', description: 'Emite un ronroneo vibrante que calma la mente y eleva la felicidad.', required_level: 2, required_stage_id: 1 },
  { id: 2, code: 'curious_question', name: 'Pregunta Curiosa', description: 'Inclina la cabeza y pregunta algo inesperado con ojos brillantes.', required_level: 3, required_stage_id: 2 },
  { id: 3, code: 'playful_dash', name: 'Carrera Juguetona', description: 'Un salto acrobático repentino que ahuyenta todo aburrimiento.', required_level: 3, required_stage_id: 2 },
  { id: 4, code: 'emotional_memory', name: 'Memoria Empática', description: 'Recuerda tus mejores momentos juntos y fortalece el vínculo.', required_level: 5, required_stage_id: 3 }
];

function getInitialState() {
  const saved = storage.getMockData();
  if (saved) return saved;

  const initial = {
    users: [
      { id: 1, name: 'Cuidador', email: 'demo@owlcat.digital' }
    ],
    owlcat: null, // null until adopted
    journal: [],
    interactionsCount: 0
  };
  storage.setMockData(initial);
  return initial;
}

function calculateEmotion(stats, lastAction) {
  if (stats.energy <= 20) return 'sleepy';
  if (stats.happiness <= 25) return 'sad';
  if (stats.boredom >= 75) return 'bored';
  if (stats.bond >= 75 && (lastAction === 'pet' || lastAction === 'care')) return 'affectionate';
  if (stats.curiosity >= 70) return 'curious';
  if (stats.happiness >= 50) return 'happy';
  return 'neutral';
}

function getLevelInfo(totalXp) {
  if (totalXp >= 700) {
    return { number: 5, name: 'Compañero Místico', experience: totalXp, next_level_experience: 1000, stageId: 3 };
  }
  if (totalXp >= 450) {
    return { number: 4, name: 'Joven Sabio', experience: totalXp, next_level_experience: 700, stageId: 2 };
  }
  if (totalXp >= 250) {
    return { number: 3, name: 'Joven Explorador', experience: totalXp, next_level_experience: 450, stageId: 2 };
  }
  if (totalXp >= 100) {
    return { number: 2, name: 'Pequeño Aprendiz', experience: totalXp, next_level_experience: 250, stageId: 1 };
  }
  return { number: 1, name: 'Polluelo Curioso', experience: totalXp, next_level_experience: 100, stageId: 1 };
}

export const mockBackend = {
  getEvolutionStages: async () => {
    return { data: DEFAULT_STAGES };
  },

  register: async ({ name, email }) => {
    const state = getInitialState();
    const newUser = { id: Date.now(), name, email };
    state.users.push(newUser);
    storage.setMockData(state);
    return {
      data: {
        user: newUser,
        token: `mock-token-${Date.now()}`
      }
    };
  },

  login: async ({ email }) => {
    const state = getInitialState();
    let user = state.users.find(u => u.email === email);
    if (!user) {
      user = { id: Date.now(), name: email.split('@')[0], email };
      state.users.push(user);
    }
    storage.setMockData(state);
    return {
      data: {
        user,
        token: `mock-token-${Date.now()}`
      }
    };
  },

  getMe: async () => {
    const state = getInitialState();
    const user = storage.getUser() || state.users[0];
    return {
      data: {
        user,
        owlcat: state.owlcat
      }
    };
  },

  adopt: async (name) => {
    const state = getInitialState();
    const owlcat = {
      id: 1,
      name: name || 'Michi',
      emotion: 'happy',
      stats: {
        happiness: 60,
        energy: 70,
        curiosity: 65,
        boredom: 30,
        bond: 15
      },
      level: {
        number: 1,
        name: 'Polluelo Curioso',
        experience: 0,
        next_level_experience: 100
      },
      stage: DEFAULT_STAGES[0],
      skills: [],
      adopted_at: new Date().toISOString()
    };

    const firstEntry = {
      id: 1,
      owlcat_id: 1,
      type: 'adoption',
      title: '¡Bienvenido al mundo!',
      description: `Adoptaste a ${owlcat.name}. Empieza una hermosa aventura de amistad y evolución juntos.`,
      emotion: 'happy',
      created_at: new Date().toISOString()
    };

    state.owlcat = owlcat;
    state.journal = [firstEntry];
    storage.setMockData(state);

    return { data: owlcat };
  },

  getOwlcat: async () => {
    const state = getInitialState();
    if (!state.owlcat) {
      const error = new Error('No tienes un Owlcat adoptado todavía.');
      error.status = 404;
      throw error;
    }
    return { data: state.owlcat };
  },

  interact: async (owlcatId, type, userMessage = '') => {
    const state = getInitialState();
    if (!state.owlcat) {
      const error = new Error('Owlcat no encontrado.');
      error.status = 404;
      throw error;
    }

    const o = state.owlcat;
    const oldLevelNum = o.level.number;
    const oldStageCode = o.stage.code;

    // Modifiers from PRD-02 Section 10
    const mods = {
      pet:  { happiness: +8,  energy: 0,   curiosity: 0,   boredom: -5,  bond: +6, xp: 5 },
      play: { happiness: +15, energy: -12, curiosity: +8,  boredom: -20, bond: +5, xp: 15 },
      talk: { happiness: +5,  energy: -2,  curiosity: +12, boredom: -8,  bond: +8, xp: 10 },
      care: { happiness: +8,  energy: +15, curiosity: 0,   boredom: -10, bond: +5, xp: 8 }
    }[type] || { happiness: 0, energy: 0, curiosity: 0, boredom: 0, bond: 0, xp: 0 };

    // Apply stats
    o.stats.happiness = clamp(o.stats.happiness + mods.happiness);
    o.stats.energy    = clamp(o.stats.energy + mods.energy);
    o.stats.curiosity = clamp(o.stats.curiosity + mods.curiosity);
    o.stats.boredom   = clamp(o.stats.boredom + mods.boredom);
    o.stats.bond      = clamp(o.stats.bond + mods.bond);

    // Calculate emotion
    o.emotion = calculateEmotion(o.stats, type);

    // XP and level
    const newTotalXp = (o.level.experience || 0) + mods.xp;
    const levelInfo = getLevelInfo(newTotalXp);
    o.level = levelInfo;

    // Check stage change
    const newStage = DEFAULT_STAGES.find(s => s.id === levelInfo.stageId) || DEFAULT_STAGES[0];
    o.stage = newStage;

    const events = [];
    const levelUp = levelInfo.number > oldLevelNum;
    const evolved = newStage.code !== oldStageCode;

    if (levelUp) {
      events.push({ type: 'level_up', level: levelInfo.number });
    }
    if (evolved) {
      events.push({ type: 'evolved', stage: newStage });
    }

    // Check skill unlocks
    const unlockedNow = [];
    const currentSkillCodes = new Set((o.skills || []).map(s => s.code));

    ALL_SKILLS.forEach(sk => {
      if (!currentSkillCodes.has(sk.code)) {
        if (sk.required_level <= o.level.number && (!sk.required_stage_id || sk.required_stage_id <= newStage.id)) {
          const unlockedSkill = { ...sk, unlocked_at: new Date().toISOString() };
          o.skills.push(unlockedSkill);
          unlockedNow.push(unlockedSkill);
        }
      }
    });

    // Custom interaction messages
    let responseMessage;
    switch (type) {
      case 'pet':
        responseMessage = `Acariciaste suavemente a ${o.name}. ¡Siente mucha calidez y ronronea plácidamente!`;
        break;
      case 'play':
        responseMessage = `¡${o.name} persiguió una pluma mágica y saltó por todos lados con alegría!`;
        break;
      case 'talk':
        responseMessage = userMessage 
          ? `Le dijiste: "${userMessage}". ${o.name} inclinó la cabeza con gran curiosidad y maulló en respuesta.`
          : `Le hablaste con cariño a ${o.name}. Te escuchó atentamente con sus ojos brillantes.`;
        break;
      case 'care':
        responseMessage = `Cuidaste a ${o.name} con un reconfortante descanso y snacks saludables. Recuperó energía.`;
        break;
      default:
        responseMessage = `${o.name} interactuó contigo con curiosidad.`;
    }

    // Add journal entries
    const newEntries = [];
    if (levelUp) {
      newEntries.push({
        id: Date.now() + 1,
        owlcat_id: o.id,
        type: 'level_up',
        title: `¡Subió al Nivel ${levelInfo.number}!`,
        description: `${o.name} ha ganado suficiente experiencia y ha alcanzado el nivel ${levelInfo.number} (${levelInfo.name}).`,
        emotion: 'happy',
        created_at: new Date().toISOString()
      });
    }

    if (evolved) {
      newEntries.push({
        id: Date.now() + 2,
        owlcat_id: o.id,
        type: 'evolution',
        title: `¡Evolución a ${newStage.name}!`,
        description: `Un resplandor brillante rodeó a ${o.name}. ¡Ha alcanzado la etapa de ${newStage.name}!`,
        emotion: 'curious',
        created_at: new Date().toISOString()
      });
    }

    unlockedNow.forEach(sk => {
      newEntries.push({
        id: Date.now() + 3 + Math.random(),
        owlcat_id: o.id,
        type: 'skill_unlock',
        title: `Nueva Habilidad: ${sk.name}`,
        description: `${o.name} aprendió "${sk.name}": ${sk.description}`,
        emotion: 'happy',
        created_at: new Date().toISOString()
      });
    });

    // Regular journal entry every few interactions or for talk with text
    state.interactionsCount = (state.interactionsCount || 0) + 1;
    if (userMessage || state.interactionsCount % 3 === 0) {
      newEntries.push({
        id: Date.now(),
        owlcat_id: o.id,
        type: `interaction_${type}`,
        title: type === 'talk' ? 'Conversación especial' : `Momento de ${type}`,
        description: responseMessage,
        emotion: o.emotion,
        created_at: new Date().toISOString()
      });
    }

    state.journal = [...newEntries, ...(state.journal || [])];
    state.owlcat = o;
    storage.setMockData(state);

    return {
      data: {
        interaction: { id: Date.now(), type, experience_gained: mods.xp },
        owlcat: o,
        message: responseMessage,
        events,
        unlocked_skills: unlockedNow,
        level_up: levelUp,
        evolved: evolved
      }
    };
  },

  getJournal: async () => {
    const state = getInitialState();
    return {
      data: state.journal || [],
      meta: {
        total: (state.journal || []).length,
        current_page: 1,
        last_page: 1
      }
    };
  },

  getSkills: async () => {
    const state = getInitialState();
    const owlcat = state.owlcat;
    const unlockedCodes = new Set((owlcat?.skills || []).map(s => s.code));

    const unlocked = [];
    const locked = [];

    ALL_SKILLS.forEach(sk => {
      if (unlockedCodes.has(sk.code)) {
        const matching = owlcat.skills.find(s => s.code === sk.code);
        unlocked.push(matching || sk);
      } else {
        locked.push({
          ...sk,
          required_stage_name: DEFAULT_STAGES.find(s => s.id === sk.required_stage_id)?.name
        });
      }
    });

    return {
      data: {
        unlocked,
        locked
      }
    };
  }
};
