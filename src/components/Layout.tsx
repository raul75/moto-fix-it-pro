
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Wrench, Users, Package, Receipt, Camera, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail
} from './ui/sidebar';

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4 border-b flex items-center">
            <h1 className="text-lg font-bold truncate">{t('app.title')}</h1>
          </SidebarHeader>
          
          <SidebarContent className="py-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={t('app.nav.dashboard')}
                  isActive={isActive('/dashboard')}
                  asChild
                >
                  <NavLink to="/dashboard">
                    <Wrench className="h-5 w-5" />
                    <span>{t('app.nav.dashboard')}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {hasRole(['admin', 'tecnico']) && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip={t('app.nav.customers')}
                      isActive={isActive('/customers')}
                      asChild
                    >
                      <NavLink to="/customers">
                        <Users className="h-5 w-5" />
                        <span>{t('app.nav.customers')}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip={t('app.nav.inventory')}
                      isActive={isActive('/inventory')}
                      asChild
                    >
                      <NavLink to="/inventory">
                        <Package className="h-5 w-5" />
                        <span>{t('app.nav.inventory')}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip={t('app.nav.invoices')}
                      isActive={isActive('/invoices')}
                      asChild
                    >
                      <NavLink to="/invoices">
                        <Receipt className="h-5 w-5" />
                        <span>{t('app.nav.invoices')}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip={t('app.nav.photos')}
                      isActive={isActive('/photos')}
                      asChild
                    >
                      <NavLink to="/photos">
                        <Camera className="h-5 w-5" />
                        <span>{t('app.nav.photos')}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              
              {hasRole('admin') && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip={t('app.nav.settings')}
                    isActive={isActive('/settings')}
                    asChild
                  >
                    <NavLink to="/settings">
                      <SettingsIcon className="h-5 w-5" />
                      <span>{t('app.nav.settings')}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="mt-auto border-t p-4">
            <div className="flex items-center justify-between">
              <LanguageSelector />
            </div>
          </SidebarFooter>
          
          {/* The rail allows users to expand/collapse by clicking on the edge */}
          <SidebarRail />
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="border-b bg-card p-4 sticky top-0 z-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-2" />
              {/* Header content if needed */}
            </div>
            <div className="flex items-center gap-4">
              
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
    </SidebarProvider>
  );
};

export default Layout;
