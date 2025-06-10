
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getInventoryItems } from '@/api/inventory';

type UsedPart = {
  id: string;
  partId: string;
  partName: string;
  quantity: number;
  unitPrice: number;
};

type UsedPartsFormProps = {
  repairId: string;
  usedParts: UsedPart[];
  onUpdate: () => void;
};

const UsedPartsForm = ({ repairId, usedParts, onUpdate }: UsedPartsFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch inventory items
  const { data: inventoryItems = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: getInventoryItems,
  });

  // Mock mutations - replace with actual API calls
  const addPartMutation = useMutation({
    mutationFn: async ({ partId, quantity }: { partId: string; quantity: number }) => {
      // Mock API call - replace with actual implementation
      const part = inventoryItems.find(item => item.id === partId);
      if (!part) throw new Error('Part not found');
      if (part.quantity < quantity) throw new Error(t('repairs.insufficientStock'));
      
      return { partId, quantity, unitPrice: part.price };
    },
    onSuccess: () => {
      toast({
        title: t('repairs.partAdded'),
        description: t('repairs.partAddedSuccess'),
      });
      setSelectedPartId('');
      setQuantity(1);
      onUpdate();
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('repairs.partError'),
        variant: 'destructive',
      });
    },
  });

  const removePartMutation = useMutation({
    mutationFn: async (partId: string) => {
      // Mock API call - replace with actual implementation
      return { partId };
    },
    onSuccess: () => {
      toast({
        title: t('repairs.partRemoved'),
        description: t('repairs.partRemovedSuccess'),
      });
      onUpdate();
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('repairs.partError'),
        variant: 'destructive',
      });
    },
  });

  const handleAddPart = () => {
    if (!selectedPartId || quantity <= 0) return;
    addPartMutation.mutate({ partId: selectedPartId, quantity });
  };

  const handleRemovePart = (partId: string) => {
    removePartMutation.mutate(partId);
  };

  const totalPartsValue = usedParts.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('repairs.manageParts')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Parts Section */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium">{t('repairs.addParts')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('repairs.selectPart')}</Label>
              <Select value={selectedPartId} onValueChange={setSelectedPartId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('repairs.selectPart')} />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - €{item.price} ({item.quantity} {t('inventory.inStock')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{t('repairs.quantityUsed')}</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleAddPart}
                disabled={!selectedPartId || quantity <= 0 || addPartMutation.isPending}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('repairs.addSelectedPart')}
              </Button>
            </div>
          </div>
        </div>

        {/* Used Parts Table */}
        <div>
          <h4 className="font-medium mb-3">{t('repairs.usedParts')}</h4>
          {usedParts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {t('repairs.noPartsUsed')}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('repairs.partName')}</TableHead>
                  <TableHead>{t('repairs.quantity')}</TableHead>
                  <TableHead>{t('repairs.unitPrice')}</TableHead>
                  <TableHead>{t('repairs.total')}</TableHead>
                  <TableHead>{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usedParts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.partName}</TableCell>
                    <TableCell>{part.quantity}</TableCell>
                    <TableCell>€{part.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>€{(part.quantity * part.unitPrice).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePart(part.partId)}
                        disabled={removePartMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="font-medium">
                    {t('repairs.totalParts')}
                  </TableCell>
                  <TableCell className="font-medium">
                    €{totalPartsValue.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsedPartsForm;
