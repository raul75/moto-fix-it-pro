
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { getCustomers, updateCustomer, deleteCustomer } from '@/api/customers';
import { useToast } from '@/hooks/use-toast';
import { createCustomer } from '@/utils/customerUtils';
import NewCustomerDialog from '@/components/dialogs/NewCustomerDialog';
import EditCustomerDialog from '@/components/dialogs/EditCustomerDialog';
import { NewCustomerFormValues } from '@/components/forms/NewCustomerForm';
import { EditCustomerFormValues } from '@/components/forms/EditCustomerForm';
import { Customer } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CustomersPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
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

  // Mutation for updating customer
  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: EditCustomerFormValues }) => 
      updateCustomer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Cliente aggiornato",
        description: "Le modifiche sono state salvate con successo",
      });
      setEditDialogOpen(false);
      setSelectedCustomer(null);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiornamento del cliente",
        variant: "destructive"
      });
    }
  });

  // Mutation for deleting customer
  const deleteCustomerMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Cliente eliminato",
        description: "Il cliente è stato eliminato con successo",
      });
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'eliminazione del cliente",
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

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleSaveCustomer = (values: EditCustomerFormValues) => {
    if (selectedCustomer) {
      updateCustomerMutation.mutate({ id: selectedCustomer.id, updates: values });
    }
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCustomer = () => {
    if (customerToDelete) {
      deleteCustomerMutation.mutate(customerToDelete.id);
    }
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
          <Card key={customer.id} className="card-hover h-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/customers/${customer.id}`} className="flex-1">
                  <h3 className="font-semibold text-lg hover:text-primary">{customer.name}</h3>
                </Link>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditCustomer(customer);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteCustomer(customer);
                    }}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Link to={`/customers/${customer.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
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

      {/* Edit Customer Dialog */}
      <EditCustomerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        customer={selectedCustomer}
        onSubmit={handleSaveCustomer}
        isLoading={updateCustomerMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare il cliente "{customerToDelete?.name}"? 
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCustomer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default CustomersPage;
