
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Impostazioni</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Generali</TabsTrigger>
          <TabsTrigger value="business">Dati Aziendali</TabsTrigger>
          <TabsTrigger value="invoices">Fatturazione</TabsTrigger>
          <TabsTrigger value="users">Utenti</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Generali</CardTitle>
              <CardDescription>
                Configura le impostazioni generali dell'applicazione
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Tema scuro</Label>
                  <Switch id="dark-mode" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Attiva il tema scuro per l'applicazione
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notifiche</Label>
                  <Switch id="notifications" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Ricevi notifiche per nuove riparazioni e aggiornamenti
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="low-stock-alerts">Avvisi scorte basse</Label>
                  <Switch id="low-stock-alerts" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Ricevi avvisi quando le parti scendono sotto la soglia minima
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Backup Dati</CardTitle>
              <CardDescription>
                Gestisci i backup dei tuoi dati
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Backup automatico</Label>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Crea automaticamente un backup giornaliero dei dati
                </p>
              </div>
              
              <Button variant="outline">Crea backup manuale</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dati Aziendali</CardTitle>
              <CardDescription>
                Informazioni sulla tua officina
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome Azienda</Label>
                    <Input id="company-name" placeholder="MotoFix Officina" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vat">Partita IVA</Label>
                    <Input id="vat" placeholder="IT12345678901" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo</Label>
                  <Input id="address" placeholder="Via dell'Officina 123" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Città</Label>
                    <Input id="city" placeholder="Milano" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip">CAP</Label>
                    <Input id="zip" placeholder="20100" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="province">Provincia</Label>
                    <Input id="province" placeholder="MI" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input id="phone" placeholder="02 1234567" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="info@motofix.it" type="email" />
                  </div>
                </div>
                
                <Button type="submit">Salva dati aziendali</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Fatturazione</CardTitle>
              <CardDescription>
                Configura le impostazioni per le fatture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-prefix">Prefisso Fattura</Label>
                    <Input id="invoice-prefix" placeholder="INV-" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="next-number">Prossimo Numero</Label>
                    <Input id="next-number" placeholder="2023-003" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Termini di Pagamento (giorni)</Label>
                  <Input id="payment-terms" placeholder="30" type="number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Aliquota IVA (%)</Label>
                  <Input id="tax-rate" placeholder="22" type="number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invoice-notes">Note Standard Fattura</Label>
                  <Textarea 
                    id="invoice-notes" 
                    placeholder="Pagamento da effettuare entro 30 giorni dalla data della fattura."
                    rows={4}
                  />
                </div>
                
                <Button type="submit">Salva impostazioni</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Utenti</CardTitle>
              <CardDescription>
                Gestisci gli utenti che possono accedere al sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Admin</p>
                    <p className="text-sm text-muted-foreground">admin@motofix.it</p>
                  </div>
                  <Badge variant="outline">Amministratore</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Tecnico</p>
                    <p className="text-sm text-muted-foreground">tecnico@motofix.it</p>
                  </div>
                  <Badge variant="outline">Tecnico</Badge>
                </div>
                
                <Button>Aggiungi Utente</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default SettingsPage;
