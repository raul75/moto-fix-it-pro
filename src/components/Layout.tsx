
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import LanguageSelector from '@/components/LanguageSelector';
import { 
  Home, 
  Users, 
  Package, 
  FileText, 
  Camera, 
  Settings, 
  LogOut,
  Wrench,
  MotorcycleIcon as Bike
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout, hasRole } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Navigation items per admin e tecnici
  const adminNavItems = [
    { 
      path: '/dashboard', 
      label: t('app.nav.dashboard'), 
      icon: Home 
    },
    { 
      path: '/customers', 
      label: t('app.nav.customers'), 
      icon: Users,
      roles: ['admin', 'tecnico']
    },
    { 
      path: '/repairs', 
      label: 'Riparazioni', 
      icon: Wrench,
      roles: ['admin', 'tecnico']
    },
    { 
      path: '/inventory', 
      label: t('app.nav.inventory'), 
      icon: Package,
      roles: ['admin', 'tecnico']
    },
    { 
      path: '/invoices', 
      label: t('app.nav.invoices'), 
      icon: FileText,
      roles: ['admin', 'tecnico']
    },
    { 
      path: '/photos', 
      label: t('app.nav.photos'), 
      icon: Camera,
      roles: ['admin', 'tecnico']
    },
    { 
      path: '/settings', 
      label: t('app.nav.settings'), 
      icon: Settings,
      roles: ['admin']
    }
  ];

  // Navigation items per clienti
  const customerNavItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: Home 
    },
    { 
      path: '/my-motorcycles', 
      label: 'Le Mie Moto', 
      icon: Bike 
    },
    { 
      path: '/my-repairs', 
      label: 'Le Mie Riparazioni', 
      icon: Wrench 
    },
    { 
      path: '/my-invoices', 
      label: 'Le Mie Fatture', 
      icon: FileText 
    }
  ];

  const navItems = hasRole('cliente') ? customerNavItems : adminNavItems;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary">MotoFix</h1>
            {user && (
              <span className="text-sm text-muted-foreground">
                {user.name} ({hasRole('admin') ? 'Admin' : hasRole('tecnico') ? 'Tecnico' : 'Cliente'})
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/30 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              // Check if user has required role for this nav item
              if (item.roles && !hasRole(item.roles)) {
                return null;
              }

              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
