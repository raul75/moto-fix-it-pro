
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { getCustomers, createCustomerInDb } from '@/api/customers';
import { getMotorcyclesByCustomerId } from '@/api/motorcycles';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Customer } from '@/types';

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch customers from Supabase
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  });

  // Mutation for creating new customer
  const createCustomerMutation = useMutation({
    mutationFn: createCustomerInDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Cliente aggiunto",
        description: `${newCustomer.name} è stato aggiunto con successo.`,
      });
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = () => {
    // Validate required fields
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      toast({
        title: "Errore",
        description: "I campi Nome, Email e Telefono sono obbligatori.",
        variant: "destructive"
      });
      return;
    }

    createCustomerMutation.mutate(newCustomer as Omit<Customer, 'id'>);
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
        <h1 className="text-2xl font-bold">Clienti</h1>
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
              {searchTerm ? 'Nessun cliente trovato con questi criteri.' : 'Nessun cliente registrato.'}
            </p>
          </div>
        )}
      </div>

      {/* New Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Aggiungi nuovo cliente</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del nuovo cliente. I campi con * sono obbligatori.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome*
              </Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                value={newCustomer.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="col-span-3"
                value={newCustomer.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefono*
              </Label>
              <Input
                id="phone"
                name="phone"
                className="col-span-3"
                value={newCustomer.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Indirizzo
              </Label>
              <Input
                id="address"
                name="address"
                className="col-span-3"
                value={newCustomer.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annulla
            </Button>
            <Button 
              onClick={handleAddCustomer}
              disabled={createCustomerMutation.isPending}
            >
              {createCustomerMutation.isPending ? 'Salvando...' : 'Salva'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CustomersPage;
