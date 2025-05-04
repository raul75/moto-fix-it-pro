
import React from 'react';
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

const SettingsPage = () => {
  const { t } = useTranslation();
  
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
                  <Label htmlFor="dark-mode">{t('settings.general.darkMode')}</Label>
                  <Switch id="dark-mode" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('settings.general.darkModeDesc')}
                </p>
              </div>
              
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
              <CardTitle>{t('settings.invoices.title')}</CardTitle>
              <CardDescription>
                {t('settings.invoices.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-prefix">{t('settings.invoices.invoicePrefix')}</Label>
                    <Input id="invoice-prefix" placeholder="INV-" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="next-number">{t('settings.invoices.nextNumber')}</Label>
                    <Input id="next-number" placeholder="2023-003" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">{t('settings.invoices.paymentTerms')}</Label>
                  <Input id="payment-terms" placeholder="30" type="number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">{t('settings.invoices.taxRate')}</Label>
                  <Input id="tax-rate" placeholder="22" type="number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invoice-notes">{t('settings.invoices.invoiceNotes')}</Label>
                  <Textarea 
                    id="invoice-notes" 
                    placeholder="Pagamento da effettuare entro 30 giorni dalla data della fattura."
                    rows={4}
                  />
                </div>
                
                <Button type="submit">{t('settings.invoices.save')}</Button>
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
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Admin</p>
                    <p className="text-sm text-muted-foreground">admin@motofix.it</p>
                  </div>
                  <Badge variant="outline">{t('settings.users.admin')}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Tecnico</p>
                    <p className="text-sm text-muted-foreground">tecnico@motofix.it</p>
                  </div>
                  <Badge variant="outline">{t('settings.users.technician')}</Badge>
                </div>
                
                <Button>{t('settings.users.addUser')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default SettingsPage;
