import { useContext } from 'react';
import { OwlcatContext } from '../contexts/OwlcatContext';

export function useOwlcat() {
  const context = useContext(OwlcatContext);
  if (!context) {
    throw new Error('useOwlcat must be used within an OwlcatProvider');
  }
  return context;
}
