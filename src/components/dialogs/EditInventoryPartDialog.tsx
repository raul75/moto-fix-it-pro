
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InventoryPart } from '@/types';

interface EditInventoryPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: InventoryPart | null;
  onSave: (updatedPart: Partial<InventoryPart>) => void;
  isLoading?: boolean;
}

const EditInventoryPartDialog: React.FC<EditInventoryPartDialogProps> = ({
  open,
  onOpenChange,
  part,
  onSave,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<InventoryPart>>({});

  React.useEffect(() => {
    if (part) {
      setFormData({
        name: part.name,
        partNumber: part.partNumber,
        price: part.price,
        cost: part.cost,
        quantity: part.quantity,
        minimumQuantity: part.minimumQuantity,
        location: part.location,
        supplier: part.supplier
      });
    }
  }, [part]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (['price', 'cost', 'quantity', 'minimumQuantity'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!part) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifica Ricambio</DialogTitle>
          <DialogDescription>
            Modifica i dettagli del ricambio selezionato.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-name">Nome Ricambio *</Label>
              <Input 
                id="edit-name" 
                name="name"
                value={formData.name || ''} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-partNumber">Codice *</Label>
              <Input 
                id="edit-partNumber" 
                name="partNumber"
                value={formData.partNumber || ''} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Prezzo (€) *</Label>
                <Input 
                  id="edit-price" 
                  name="price"
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={formData.price || 0} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-cost">Costo (€) *</Label>
                <Input 
                  id="edit-cost" 
                  name="cost"
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={formData.cost || 0} 
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">Quantità *</Label>
                <Input 
                  id="edit-quantity" 
                  name="quantity"
                  type="number" 
                  min="0" 
                  step="1"
                  value={formData.quantity || 0} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-minimumQuantity">Scorta Minima</Label>
                <Input 
                  id="edit-minimumQuantity" 
                  name="minimumQuantity"
                  type="number" 
                  min="0" 
                  step="1"
                  value={formData.minimumQuantity || 0} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Posizione</Label>
              <Input 
                id="edit-location" 
                name="location"
                value={formData.location || ''} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-supplier">Fornitore</Label>
              <Input 
                id="edit-supplier" 
                name="supplier"
                value={formData.supplier || ''} 
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salva Modifiche'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInventoryPartDialog;
