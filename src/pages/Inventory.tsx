
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { InventoryPart } from '@/types';
import EditInventoryPartDialog from '@/components/dialogs/EditInventoryPartDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInventoryParts, createInventoryPart, updateInventoryPart, deleteInventoryPart } from '@/api/inventory';

const InventoryPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<InventoryPart | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // New part form state
  const [newPart, setNewPart] = useState<Partial<InventoryPart>>({
    name: '',
    partNumber: '',
    price: 0,
    cost: 0,
    quantity: 0,
    minimumQuantity: 0,
    location: '',
    supplier: ''
  });

  // Fetch inventory parts with React Query
  const { data: inventoryParts = [], isLoading } = useQuery({
    queryKey: ['inventory-parts'],
    queryFn: getInventoryParts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Create part mutation
  const createPartMutation = useMutation({
    mutationFn: createInventoryPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-parts'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: t('inventory.partAdded'),
        description: t('inventory.partAddedSuccess', { name: newPart.name }),
      });
      setDialogOpen(false);
      setNewPart({
        name: '',
        partNumber: '',
        price: 0,
        cost: 0,
        quantity: 0,
        minimumQuantity: 0,
        location: '',
        supplier: ''
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('inventory.updateError'),
        variant: "destructive"
      });
    }
  });

  // Update part mutation
  const updatePartMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InventoryPart> }) => 
      updateInventoryPart(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-parts'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: t('inventory.partUpdated'),
        description: t('inventory.updateSuccess'),
      });
      setEditDialogOpen(false);
      setSelectedPart(null);
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('inventory.updateError'),
        variant: "destructive"
      });
    }
  });

  // Delete part mutation
  const deletePartMutation = useMutation({
    mutationFn: deleteInventoryPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-parts'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: t('inventory.partDeleted'),
        description: t('inventory.deleteSuccess'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('inventory.deleteError'),
        variant: "destructive"
      });
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (['price', 'cost', 'quantity', 'minimumQuantity'].includes(name)) {
      setNewPart(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setNewPart(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmitNewPart = (e: React.FormEvent) => {
    e.preventDefault();
    createPartMutation.mutate(newPart as Omit<InventoryPart, 'id'>);
  };

  // Handle edit part
  const handleEditPart = (part: InventoryPart) => {
    setSelectedPart(part);
    setEditDialogOpen(true);
  };

  // Handle save edited part
  const handleSaveEditedPart = (updates: Partial<InventoryPart>) => {
    if (selectedPart) {
      updatePartMutation.mutate({ id: selectedPart.id, updates });
    }
  };

  // Handle delete part
  const handleDeletePart = (part: InventoryPart) => {
    if (confirm(t('inventory.deleteConfirm', { name: part.name }))) {
      deletePartMutation.mutate(part.id);
    }
  };

  // Filter parts based on search term
  const filteredParts = inventoryParts.filter(part => {
    const searchLower = searchTerm.toLowerCase();
    return (
      part.name.toLowerCase().includes(searchLower) ||
      part.partNumber.toLowerCase().includes(searchLower)
    );
  });

  // Check if part is low stock
  const isLowStock = (part: InventoryPart) => {
    return part.quantity <= (part.minimumQuantity || 0);
  };

  // Export inventory to CSV
  const exportInventory = () => {
    const headers = [t('inventory.partName'), t('inventory.partNumber'), t('inventory.price'), t('inventory.cost'), t('inventory.quantity'), t('inventory.minimumQuantity'), t('inventory.location'), t('inventory.supplier')];
    
    let csvContent = headers.join(',') + '\n';
    
    inventoryParts.forEach(part => {
      const row = [
        `"${part.name.replace(/"/g, '""')}"`,
        `"${part.partNumber.replace(/"/g, '""')}"`,
        part.price,
        part.cost,
        part.quantity,
        part.minimumQuantity || 0,
        `"${(part.location || '').replace(/"/g, '""')}"`,
        `"${(part.supplier || '').replace(/"/g, '""')}"`
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: t('inventory.inventoryExported'),
      description: t('inventory.csvDownloaded'),
    });
  };

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">{t('inventory.title')}</h1>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('inventory.searchPlaceholder')}
                className="pl-8 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="flex items-center gap-2 w-full sm:w-auto" 
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('inventory.newPart')}</span>
              <span className="sm:hidden">{t('common.add')}</span>
            </Button>
          </div>
        </div>

        {/* Table - Responsive */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">{t('inventory.partName')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('inventory.partNumber')}</TableHead>
                <TableHead className="text-right min-w-[80px]">{t('inventory.price')}</TableHead>
                <TableHead className="text-right hidden md:table-cell">{t('inventory.cost')}</TableHead>
                <TableHead className="text-right min-w-[90px]">{t('inventory.quantity')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('inventory.location')}</TableHead>
                <TableHead className="hidden xl:table-cell">{t('inventory.supplier')}</TableHead>
                <TableHead className="text-right min-w-[80px]">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">{t('inventory.loadingParts')}</p>
                  </TableCell>
                </TableRow>
              ) : filteredParts.map(part => (
                <TableRow key={part.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {isLowStock(part) && (
                          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        )}
                        <span className="font-medium truncate">{part.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground sm:hidden">{part.partNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{part.partNumber}</TableCell>
                  <TableCell className="text-right">€{part.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right hidden md:table-cell">€{part.cost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span>{part.quantity}</span>
                      {isLowStock(part) && (
                        <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200">
                          {t('inventory.lowStock')}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{part.location || "—"}</TableCell>
                  <TableCell className="hidden xl:table-cell">{part.supplier || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPart(part)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePart(part)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {!isLoading && filteredParts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">{t('inventory.noItems')}</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Footer - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{t('inventory.totalParts')} {inventoryParts.length}</p>
            <p>{t('inventory.warehouseValue')} €{inventoryParts.reduce((sum, part) => sum + (part.cost * part.quantity), 0).toFixed(2)}</p>
          </div>
          <Button variant="outline" onClick={exportInventory} className="w-full sm:w-auto">
            {t('inventory.exportInventory')}
          </Button>
        </div>

        {/* Dialog for new part */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('inventory.addPartTitle')}</DialogTitle>
              <DialogDescription>
                {t('inventory.addPartDescription')}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitNewPart} className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="name">{t('inventory.partName')} *</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={newPart.name} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="partNumber">{t('inventory.partNumber')} *</Label>
                  <Input 
                    id="partNumber" 
                    name="partNumber"
                    value={newPart.partNumber} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">{t('inventory.price')} (€) *</Label>
                    <Input 
                      id="price" 
                      name="price"
                      type="number" 
                      min="0" 
                      step="0.01"
                      value={newPart.price} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="cost">{t('inventory.cost')} (€) *</Label>
                    <Input 
                      id="cost" 
                      name="cost"
                      type="number" 
                      min="0" 
                      step="0.01"
                      value={newPart.cost} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">{t('inventory.quantity')} *</Label>
                    <Input 
                      id="quantity" 
                      name="quantity"
                      type="number" 
                      min="0" 
                      step="1"
                      value={newPart.quantity} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="minimumQuantity">{t('inventory.minimumQuantity')}</Label>
                    <Input 
                      id="minimumQuantity" 
                      name="minimumQuantity"
                      type="number" 
                      min="0" 
                      step="1"
                      value={newPart.minimumQuantity} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="location">{t('inventory.location')}</Label>
                  <Input 
                    id="location" 
                    name="location"
                    value={newPart.location} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="supplier">{t('inventory.supplier')}</Label>
                  <Input 
                    id="supplier" 
                    name="supplier"
                    value={newPart.supplier} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={createPartMutation.isPending} className="w-full sm:w-auto">
                  {createPartMutation.isPending ? t('inventory.saving') : t('common.save')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Part Dialog */}
        <EditInventoryPartDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          part={selectedPart}
          onSave={handleSaveEditedPart}
          isLoading={updatePartMutation.isPending}
        />
      </div>
    </Layout>
  );
};

export default InventoryPage;
