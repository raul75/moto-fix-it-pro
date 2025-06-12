
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
    enabled: hasRole(['admin', 'tecnico']),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true
  });

  // Fetch customers data
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    enabled: hasRole(['admin', 'tecnico']),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true
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
      <div className="space-y-4 md:space-y-6 p-4 md:p-0">
        {/* Header - Responsive */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {t('dashboard.welcome').replace('{name}', user?.name || user?.email || 'Utente')}
          </p>
        </div>

        {hasRole(['admin', 'tecnico']) && (
          <>
            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatsCard
                title={t('dashboard.totalRepairs')}
                value={totalRepairs}
                icon={<Wrench className="h-5 w-5 md:h-6 md:w-6" />}
                trend={{ value: 12, positive: true }}
              />
              <StatsCard
                title={t('dashboard.pendingRepairs')}
                value={pendingRepairs}
                icon={<Wrench className="h-5 w-5 md:h-6 md:w-6" />}
                trend={{ value: 5, positive: false }}
              />
              <StatsCard
                title={t('dashboard.completedRepairs')}
                value={completedRepairs}
                icon={<Wrench className="h-5 w-5 md:h-6 md:w-6" />}
                trend={{ value: 8, positive: true }}
              />
              <StatsCard
                title={t('dashboard.totalCustomers')}
                value={totalCustomers}
                icon={<Users className="h-5 w-5 md:h-6 md:w-6" />}
                trend={{ value: 3, positive: true }}
              />
            </div>

            {/* Recent Repairs - Responsive */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <CardTitle className="text-lg md:text-xl">{t('dashboard.recentRepairs')}</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/repairs')} 
                  className="w-full sm:w-auto text-sm"
                  size="sm"
                >
                  {t('dashboard.viewAll')}
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {recentRepairs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8 text-sm md:text-base">
                    {t('dashboard.noRepairs')}
                  </p>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {recentRepairs.map((repair) => (
                      <div key={repair.id} className="flex flex-col space-y-2 border-b pb-3 last:border-b-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm md:text-base truncate">{repair.title}</p>
                            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">
                              {repair.description}
                            </p>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {new Date(repair.dateCreated).toLocaleDateString('it-IT')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions - Responsive Grid */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl">{t('dashboard.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <Button 
                    className="h-16 md:h-20 flex flex-col gap-2 text-xs md:text-sm p-4" 
                    onClick={() => navigate('/repairs/new')}
                  >
                    <Wrench className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    <span className="text-center leading-tight">{t('dashboard.newRepair')}</span>
                  </Button>
                  <Button 
                    className="h-16 md:h-20 flex flex-col gap-2 text-xs md:text-sm p-4" 
                    variant="outline" 
                    onClick={() => navigate('/customers')}
                  >
                    <Users className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    <span className="text-center leading-tight">{t('dashboard.newCustomer')}</span>
                  </Button>
                  <Button 
                    className="h-16 md:h-20 flex flex-col gap-2 text-xs md:text-sm p-4 sm:col-span-2 lg:col-span-1" 
                    variant="outline" 
                    onClick={() => navigate('/inventory')}
                  >
                    <Package className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    <span className="text-center leading-tight">{t('dashboard.viewInventory')}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Customer Dashboard - Responsive */}
        {hasRole('cliente') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => navigate('/my-motorcycles')}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-full shrink-0">
                    <Wrench className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base truncate">{t('nav.my_motorcycles')}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                      Gestisci le tue motociclette
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => navigate('/my-repairs')}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-full shrink-0">
                    <Wrench className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base truncate">{t('nav.my_repairs')}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                      Visualizza le tue riparazioni
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1" 
              onClick={() => navigate('/my-invoices')}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-full shrink-0">
                    <Wrench className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base truncate">{t('nav.my_invoices')}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                      Visualizza le tue fatture
                    </p>
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
