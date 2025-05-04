
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Dati di esempio per gli utenti
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@motofix.it",
    password: "admin123",
    name: "Amministratore",
    role: "admin" as UserRole,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "tecnico@motofix.it",
    password: "tecnico123",
    name: "Tecnico Demo",
    role: "tecnico" as UserRole,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "cliente@motofix.it",
    password: "cliente123",
    name: "Cliente Demo",
    role: "cliente" as UserRole,
    customerId: "1", // ID collegato a un cliente esistente
    createdAt: new Date().toISOString(),
  }
];

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  isAuthenticated: false,
  hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    // Controlla se esiste un utente nel localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In un'app reale qui ci sarebbe una chiamata API
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        toast.error(t('auth.loginError'));
        return false;
      }
      
      // Crea oggetto utente senza la password
      const { password: _, ...userWithoutPassword } = foundUser;
      const authenticatedUser = {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString()
      };
      
      // Salva l'utente nel localStorage e nello stato
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      
      toast.success(t('auth.loginSuccess'));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t('auth.loginError'));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    toast.success(t('auth.logoutSuccess'));
  };

  const register = async (email: string, password: string, name: string, role: UserRole = 'cliente'): Promise<boolean> => {
    try {
      // Verifica che l'email non sia già in uso
      const emailExists = MOCK_USERS.some(u => u.email === email);
      
      if (emailExists) {
        toast.error(t('auth.emailInUse'));
        return false;
      }
      
      // In un'app reale qui ci sarebbe una chiamata API
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        email,
        password,
        name,
        role,
        createdAt: new Date().toISOString()
      };
      
      // Aggiunge l'utente all'array (simulazione)
      // MOCK_USERS.push(newUser);
      
      toast.success(t('auth.registerSuccess'));
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t('auth.registerError'));
      return false;
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        logout, 
        register, 
        isAuthenticated: !!user,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

