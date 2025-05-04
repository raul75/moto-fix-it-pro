
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/StatusBadge';
import { ChevronLeft, Edit, Plus, Phone, Mail } from 'lucide-react';
import { getCustomerWithMotorcycles, repairs, motorcycles, invoices } from '@/data/mockData';

const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get customer with motorcycles
  const customerDetails = id ? getCustomerWithMotorcycles(id) : null;
  
  if (!customerDetails) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">Cliente non trovato</h2>
          <p className="mt-2 text-muted-foreground">
            Il cliente richiesto non è stato trovato o non esiste.
          </p>
          <Button className="mt-6" onClick={() => navigate('/customers')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Torna ai Clienti
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Get customer's repairs
  const customerRepairs = repairs.filter(repair => repair.customerId === id);
  
  // Get customer's invoices
  const customerInvoices = invoices.filter(invoice => invoice.customerId === id);
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/customers')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{customerDetails.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-1" asChild>
            <a href={`tel:${customerDetails.phone}`}>
              <Phone className="h-4 w-4" />
              Chiama
            </a>
          </Button>
          <Button variant="outline" className="flex gap-1" asChild>
            <a href={`mailto:${customerDetails.email}`}>
              <Mail className="h-4 w-4" />
              Email
            </a>
          </Button>
          <Button className="flex gap-1">
            <Edit className="h-4 w-4" />
            Modifica
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Informazioni di Contatto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customerDetails.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customerDetails.email}</span>
              </div>
              {customerDetails.address && (
                <div className="pt-2 text-sm">
                  <div className="text-muted-foreground mb-1">Indirizzo:</div>
                  <div>{customerDetails.address}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Motociclette</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Aggiungi moto</span>
            </Button>
          </CardHeader>
          <CardContent>
            {customerDetails.motorcycles && customerDetails.motorcycles.length > 0 ? (
              <div className="space-y-4">
                {customerDetails.motorcycles.map(moto => (
                  <div key={moto.id} className="border rounded-lg p-3">
                    <div className="font-medium">{moto.make} {moto.model}</div>
                    <div className="text-sm text-muted-foreground">Anno: {moto.year}</div>
                    <div className="text-sm">Targa: {moto.licensePlate}</div>
                    {moto.vin && <div className="text-sm">Telaio: {moto.vin}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nessuna motocicletta registrata.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Riepilogo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Riparazioni totali</div>
                <div className="text-xl font-semibold">{customerRepairs.length}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Fatture totali</div>
                <div className="text-xl font-semibold">{customerInvoices.length}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Fatturato totale</div>
                <div className="text-xl font-semibold">
                  €{customerInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="repairs" className="mt-6">
        <TabsList>
          <TabsTrigger value="repairs">Riparazioni</TabsTrigger>
          <TabsTrigger value="invoices">Fatture</TabsTrigger>
        </TabsList>
        
        <TabsContent value="repairs" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Riparazioni</CardTitle>
              <Button className="flex gap-1">
                <Plus className="h-4 w-4" />
                Nuova Riparazione
              </Button>
            </CardHeader>
            <CardContent>
              {customerRepairs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Titolo</TableHead>
                      <TableHead>Motocicletta</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerRepairs.map(repair => {
                      const moto = motorcycles.find(m => m.id === repair.motorcycleId);
                      return (
                        <TableRow key={repair.id}>
                          <TableCell className="font-medium">{repair.id}</TableCell>
                          <TableCell>{repair.title}</TableCell>
                          <TableCell>
                            {moto ? `${moto.make} ${moto.model}` : 'N/D'}
                          </TableCell>
                          <TableCell>{formatDate(repair.dateCreated)}</TableCell>
                          <TableCell>
                            <StatusBadge status={repair.status} />
                          </TableCell>
                          <TableCell>
                            <Button asChild variant="ghost" size="sm">
                              <Link to={`/repairs/${repair.id}`}>Dettagli</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground py-4">
                  Nessuna riparazione registrata per questo cliente.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fatture</CardTitle>
              <Button className="flex gap-1">
                <Plus className="h-4 w-4" />
                Nuova Fattura
              </Button>
            </CardHeader>
            <CardContent>
              {customerInvoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numero</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Scadenza</TableHead>
                      <TableHead className="text-right">Totale</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerInvoices.map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell className="text-right">€{invoice.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={
                            invoice.status === 'paid' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : invoice.status === 'sent'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : invoice.status === 'overdue'
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }>
                            {invoice.status === 'paid' ? 'Pagata' : 
                             invoice.status === 'sent' ? 'Inviata' : 
                             invoice.status === 'overdue' ? 'Scaduta' : 'Bozza'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Dettagli</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground py-4">
                  Nessuna fattura registrata per questo cliente.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default CustomerDetailsPage;
