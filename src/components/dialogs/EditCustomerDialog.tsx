
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditCustomerForm, { EditCustomerFormValues } from '@/components/forms/EditCustomerForm';
import { Customer } from '@/types';

type EditCustomerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSubmit: (values: EditCustomerFormValues) => void;
  isLoading?: boolean;
};

const EditCustomerDialog = ({
  open,
  onOpenChange,
  customer,
  onSubmit,
  isLoading = false
}: EditCustomerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifica Cliente</DialogTitle>
        </DialogHeader>
        
        {customer && (
          <EditCustomerForm 
            customer={customer}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
