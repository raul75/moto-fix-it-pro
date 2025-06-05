
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { getRepairsByCustomerId } from '@/api/repairs';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const MyRepairs = () => {
  const { user } = useAuth();
  
  const { data: repairs = [], isLoading } = useQuery({
    queryKey: ['my-repairs', user?.customerId],
    queryFn: () => getRepairsByCustomerId(user?.customerId || ''),
    enabled: !!user?.customerId
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-pulse text-muted-foreground">Caricamento...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Le Mie Riparazioni</h1>

        {repairs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Non hai riparazioni in corso</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {repairs.map((repair) => (
              <Card key={repair.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{repair.title}</CardTitle>
                    <StatusBadge status={repair.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">{repair.description}</p>
                    <p><strong>Data creazione:</strong> {format(new Date(repair.dateCreated), 'dd MMMM yyyy', { locale: it })}</p>
                    {repair.dateCompleted && (
                      <p><strong>Data completamento:</strong> {format(new Date(repair.dateCompleted), 'dd MMMM yyyy', { locale: it })}</p>
                    )}
                    {repair.notes && (
                      <div className="mt-4">
                        <strong>Note:</strong>
                        <p className="text-muted-foreground">{repair.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyRepairs;
