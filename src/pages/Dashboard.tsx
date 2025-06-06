
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getRepairs } from '@/api/repairs';
import { getCustomers } from '@/api/customers';
import { useAuth } from '@/context/AuthContext';
import { Wrench, Users, Plus, Package } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  // Fetch repairs data
  const { data: repairs = [], isLoading: repairsLoading } = useQuery({
    queryKey: ['repairs'],
    queryFn: getRepairs,
    enabled: hasRole(['admin', 'tecnico'])
  });

  // Fetch customers data
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    enabled: hasRole(['admin', 'tecnico'])
  });

  const totalRepairs = repairs.length;
  const pendingRepairs = repairs.filter(r => r.status === 'pending').length;
  const completedRepairs = repairs.filter(r => r.status === 'completed').length;
  const totalCustomers = customers.length;

  // Recent repairs (last 5)
  const recentRepairs = repairs
    .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
    .slice(0, 5);

  if (repairsLoading || customersLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">
            {t('dashboard.welcome', { name: user?.name || 'Utente' })}
          </p>
        </div>

        {hasRole(['admin', 'tecnico']) && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title={t('dashboard.totalRepairs')}
                value={totalRepairs}
                icon={<Wrench className="h-6 w-6" />}
                trend={{ value: 12, positive: true }}
              />
              <StatsCard
                title={t('dashboard.pendingRepairs')}
                value={pendingRepairs}
                icon={<Wrench className="h-6 w-6" />}
                trend={{ value: 5, positive: false }}
              />
              <StatsCard
                title={t('dashboard.completedRepairs')}
                value={completedRepairs}
                icon={<Wrench className="h-6 w-6" />}
                trend={{ value: 8, positive: true }}
              />
              <StatsCard
                title={t('dashboard.totalCustomers')}
                value={totalCustomers}
                icon={<Users className="h-6 w-6" />}
                trend={{ value: 3, positive: true }}
              />
            </div>

            {/* Recent Repairs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('dashboard.recentRepairs')}</CardTitle>
                <Button variant="outline" onClick={() => navigate('/repairs')}>
                  {t('dashboard.viewAll')}
                </Button>
              </CardHeader>
              <CardContent>
                {recentRepairs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    {t('dashboard.noRepairs')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentRepairs.map((repair) => (
                      <div key={repair.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{repair.title}</p>
                          <p className="text-sm text-muted-foreground">{repair.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(repair.dateCreated).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col gap-2" onClick={() => navigate('/repairs/new')}>
                    <Wrench className="h-6 w-6" />
                    {t('dashboard.newRepair')}
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline" onClick={() => navigate('/customers')}>
                    <Users className="h-6 w-6" />
                    {t('dashboard.newCustomer')}
                  </Button>
                  <Button className="h-20 flex flex-col gap-2" variant="outline" onClick={() => navigate('/inventory')}>
                    <Package className="h-6 w-6" />
                    {t('dashboard.viewInventory')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {hasRole('cliente') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/my-motorcycles')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('nav.my_motorcycles')}</h3>
                    <p className="text-sm text-muted-foreground">Gestisci le tue motociclette</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/my-repairs')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('nav.my_repairs')}</h3>
                    <p className="text-sm text-muted-foreground">Visualizza le tue riparazioni</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/my-invoices')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('nav.my_invoices')}</h3>
                    <p className="text-sm text-muted-foreground">Visualizza le tue fatture</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
