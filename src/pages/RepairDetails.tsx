
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Edit, Camera, Printer } from 'lucide-react';
import { getRepairWithDetails } from '@/data/mockData';

const RepairDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get repair details with motorcycle and customer info
  const repairDetails = id ? getRepairWithDetails(id) : null;
  
  if (!repairDetails) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">Riparazione non trovata</h2>
          <p className="mt-2 text-muted-foreground">
            La riparazione richiesta non è stata trovata o non esiste.
          </p>
          <Button className="mt-6" onClick={() => navigate('/')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Torna alla Dashboard
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Destructure the repairDetails object
  const { motorcycle, customer } = repairDetails;
  // Treat repairDetails as the repair object itself
  const repair = repairDetails;
  
  // Calculate totals
  const partsCost = repair.parts.reduce((sum, part) => sum + (part.priceEach * part.quantity), 0);
  const laborCost = (repair.laborHours || 0) * (repair.laborRate || 0);
  const totalCost = partsCost + laborCost;
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{repair.title}</h1>
          <StatusBadge status={repair.status} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-1">
            <Camera className="h-4 w-4" />
            Aggiungi Foto
          </Button>
          <Button variant="outline" className="flex gap-1">
            <Printer className="h-4 w-4" />
            Stampa
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
            <CardTitle>Informazioni Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold">{customer.name}</p>
              <p className="text-sm">Email: {customer.email}</p>
              <p className="text-sm">Telefono: {customer.phone}</p>
              {customer.address && <p className="text-sm">Indirizzo: {customer.address}</p>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Informazioni Motocicletta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold">{motorcycle.make} {motorcycle.model} ({motorcycle.year})</p>
              <p className="text-sm">Targa: {motorcycle.licensePlate}</p>
              {motorcycle.vin && <p className="text-sm">Telaio: {motorcycle.vin}</p>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dettagli Riparazione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Data creazione:</span>
                <span className="text-sm">{formatDate(repair.dateCreated)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Ultimo aggiornamento:</span>
                <span className="text-sm">{formatDate(repair.dateUpdated)}</span>
              </div>
              
              {repair.dateCompleted && (
                <div className="flex justify-between">
                  <span className="text-sm">Data completamento:</span>
                  <span className="text-sm">{formatDate(repair.dateCompleted)}</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold">
                <span>Totale:</span>
                <span>€{totalCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="details" className="mt-6">
        <TabsList>
          <TabsTrigger value="details">Dettagli</TabsTrigger>
          <TabsTrigger value="parts">Ricambi</TabsTrigger>
          <TabsTrigger value="photos">Foto</TabsTrigger>
          <TabsTrigger value="notes">Note</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Descrizione</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{repair.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Manodopera</CardTitle>
            </CardHeader>
            <CardContent>
              {repair.laborHours ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ore di lavoro</p>
                      <p className="font-medium">{repair.laborHours}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tariffa oraria</p>
                      <p className="font-medium">€{repair.laborRate}/ora</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <p className="font-medium">Totale manodopera</p>
                    <p className="font-medium">€{laborCost.toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Nessuna manodopera registrata.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ricambi Utilizzati</CardTitle>
            </CardHeader>
            <CardContent>
              {repair.parts.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ricambio</TableHead>
                        <TableHead className="text-right">Quantità</TableHead>
                        <TableHead className="text-right">Prezzo Unitario</TableHead>
                        <TableHead className="text-right">Totale</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repair.parts.map(part => (
                        <TableRow key={part.id}>
                          <TableCell>{part.partName}</TableCell>
                          <TableCell className="text-right">{part.quantity}</TableCell>
                          <TableCell className="text-right">€{part.priceEach.toFixed(2)}</TableCell>
                          <TableCell className="text-right">€{(part.quantity * part.priceEach).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 flex justify-between">
                    <p className="font-medium">Totale ricambi</p>
                    <p className="font-medium">€{partsCost.toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Nessun ricambio utilizzato.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="photos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentazione Fotografica</CardTitle>
            </CardHeader>
            <CardContent>
              {repair.photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {repair.photos.map(photo => (
                    <div key={photo.id} className="overflow-hidden rounded-lg border">
                      <div className="aspect-square relative">
                        <img 
                          src={photo.url}
                          alt={photo.caption || 'Foto riparazione'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {photo.caption && (
                        <div className="p-2">
                          <p className="text-sm">{photo.caption}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(photo.dateAdded).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <p className="mt-4 text-muted-foreground">
                    Nessuna foto disponibile per questa riparazione.
                  </p>
                  <Button className="mt-4">
                    <Camera className="mr-2 h-4 w-4" />
                    Aggiungi foto
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Note</CardTitle>
            </CardHeader>
            <CardContent>
              {repair.notes ? (
                <p>{repair.notes}</p>
              ) : (
                <p className="text-muted-foreground">Nessuna nota disponibile per questa riparazione.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default RepairDetailsPage;
