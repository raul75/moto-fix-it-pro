
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { getCustomers } from '@/api/customers';
import { useToast } from '@/hooks/use-toast';
import { createCustomer } from '@/utils/customerUtils';
import NewCustomerDialog from '@/components/dialogs/NewCustomerDialog';
import { NewCustomerFormValues } from '@/components/forms/NewCustomerForm';

const CustomersPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch customers from Supabase
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  });

  // Mutation for creating new customer
  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Cliente aggiunto",
        description: "Il nuovo cliente è stato creato con successo",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la creazione del cliente",
        variant: "destructive"
      });
    }
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower)
    );
  });

  const handleAddCustomer = (values: NewCustomerFormValues) => {
    createCustomerMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-pulse text-muted-foreground">Caricamento clienti...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">{t('app.nav.customers')}</h1>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca clienti..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex gap-1" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuovo Cliente
          </Button>
        </div>
      </div>

      {/* Customers list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => (
          <Link to={`/customers/${customer.id}`} key={customer.id}>
            <Card className="card-hover h-full">
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="space-y-2 mt-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email:</span> {customer.email}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Telefono:</span> {customer.phone}
                  </div>
                  
                  {customer.address && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Indirizzo:</span> {customer.address}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        
        {filteredCustomers.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? "Nessun cliente trovato" : "Nessun cliente presente"}
            </p>
          </div>
        )}
      </div>

      {/* New Customer Dialog */}
      <NewCustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddCustomer}
        isLoading={createCustomerMutation.isPending}
      />
    </Layout>
  );
};

export default CustomersPage;
