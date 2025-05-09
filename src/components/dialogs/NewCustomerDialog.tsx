
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewCustomerForm, { NewCustomerFormValues } from '@/components/forms/NewCustomerForm';

type NewCustomerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: NewCustomerFormValues) => void;
  isLoading?: boolean;
};

const NewCustomerDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false
}: NewCustomerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuovo Cliente</DialogTitle>
        </DialogHeader>
        
        <NewCustomerForm 
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewCustomerDialog;
