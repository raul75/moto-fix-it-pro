
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Wrench, Users, Package, Receipt, Camera, Settings as SettingsIcon, LogOut, Menu, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0 md:w-16'} bg-card border-r flex flex-col transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className={`text-lg font-bold ${!sidebarOpen && 'hidden md:block md:opacity-0'}`}>{t('app.title')}</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="md:flex hidden"
          >
            <ArrowLeft className={`h-4 w-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        {sidebarOpen && (
          <nav className="flex-1 p-4 overflow-y-auto">
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
        )}
        {!sidebarOpen && (
          <nav className="flex-1 p-2 overflow-y-auto hidden md:block">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/dashboard"
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                      : 'hover:bg-muted'
                  }`}
                  title={t('app.nav.dashboard')}
                >
                  <Wrench className="h-5 w-5" />
                </NavLink>
              </li>
              
              {hasRole(['admin', 'tecnico']) && (
                <>
                  <li>
                    <NavLink
                      to="/customers"
                      className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                        isActive('/customers')
                          ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                          : 'hover:bg-muted'
                      }`}
                      title={t('app.nav.customers')}
                    >
                      <Users className="h-5 w-5" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/inventory"
                      className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                        isActive('/inventory')
                          ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                          : 'hover:bg-muted'
                      }`}
                      title={t('app.nav.inventory')}
                    >
                      <Package className="h-5 w-5" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/invoices"
                      className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                        isActive('/invoices')
                          ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                          : 'hover:bg-muted'
                      }`}
                      title={t('app.nav.invoices')}
                    >
                      <Receipt className="h-5 w-5" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/photos"
                      className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                        isActive('/photos')
                          ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                          : 'hover:bg-muted'
                      }`}
                      title={t('app.nav.photos')}
                    >
                      <Camera className="h-5 w-5" />
                    </NavLink>
                  </li>
                </>
              )}
              
              {hasRole('admin') && (
                <li>
                  <NavLink
                    to="/settings"
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                      isActive('/settings')
                        ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                        : 'hover:bg-muted'
                    }`}
                    title={t('app.nav.settings')}
                  >
                    <SettingsIcon className="h-5 w-5" />
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="border-b bg-card p-4 sticky top-0 z-10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className={`md:hidden ${sidebarOpen && 'mr-2'}`}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* Header content if needed */}
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
