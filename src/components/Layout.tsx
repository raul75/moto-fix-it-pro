import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import LanguageSelector from '@/components/LanguageSelector';
import { Home, Users, Package, FileText, Camera, Settings, Menu, LogOut, Wrench } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isTechnician = user?.role === 'tecnico';
  const isCustomer = user?.role === 'cliente';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const adminNavItems = [
    { to: '/dashboard', icon: <Home className="h-4 w-4" />, label: t('app.nav.dashboard') },
    { to: '/customers', icon: <Users className="h-4 w-4" />, label: t('app.nav.customers') },
    { to: '/repairs', icon: <Wrench className="h-4 w-4" />, label: 'Riparazioni' },
    { to: '/inventory', icon: <Package className="h-4 w-4" />, label: t('app.nav.inventory') },
    { to: '/invoices', icon: <FileText className="h-4 w-4" />, label: t('app.nav.invoices') },
    { to: '/photos', icon: <Camera className="h-4 w-4" />, label: t('app.nav.photos') },
    { to: '/settings', icon: <Settings className="h-4 w-4" />, label: t('app.nav.settings') },
  ];

  const technicianNavItems = [
    { to: '/dashboard', icon: <Home className="h-4 w-4" />, label: t('app.nav.dashboard') },
    { to: '/customers', icon: <Users className="h-4 w-4" />, label: t('app.nav.customers') },
    { to: '/repairs', icon: <Wrench className="h-4 w-4" />, label: 'Riparazioni' },
    { to: '/inventory', icon: <Package className="h-4 w-4" />, label: t('app.nav.inventory') },
    { to: '/photos', icon: <Camera className="h-4 w-4" />, label: t('app.nav.photos') },
  ];

  const customerNavItems = [
    { to: '/my-motorcycles', icon: <Wrench className="h-4 w-4" />, label: 'Le Mie Moto' },
    { to: '/my-repairs', icon: <Settings className="h-4 w-4" />, label: 'Le Mie Riparazioni' },
    { to: '/my-invoices', icon: <FileText className="h-4 w-4" />, label: 'Le Mie Fatture' },
  ];

  const getNavItems = () => {
    if (isAdmin) return adminNavItems;
    if (isTechnician) return technicianNavItems;
    if (isCustomer) return customerNavItems;
    return [];
  };

  const navItems = getNavItems();

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-6 py-4">
        <img 
          src="/lovable-uploads/5b289d77-4537-4aa6-b011-df0e4cd7b186.png" 
          alt="MotoFix Logo" 
          className="h-8 w-auto"
        />
        <div>
          <h1 className="text-lg font-bold">{t('app.title')}</h1>
          <p className="text-xs text-muted-foreground">{t('app.description')}</p>
        </div>
      </div>
      <Separator />
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  location.pathname === item.to
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <Separator className="mb-4" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-xs">
              <p className="font-medium">{user?.email}</p>
              <p className="text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          {t('auth.logout')}
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r">
        <NavContent />
      </aside>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
