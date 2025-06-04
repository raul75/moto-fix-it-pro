
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  Wrench, 
  Package, 
  FileText, 
  Camera,
  Settings,
  Plus,
  MotorcycleIcon as Bike,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  if (!user) {
    return null;
  }

  // Dashboard per clienti
  if (hasRole('cliente')) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Benvenuto, {user.name}!</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Le Mie Motociclette"
              value="0"
              description="Motociclette registrate"
              icon={Bike}
            />
            <StatsCard
              title="Riparazioni Attive"
              value="0"
              description="In lavorazione"
              icon={Wrench}
            />
            <StatsCard
              title="Fatture in Sospeso"
              value="€0"
              description="Da pagare"
              icon={DollarSign}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Riparazioni Recenti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Non hai riparazioni in corso al momento.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Fatture Recenti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Non hai fatture recenti.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Dashboard per admin e tecnici
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('app.nav.dashboard')}</h1>
          <div className="flex gap-2">
            {hasRole(['admin', 'tecnico']) && (
              <Button onClick={() => navigate('/repairs/new')} className="flex gap-2">
                <Plus className="h-4 w-4" />
                Nuova Riparazione
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Clienti Totali"
            value="0"
            description="Clienti registrati"
            icon={Users}
          />
          <StatsCard
            title="Riparazioni Attive"
            value="0"
            description="In lavorazione"
            icon={Wrench}
          />
          <StatsCard
            title="Parti in Inventario"
            value="0"
            description="Pezzi disponibili"
            icon={Package}
          />
          <StatsCard
            title="Fatture del Mese"
            value="€0"
            description="Entrate mensili"
            icon={FileText}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/customers')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('app.nav.customers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gestisci i clienti e le loro informazioni
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/repairs')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Riparazioni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gestisci le riparazioni in corso
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/inventory')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('app.nav.inventory')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gestisci l'inventario dei pezzi di ricambio
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/invoices')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('app.nav.invoices')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gestisci fatture e pagamenti
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/photos')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {t('app.nav.photos')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualizza foto delle riparazioni
              </p>
            </CardContent>
          </Card>
          
          {hasRole('admin') && (
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/settings')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t('app.nav.settings')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configurazioni di sistema
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
