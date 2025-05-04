import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Wrench, Users, Package, Receipt, Camera, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const getRoleBadgeColor = () => {
    if (!user) return 'bg-secondary';
    
    switch (user.role) {
      case 'admin':
        return 'bg-red-500 text-white';
      case 'tecnico':
        return 'bg-blue-500 text-white';
      case 'cliente':
        return 'bg-green-500 text-white';
      default:
        return 'bg-secondary';
    }
  };

  const getRoleLabel = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'admin':
        return t('roles.admin');
      case 'tecnico':
        return t('roles.technician');
      case 'cliente':
        return t('roles.customer');
      default:
        return user.role;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold">{t('app.title')}</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                    : 'hover:bg-muted'
                }`}
              >
                <Wrench className="h-5 w-5" />
                <span>{t('app.nav.dashboard')}</span>
              </NavLink>
            </li>
            
            {hasRole(['admin', 'tecnico']) && (
              <>
                <li>
                  <NavLink
                    to="/customers"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/customers')
                        ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>{t('app.nav.customers')}</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/inventory"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/inventory')
                        ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Package className="h-5 w-5" />
                    <span>{t('app.nav.inventory')}</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/invoices"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/invoices')
                        ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Receipt className="h-5 w-5" />
                    <span>{t('app.nav.invoices')}</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/photos"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/photos')
                        ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Camera className="h-5 w-5" />
                    <span>{t('app.nav.photos')}</span>
                  </NavLink>
                </li>
              </>
            )}
            
            {hasRole('admin') && (
              <li>
                <NavLink
                  to="/settings"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/settings')
                      ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                      : 'hover:bg-muted'
                  }`}
                >
                  <SettingsIcon className="h-5 w-5" />
                  <span>{t('app.nav.settings')}</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="border-b bg-card p-4 sticky top-0 z-10 flex justify-between items-center">
          <div className="flex items-center">
            {/* Header content se necessario */}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <Badge className={`${getRoleBadgeColor()} text-xs px-2 py-0`}>
                      {getRoleLabel()}
                    </Badge>
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" onClick={handleLogout} title={t('auth.logout')}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
