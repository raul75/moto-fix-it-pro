
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewCustomerForm, { NewCustomerFormValues } from '../forms/NewCustomerForm';

type NewCustomerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: NewCustomerFormValues) => void;
};

const NewCustomerDialog = ({ open, onOpenChange, onSubmit }: NewCustomerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea Nuovo Cliente</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli del nuovo cliente. I campi con * sono obbligatori.
          </DialogDescription>
        </DialogHeader>
        
        <NewCustomerForm 
          onSubmit={onSubmit} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewCustomerDialog;
