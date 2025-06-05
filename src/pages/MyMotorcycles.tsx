
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getMotorcyclesByCustomerId } from '@/api/motorcycles';
import { useAuth } from '@/context/AuthContext';

const MyMotorcycles = () => {
  const { user } = useAuth();
  
  const { data: motorcycles = [], isLoading } = useQuery({
    queryKey: ['my-motorcycles', user?.customerId],
    queryFn: () => getMotorcyclesByCustomerId(user?.customerId || ''),
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Le Mie Motociclette</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi Motocicletta
          </Button>
        </div>

        {motorcycles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Non hai ancora registrato motociclette</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi la tua prima motocicletta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {motorcycles.map((motorcycle) => (
              <Card key={motorcycle.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{motorcycle.make} {motorcycle.model}</span>
                    <Badge variant="outline">{motorcycle.year}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Targa:</strong> {motorcycle.licensePlate}</p>
                    {motorcycle.vin && (
                      <p><strong>VIN:</strong> {motorcycle.vin}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default MyMotorcycles;
