
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole | UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();
  const location = useLocation();

  // Se sta ancora caricando, non renderizza nulla
  if (isLoading) {
    return null;
  }

  // Se l'utente non è autenticato, reindirizzalo alla pagina di login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se sono specificati dei ruoli ma l'utente non ha uno di questi ruoli,
  // reindirizzalo alla pagina di accesso negato
  if (roles && !hasRole(roles)) {
    return <Navigate to="/accesso-negato" replace />;
  }

  // Altrimenti mostra il componente figlio
  return <>{children}</>;
};

export default ProtectedRoute;

