
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { getInventoryParts } from '@/api/inventory';
import { addPartToRepair } from '@/api/repairs';
import { useToast } from '@/hooks/use-toast';
import { InventoryPart, UsedPart } from '@/types';

type UsedPartsFormProps = {
  repairId: string;
  parts: UsedPart[];
  onPartsUpdate: () => void;
  isLoading?: boolean;
};

const UsedPartsForm = ({ repairId, parts, onPartsUpdate, isLoading = false }: UsedPartsFormProps) => {
  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: inventoryParts = [] } = useQuery({
    queryKey: ['inventory-parts'],
    queryFn: getInventoryParts
  });

  const selectedPart = inventoryParts.find(p => p.id === selectedPartId);

  const handleAddPart = async () => {
    if (!selectedPart) {
      toast({
        title: "Errore",
        description: "Seleziona un ricambio dall'inventario",
        variant: "destructive"
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        title: "Errore", 
        description: "La quantità deve essere maggiore di 0",
        variant: "destructive"
      });
      return;
    }

    try {
      const priceToUse = customPrice !== null ? customPrice : selectedPart.price;
      
      await addPartToRepair(
        repairId,
        selectedPart.id,
        selectedPart.name,
        quantity,
        priceToUse
      );

      toast({
        title: "Ricambio aggiunto",
        description: `${selectedPart.name} aggiunto alla riparazione`,
      });

      // Reset form
      setSelectedPartId('');
      setQuantity(1);
      setCustomPrice(null);
      onPartsUpdate();
    } catch (error) {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore durante l'aggiunta del ricambio",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Ricambi Utilizzati</h3>
      
      {/* Add new part form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
        <div>
          <label className="text-sm font-medium">Ricambio</label>
          <Select value={selectedPartId} onValueChange={setSelectedPartId} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona ricambio" />
            </SelectTrigger>
            <SelectContent>
              {inventoryParts.map(part => (
                <SelectItem key={part.id} value={part.id}>
                  {part.name} - €{part.price.toFixed(2)} (Disp: {part.quantity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Quantità</label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Prezzo personalizzato (€)</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder={selectedPart ? selectedPart.price.toFixed(2) : "0.00"}
            value={customPrice || ''}
            onChange={(e) => setCustomPrice(e.target.value ? parseFloat(e.target.value) : null)}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-end">
          <Button 
            onClick={handleAddPart} 
            disabled={!selectedPartId || isLoading}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi
          </Button>
        </div>
      </div>

      {/* Parts table */}
      {parts.length > 0 && (
        <div className="border rounded-lg">
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
              {parts.map(part => (
                <TableRow key={part.id}>
                  <TableCell>{part.partName}</TableCell>
                  <TableCell className="text-right">{part.quantity}</TableCell>
                  <TableCell className="text-right">€{part.priceEach.toFixed(2)}</TableCell>
                  <TableCell className="text-right">€{(part.quantity * part.priceEach).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="font-medium">Totale Ricambi</TableCell>
                <TableCell className="text-right font-medium">
                  €{parts.reduce((sum, part) => sum + (part.quantity * part.priceEach), 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsedPartsForm;
