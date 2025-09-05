
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [companyHeader, setCompanyHeader] = useState(
    localStorage.getItem('company-header') || 'MotoFix Officina\nVia dell\'Officina 123\n20100 Milano (MI)\nP.IVA: IT12345678901\nTel: 02 1234567\nEmail: info@motofix.it'
  );
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  // Mock users data - in real app this would come from API
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin', email: 'admin@motofix.it', role: 'admin' },
    { id: 2, name: 'Tecnico', email: 'tecnico@motofix.it', role: 'technician' },
    { id: 3, name: 'Cliente Test', email: 'cliente@example.com', role: 'customer' }
  ]);


  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: t('common.success'),
      description: t('settings.users.userDeleted'),
    });
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ));
      toast({
        title: t('common.success'),
        description: t('settings.users.userUpdated'),
      });
    }
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      const user = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...newUser
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: '' });
      setIsAddUserOpen(false);
      toast({
        title: t('common.success'),
        description: t('settings.users.userAdded'),
      });
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "Errore",
          description: "Il file è troppo grande. Massimo 2MB.",
          variant: "destructive"
        });
        return;
      }
      setCompanyLogo(file);
      
      // Create preview URL and save to localStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        localStorage.setItem('company-logo-url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInvoiceSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save company header
    localStorage.setItem('company-header', companyHeader);
    
    toast({
      title: "Successo",
      description: "Impostazioni fatturazione salvate con successo",
    });
  };
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t('settings.tabs.general')}</TabsTrigger>
          <TabsTrigger value="business">{t('settings.tabs.business')}</TabsTrigger>
          <TabsTrigger value="invoices">{t('settings.tabs.invoices')}</TabsTrigger>
          <TabsTrigger value="users">{t('settings.tabs.users')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.general.title')}</CardTitle>
              <CardDescription>
                {t('settings.general.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">{t('settings.general.notifications')}</Label>
                  <Switch id="notifications" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('settings.general.notificationsDesc')}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="low-stock-alerts">{t('settings.general.lowStockAlerts')}</Label>
                  <Switch id="low-stock-alerts" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('settings.general.lowStockAlertsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.backup.title')}</CardTitle>
              <CardDescription>
                {t('settings.backup.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">{t('settings.backup.autoBackup')}</Label>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('settings.backup.autoBackupDesc')}
                </p>
              </div>
              
              <Button variant="outline">{t('settings.backup.manualBackup')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.business.title')}</CardTitle>
              <CardDescription>
                {t('settings.business.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">{t('settings.business.companyName')}</Label>
                    <Input id="company-name" placeholder="MotoFix Officina" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vat">{t('settings.business.vat')}</Label>
                    <Input id="vat" placeholder="IT12345678901" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">{t('settings.business.address')}</Label>
                  <Input id="address" placeholder="Via dell'Officina 123" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('settings.business.city')}</Label>
                    <Input id="city" placeholder="Milano" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip">{t('settings.business.zip')}</Label>
                    <Input id="zip" placeholder="20100" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="province">{t('settings.business.province')}</Label>
                    <Input id="province" placeholder="MI" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('settings.business.phone')}</Label>
                    <Input id="phone" placeholder="02 1234567" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('settings.business.email')}</Label>
                    <Input id="email" placeholder="info@motofix.it" type="email" />
                  </div>
                </div>
                
                <Button type="submit">{t('settings.business.save')}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Fatturazione</CardTitle>
              <CardDescription>
                Configura logo, intestazione e parametri di fatturazione
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSaveInvoiceSettings}>
                {/* Logo e Intestazione */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Logo e Intestazione</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-logo">Logo Azienda</Label>
                    <Input 
                      id="company-logo" 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                    />
                    <p className="text-sm text-muted-foreground">Carica il logo della tua azienda (JPG, PNG, max 2MB)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-header">Intestazione Azienda</Label>
                    <Textarea 
                      id="company-header" 
                      value={companyHeader}
                      onChange={(e) => setCompanyHeader(e.target.value)}
                      placeholder="MotoFix Officina&#10;Via dell'Officina 123&#10;20100 Milano (MI)&#10;P.IVA: IT12345678901&#10;Tel: 02 1234567&#10;Email: info@motofix.it"
                      rows={6}
                    />
                    <p className="text-sm text-muted-foreground">Inserisci l'intestazione completa della tua azienda</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Parametri Fatturazione</h3>
                  
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-terms">Termini di Pagamento (giorni)</Label>
                      <Input id="payment-terms" placeholder="30" type="number" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">Aliquota IVA (%)</Label>
                      <Input id="tax-rate" placeholder="22" type="number" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="invoice-notes">Note Standard Fattura</Label>
                    <Textarea 
                      id="invoice-notes" 
                      placeholder="Pagamento da effettuare entro 30 giorni dalla data della fattura."
                      rows={3}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Salva Impostazioni Fatturazione</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.users.title')}</CardTitle>
              <CardDescription>
                {t('settings.users.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {t(`settings.users.${user.role}`)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      {t('settings.users.addUser')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('settings.users.addUser')}</DialogTitle>
                      <DialogDescription>
                        Aggiungi un nuovo utente al sistema
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-user-name">{t('auth.name')}</Label>
                        <Input
                          id="new-user-name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-user-email">{t('auth.email')}</Label>
                        <Input
                          id="new-user-email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-user-role">{t('auth.role')}</Label>
                        <Select onValueChange={(value) => setNewUser({...newUser, role: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona ruolo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">{t('settings.users.admin')}</SelectItem>
                            <SelectItem value="technician">{t('settings.users.technician')}</SelectItem>
                            <SelectItem value="customer">{t('settings.users.customer')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                        {t('common.cancel')}
                      </Button>
                      <Button onClick={handleAddUser}>
                        {t('common.add')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Edit User Dialog */}
                <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('settings.users.editUser')}</DialogTitle>
                      <DialogDescription>
                        Modifica le informazioni dell'utente
                      </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-user-name">{t('auth.name')}</Label>
                          <Input
                            id="edit-user-name"
                            value={selectedUser.name}
                            onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-user-email">{t('auth.email')}</Label>
                          <Input
                            id="edit-user-email"
                            type="email"
                            value={selectedUser.email}
                            onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-user-role">{t('auth.role')}</Label>
                          <Select 
                            value={selectedUser.role} 
                            onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">{t('settings.users.admin')}</SelectItem>
                              <SelectItem value="technician">{t('settings.users.technician')}</SelectItem>
                              <SelectItem value="customer">{t('settings.users.customer')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                        {t('common.cancel')}
                      </Button>
                      <Button onClick={handleSaveUser}>
                        {t('common.save')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default SettingsPage;
