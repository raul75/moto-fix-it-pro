
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Edit, Camera, Printer, Save, X } from 'lucide-react';
import { getRepairById, updateRepair, uploadPhotoToRepair } from '@/api/repairs';
import { getCustomerById } from '@/api/customers';
import { format } from 'date-fns';
import { it, es, enUS } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const RepairDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    status: '',
    laborHours: '',
    laborRate: '',
    notes: ''
  });
  
  // Get the appropriate locale for date formatting
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'it': return it;
      case 'es': return es;
      case 'en': return enUS;
      default: return es;
    }
  };
  
  // Fetch repair details
  const { data: repair, isLoading: repairLoading } = useQuery({
    queryKey: ['repair', id],
    queryFn: () => getRepairById(id!),
    enabled: !!id
  });

  // Fetch customer details
  const { data: customer } = useQuery({
    queryKey: ['customer', repair?.customerId],
    queryFn: () => getCustomerById(repair!.customerId),
    enabled: !!repair?.customerId
  });

  // Update repair mutation
  const updateRepairMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => updateRepair(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair', id] });
      setIsEditing(false);
      toast({
        title: t('repairs.repairUpdated'),
        description: t('repairs.updateSuccess'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('repairs.error'),
        description: error.message || t('repairs.updateError'),
        variant: "destructive"
      });
    }
  });

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: ({ repairId, file }: { repairId: string, file: File }) => 
      uploadPhotoToRepair(repairId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair', id] });
      toast({
        title: "Foto caricata",
        description: "La foto è stata aggiunta con successo alla riparazione.",
      });
    },
    onError: (error: any) => {
      toast({
        title: t('repairs.error'),
        description: error.message || "Errore durante il caricamento della foto",
        variant: "destructive"
      });
    }
  });

  React.useEffect(() => {
    if (repair) {
      setEditData({
        title: repair.title,
        description: repair.description,
        status: repair.status,
        laborHours: repair.laborHours?.toString() || '',
        laborRate: repair.laborRate?.toString() || '',
        notes: repair.notes || ''
      });
    }
  }, [repair]);

  const handleSave = () => {
    if (!id) return;

    const updates = {
      title: editData.title,
      description: editData.description,
      status: editData.status as any,
      laborHours: editData.laborHours ? parseFloat(editData.laborHours) : undefined,
      laborRate: editData.laborRate ? parseFloat(editData.laborRate) : undefined,
      notes: editData.notes || undefined
    };

    updateRepairMutation.mutate({ id, updates });
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && id) {
      uploadPhotoMutation.mutate({ repairId: id, file });
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (repairLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
        </div>
      </Layout>
    );
  }

  if (!repair) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">{t('repairs.notFound')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('repairs.notFoundDesc')}
          </p>
          <Button className="mt-6" onClick={() => navigate('/repairs')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('repairs.backToRepairs')}
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Calculate totals
  const partsCost = repair.parts?.reduce((sum, part) => sum + (part.priceEach * part.quantity), 0) || 0;
  const laborCost = (repair.laborHours || 0) * (repair.laborRate || 0);
  const totalCost = partsCost + laborCost;

  return (
    <Layout>
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/repairs')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {isEditing ? (
            <Input 
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="text-2xl font-bold border-none p-0 h-auto bg-transparent"
            />
          ) : (
            <h1 className="text-2xl font-bold">{repair.title}</h1>
          )}
          <StatusBadge status={repair.status} />
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                {t('repairs.cancel')}
              </Button>
              <Button onClick={handleSave} disabled={updateRepairMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateRepairMutation.isPending ? t('repairs.saving') : t('repairs.save')}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={handlePhotoUpload}
                disabled={uploadPhotoMutation.isPending}
              >
                <Camera className="h-4 w-4 mr-2" />
                {uploadPhotoMutation.isPending ? 'Caricando...' : t('repairs.addPhoto')}
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                {t('repairs.print')}
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                {t('repairs.edit')}
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('repairs.customerInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            {customer ? (
              <div className="space-y-2">
                <p className="font-semibold">{customer.name}</p>
                <p className="text-sm">Email: {customer.email}</p>
                <p className="text-sm">{t('auth.phone')}: {customer.phone}</p>
                {customer.address && <p className="text-sm">{t('settings.business.address')}: {customer.address}</p>}
              </div>
            ) : (
              <p className="text-muted-foreground">{t('common.loading')}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('repairs.repairStatus')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isEditing ? (
                <Select value={editData.status} onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t('repairs.status.pending')}</SelectItem>
                    <SelectItem value="in-progress">{t('repairs.status.inProgress')}</SelectItem>
                    <SelectItem value="completed">{t('repairs.status.completed')}</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <StatusBadge status={repair.status} />
              )}
              
              <div className="flex justify-between">
                <span className="text-sm">{t('repairs.creationDate')}:</span>
                <span className="text-sm">{format(new Date(repair.dateCreated), 'dd MMMM yyyy', { locale: getDateLocale() })}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">{t('repairs.lastUpdate')}:</span>
                <span className="text-sm">{format(new Date(repair.dateUpdated), 'dd MMMM yyyy', { locale: getDateLocale() })}</span>
              </div>
              
              {repair.dateCompleted && (
                <div className="flex justify-between">
                  <span className="text-sm">{t('repairs.completionDate')}:</span>
                  <span className="text-sm">{format(new Date(repair.dateCompleted), 'dd MMMM yyyy', { locale: getDateLocale() })}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('repairs.costs')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{t('repairs.parts')}:</span>
                <span className="text-sm">€{partsCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">{t('repairs.labor')}:</span>
                <span className="text-sm">€{laborCost.toFixed(2)}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold">
                <span>{t('repairs.total')}:</span>
                <span>€{totalCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="details" className="mt-6">
        <TabsList>
          <TabsTrigger value="details">{t('repairs.details')}</TabsTrigger>
          <TabsTrigger value="parts">{t('repairs.parts')}</TabsTrigger>
          <TabsTrigger value="photos">{t('repairs.photos')}</TabsTrigger>
          <TabsTrigger value="notes">{t('repairs.notes')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('repairs.description')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea 
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              ) : (
                <p>{repair.description}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('repairs.labor')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">{t('repairs.laborHours')}</label>
                      <Input 
                        type="number"
                        value={editData.laborHours}
                        onChange={(e) => setEditData(prev => ({ ...prev, laborHours: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">{t('repairs.hourlyRate')} (€)</label>
                      <Input 
                        type="number"
                        value={editData.laborRate}
                        onChange={(e) => setEditData(prev => ({ ...prev, laborRate: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                repair.laborHours ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('repairs.laborHours')}</p>
                        <p className="font-medium">{repair.laborHours}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('repairs.hourlyRate')}</p>
                        <p className="font-medium">€{repair.laborRate}/ora</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <p className="font-medium">{t('repairs.totalLabor')}</p>
                      <p className="font-medium">€{laborCost.toFixed(2)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t('repairs.noLaborRecorded')}</p>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('repairs.usedParts')}</CardTitle>
            </CardHeader>
            <CardContent>
              {repair.parts && repair.parts.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('repairs.partName')}</TableHead>
                        <TableHead className="text-right">{t('repairs.quantity')}</TableHead>
                        <TableHead className="text-right">{t('repairs.unitPrice')}</TableHead>
                        <TableHead className="text-right">{t('repairs.total')}</TableHead>
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
                    <p className="font-medium">{t('repairs.totalParts')}</p>
                    <p className="font-medium">€{partsCost.toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t('repairs.noPartsUsed')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="photos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('repairs.photoDocumentation')}</CardTitle>
            </CardHeader>
            <CardContent>
              {repair.photos && repair.photos.length > 0 ? (
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
                            {new Date(photo.dateAdded).toLocaleDateString(i18n.language)}
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
                    {t('repairs.noPhotos')}
                  </p>
                  <Button className="mt-4" onClick={handlePhotoUpload}>
                    <Camera className="mr-2 h-4 w-4" />
                    {t('repairs.addPhoto')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('repairs.notes')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea 
                  value={editData.notes}
                  onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder={t('repairs.addNotes')}
                  rows={6}
                />
              ) : (
                repair.notes ? (
                  <p>{repair.notes}</p>
                ) : (
                  <p className="text-muted-foreground">{t('repairs.noNotes')}</p>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default RepairDetailsPage;
