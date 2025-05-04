
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench, Truck, Package, Receipt, Settings, Users, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const navItems = [
    { icon: <Wrench className="h-5 w-5" />, label: "Riparazioni", to: "/" },
    { icon: <Users className="h-5 w-5" />, label: "Clienti", to: "/customers" },
    { icon: <Package className="h-5 w-5" />, label: "Magazzino", to: "/inventory" },
    { icon: <Receipt className="h-5 w-5" />, label: "Fatture", to: "/invoices" },
    { icon: <Image className="h-5 w-5" />, label: "Documenti", to: "/photos" },
    { icon: <Settings className="h-5 w-5" />, label: "Impostazioni", to: "/settings" },
  ];

  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r bg-sidebar gap-2 p-4">
      <div className="flex items-center gap-2 px-4 py-2">
        <Wrench className="h-6 w-6 text-motofix-blue" />
        <h1 className="text-xl font-bold">MotoFix Pro</h1>
      </div>
      <div className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={pathname === item.to}
          />
        ))}
      </div>
    </aside>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const MobileHeader: React.FC = () => {
  return (
    <header className="md:hidden flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <Wrench className="h-6 w-6 text-motofix-blue" />
        <h1 className="text-xl font-bold">MotoFix Pro</h1>
      </div>
      <div>
        {/* Mobile menu button could go here */}
      </div>
    </header>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
