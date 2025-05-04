
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Wrench, Users, Package, Receipt, Camera, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
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
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/') && !isActive('/repairs') && !isActive('/customers') && !isActive('/inventory') && !isActive('/invoices') && !isActive('/photos') && !isActive('/settings')
                    ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                    : 'hover:bg-muted'
                }`}
              >
                <Wrench className="h-5 w-5" />
                <span>{t('app.nav.dashboard')}</span>
              </NavLink>
            </li>
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
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="border-b bg-card p-4 sticky top-0 z-10 flex justify-between items-center">
          <div>
            {/* Header content can go here */}
          </div>
          <LanguageSelector />
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
