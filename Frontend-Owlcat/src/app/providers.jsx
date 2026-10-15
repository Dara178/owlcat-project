import { AuthProvider } from '../contexts/AuthContext';
import { OwlcatProvider } from '../contexts/OwlcatContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <OwlcatProvider>
        {children}
      </OwlcatProvider>
    </AuthProvider>
  );
}
