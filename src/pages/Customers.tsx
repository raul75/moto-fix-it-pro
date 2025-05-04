
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { customers, motorcycles } from '@/data/mockData';

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower)
    );
  });

  // Get motorcycles per customer
  const getCustomerMotorcycles = (customerId: string) => {
    return motorcycles.filter(m => m.customerId === customerId);
  };

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
          <Button className="flex gap-1">
            <Plus className="h-4 w-4" />
            Nuovo Cliente
          </Button>
        </div>
      </div>

      {/* Customers list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => {
          const customerMotorcycles = getCustomerMotorcycles(customer.id);
          
          return (
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
                    
                    <div className="text-sm pt-2">
                      <span className="text-muted-foreground">Motociclette:</span> {customerMotorcycles.length}
                    </div>
                    
                    {customerMotorcycles.length > 0 && (
                      <div className="mt-2">
                        {customerMotorcycles.slice(0, 2).map(moto => (
                          <div key={moto.id} className="text-xs py-1 px-2 rounded bg-secondary text-secondary-foreground inline-block mr-2 mb-2">
                            {moto.make} {moto.model}
                          </div>
                        ))}
                        {customerMotorcycles.length > 2 && (
                          <div className="text-xs py-1 px-2 rounded bg-secondary text-secondary-foreground inline-block">
                            +{customerMotorcycles.length - 2} altre
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        
        {filteredCustomers.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">Nessun cliente trovato.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomersPage;
