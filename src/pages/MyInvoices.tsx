
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getInvoicesByCustomerId } from '@/api/invoices';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const MyInvoices = () => {
  const { user } = useAuth();
  
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['my-invoices', user?.customerId],
    queryFn: () => getInvoicesByCustomerId(user?.customerId || ''),
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
        <h1 className="text-3xl font-bold">Le Mie Fatture</h1>

        {invoices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Non hai fatture</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Fattura #{invoice.number}</CardTitle>
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                      {invoice.status === 'paid' ? 'Pagata' : 'In sospeso'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Data:</strong> {format(new Date(invoice.date), 'dd MMMM yyyy', { locale: it })}</p>
                    <p><strong>Scadenza:</strong> {format(new Date(invoice.dueDate), 'dd MMMM yyyy', { locale: it })}</p>
                    <p><strong>Totale:</strong> €{invoice.total.toFixed(2)}</p>
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

export default MyInvoices;
