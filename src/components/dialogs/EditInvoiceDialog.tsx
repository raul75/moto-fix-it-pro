
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Invoice, Customer } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInvoice } from '@/api/invoices';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type EditInvoiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
  customers: Customer[];
};

const EditInvoiceDialog = ({
  open,
  onOpenChange,
  invoice,
  customers
}: EditInvoiceDialogProps) => {
  const [formData, setFormData] = useState({
    number: invoice.number,
    customerId: invoice.customerId,
    date: invoice.date,
    dueDate: invoice.dueDate,
    subtotal: invoice.subtotal.toString(),
    tax: invoice.tax.toString(),
    total: invoice.total.toString(),
    notes: invoice.notes || '',
    status: invoice.status
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateInvoiceMutation = useMutation({
    mutationFn: (updates: Partial<Invoice>) => updateInvoice(invoice.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Fattura aggiornata",
        description: "Le modifiche sono state salvate con successo",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'aggiornamento della fattura",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    const subtotal = parseFloat(formData.subtotal) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const total = subtotal + tax;
    setFormData(prev => ({ ...prev, total: total.toString() }));
  }, [formData.subtotal, formData.tax]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const updates: Partial<Invoice> = {
      number: formData.number,
      customerId: formData.customerId,
      date: formData.date,
      dueDate: formData.dueDate,
      subtotal: parseFloat(formData.subtotal) || 0,
      tax: parseFloat(formData.tax) || 0,
      total: parseFloat(formData.total) || 0,
      notes: formData.notes,
      status: formData.status as 'draft' | 'sent' | 'paid' | 'overdue'
    };

    updateInvoiceMutation.mutate(updates);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifica Fattura</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="number" className="text-right">Numero</Label>
            <Input
              id="number"
              className="col-span-3"
              value={formData.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">Cliente</Label>
            <Select value={formData.customerId} onValueChange={(value) => handleInputChange('customerId', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleziona cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Data</Label>
            <Input
              id="date"
              type="date"
              className="col-span-3"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">Scadenza</Label>
            <Input
              id="dueDate"
              type="date"
              className="col-span-3"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subtotal" className="text-right">Subtotale</Label>
            <Input
              id="subtotal"
              type="number"
              step="0.01"
              className="col-span-3"
              value={formData.subtotal}
              onChange={(e) => handleInputChange('subtotal', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tax" className="text-right">IVA</Label>
            <Input
              id="tax"
              type="number"
              step="0.01"
              className="col-span-3"
              value={formData.tax}
              onChange={(e) => handleInputChange('tax', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">Totale</Label>
            <Input
              id="total"
              type="number"
              step="0.01"
              className="col-span-3"
              value={formData.total}
              readOnly
              disabled
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Stato</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleziona stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Bozza</SelectItem>
                <SelectItem value="sent">Inviata</SelectItem>
                <SelectItem value="paid">Pagata</SelectItem>
                <SelectItem value="overdue">Scaduta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Note</Label>
            <Textarea
              id="notes"
              className="col-span-3"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Note aggiuntive..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={updateInvoiceMutation.isPending}
          >
            {updateInvoiceMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salva Modifiche"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvoiceDialog;
