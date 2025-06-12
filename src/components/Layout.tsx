import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { usePersistedTheme } from '@/hooks/usePersistedTheme';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import LanguageSelector from '@/components/LanguageSelector';
import { 
  Home, 
  Wrench, 
  Users, 
  Package, 
  FileText, 
  Camera, 
  Settings, 
  LogOut, 
  Menu,
  User
} from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { mounted } = usePersistedTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      path: '/',
      label: t('nav.home'),
      icon: Home,
      show: isAuthenticated,
    },
    {
      path: '/repairs',
      label: t('nav.repairs'),
      icon: Wrench,
      show: isAuthenticated,
    },
    {
      path: '/customers',
      label: t('nav.customers'),
      icon: Users,
      show: isAuthenticated,
    },
    {
      path: '/inventory',
      label: t('nav.inventory'),
      icon: Package,
      show: isAuthenticated,
    },
    {
      path: '/invoices',
      label: t('nav.invoices'),
      icon: FileText,
      show: isAuthenticated,
    },
    {
      path: '/workshop',
      label: t('nav.workshop'),
      icon: Camera,
      show: !isAuthenticated,
    },
  ].filter(item => item.show);

  const getCurrentPageTitle = () => {
    const item = navigationItems.find(item => item.path === location.pathname);
    return item ? item.label : 'MotoFix';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-14 items-center border-b px-6">
                  <img 
                    src="/lovable-uploads/5b289d77-4537-4aa6-b011-df0e4cd7b186.png" 
                    alt="MotoFix Logo" 
                    className="mr-2 h-8 w-8 object-contain"
                  />
                  <span className="font-semibold">MotoFix</span>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={location.pathname === item.path ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </nav>
                <div className="border-t p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <LanguageSelector />
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.logout')}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 text-center">
            <span className="font-semibold">{getCurrentPageTitle()}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                {t('nav.settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                {t('auth.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 border-r bg-background">
          <div className="flex h-14 items-center border-b px-6">
            <img 
              src="/lovable-uploads/5b289d77-4537-4aa6-b011-df0e4cd7b186.png" 
              alt="MotoFix Logo" 
              className="mr-2 h-8 w-8 object-contain"
            />
            <span className="font-semibold">MotoFix</span>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-4">
              <LanguageSelector />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  <span className="truncate">{user?.name || user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name || user?.email}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t('nav.settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
