import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from './auth-context';
import { OwlcatContext } from './owlcat-context';
import { owlcatService } from '../services/owlcatService';

export function OwlcatProvider({ children }) {
  const { isAuthenticated, user } = useContext(AuthContext);

  const [owlcat, setOwlcat] = useState(null);
  const [skills, setSkills] = useState({ unlocked: [], locked: [] });
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalMeta, setJournalMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lastInteractionResult, setLastInteractionResult] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setFeedbackToast({ id: Date.now(), message, type });
  }, []);

  const closeToast = useCallback(() => {
    setFeedbackToast(null);
  }, []);

  const loadSkills = useCallback(async (owlcatId) => {
    const id = owlcatId || owlcat?.id;
    if (!id) return;
    try {
      const data = await owlcatService.getSkills(id);
      setSkills(data);
    } catch (err) {
      console.warn('Error cargando habilidades:', err);
    }
  }, [owlcat?.id]);

  const loadJournal = useCallback(async (owlcatId, page = 1) => {
    const id = owlcatId || owlcat?.id;
    if (!id) return;
    try {
      const { entries, meta } = await owlcatService.getJournal(id, page);
      setJournalEntries(entries);
      setJournalMeta(meta);
    } catch (err) {
      console.warn('Error cargando diario:', err);
    }
  }, [owlcat?.id]);

  const refreshOwlcat = useCallback(async () => {
    if (!isAuthenticated) return null;
    setIsLoading(true);
    try {
      const data = await owlcatService.getOwlcat(1);
      setOwlcat(data);
      if (data?.id) {
        await Promise.all([
          loadSkills(data.id),
          loadJournal(data.id, 1)
        ]);
      }
      return data;
    } catch (err) {
      if (err.status === 404) {
        setOwlcat(null);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, loadSkills, loadJournal]);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setOwlcat(null);
        setSkills({ unlocked: [], locked: [] });
        setJournalEntries([]);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      refreshOwlcat();
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user?.id, refreshOwlcat]);

  const adoptOwlcat = async (name) => {
    setIsLoading(true);
    try {
      const newOwlcat = await owlcatService.adopt(name);
      setOwlcat(newOwlcat);
      showToast(`¡Felicidades! Has adoptado a ${newOwlcat.name}.`, 'success');
      await Promise.all([
        loadSkills(newOwlcat.id),
        loadJournal(newOwlcat.id, 1)
      ]);
      return newOwlcat;
    } catch (err) {
      showToast(err.message || 'Error al adoptar el Owlcat.', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const interact = async (type, userMessage = '') => {
    if (!owlcat?.id) return null;
    setActionLoading(true);

    try {
      const result = await owlcatService.interact(owlcat.id, type, userMessage);
      
      if (result.owlcat) {
        setOwlcat(result.owlcat);
      }

      setLastInteractionResult(result);

      if (result.evolved) {
        setCelebration({
          type: 'evolved',
          title: `¡${owlcat.name} ha evolucionado!`,
          message: `Ahora está en la etapa de ${result.owlcat?.stage?.name || 'evolución'} con nuevas capacidades.`,
          stage: result.owlcat?.stage
        });
      } else if (result.level_up) {
        setCelebration({
          type: 'level_up',
          title: `¡Subiste al Nivel ${result.owlcat?.level?.number}!`,
          message: `${owlcat.name} ha crecido en experiencia y sabiduría.`,
          level: result.owlcat?.level
        });
      }

      if (result.unlocked_skills && result.unlocked_skills.length > 0) {
        const names = result.unlocked_skills.map(s => s.name).join(', ');
        showToast(`¡Nueva habilidad desbloqueada: ${names}!`, 'success');
      }

      loadSkills(owlcat.id);
      loadJournal(owlcat.id, 1);

      return result;
    } catch (err) {
      showToast(err.message || 'No se pudo realizar la interacción.', 'error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const closeCelebration = () => setCelebration(null);

  return (
    <OwlcatContext.Provider
      value={{
        owlcat,
        skills,
        journalEntries,
        journalMeta,
        isLoading,
        actionLoading,
        lastInteractionResult,
        celebration,
        feedbackToast,
        showToast,
        closeToast,
        closeCelebration,
        adoptOwlcat,
        interact,
        refreshOwlcat,
        loadJournal,
        loadSkills
      }}
    >
      {children}
    </OwlcatContext.Provider>
  );
}

export { OwlcatContext };
