
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';
import { signUp, signIn, signOut, getCurrentUser } from '@/api/auth';
import supabase from '@/lib/supabase';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (session?.user) {
          const userData = session.user.user_metadata;
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: userData.name || '',
            role: (userData.role as UserRole) || 'cliente',
            createdAt: session.user.created_at || '',
            customerId: userData.role === 'cliente' ? session.user.id : undefined,
            lastLogin: new Date().toISOString()
          });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData = session.user.user_metadata;
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: userData.name || '',
          role: (userData.role as UserRole) || 'cliente',
          createdAt: session.user.created_at || '',
          customerId: userData.role === 'cliente' ? session.user.id : undefined,
          lastLogin: new Date().toISOString()
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await signIn(email, password);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return true;
    } catch (error: any) {
      console.error("Login failed:", error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole = 'cliente'): Promise<boolean> => {
    try {
      const newUser = await signUp(email, password, name, role);
      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error: any) {
      console.error("Logout failed:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    } else {
      return user.role === roles;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
