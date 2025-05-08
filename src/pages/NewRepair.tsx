
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { customers, motorcycles } from '@/data/mockData';
import { Customer, Motorcycle } from '@/types';
import NewCustomerDialog from '@/components/dialogs/NewCustomerDialog';
import RepairForm, { RepairFormValues } from '@/components/forms/RepairForm';
import { NewCustomerFormValues } from '@/components/forms/NewCustomerForm';
import { createCustomer } from '@/utils/customerUtils';
import { createMotorcycle } from '@/utils/motorcycleUtils';

const NewRepairPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [customersList, setCustomersList] = useState<Customer[]>([...customers]);
  const [motorcyclesList, setMotorcyclesList] = useState<Motorcycle[]>([...motorcycles]);

  function onSubmit(values: RepairFormValues) {
    console.log("Form submitted:", values);
    
    // Handle new motorcycle creation if needed
    let motorcycleId = values.motorcycleId;
    if (!motorcycleId && values.newMotorcycle) {
      // Create a new motorcycle and get its ID
      const newMotorcycle = createMotorcycle({
        ...values.newMotorcycle,
        customerId: values.customerId
      });
      
      // Add to local state
      setMotorcyclesList([...motorcyclesList, newMotorcycle]);
      motorcycleId = newMotorcycle.id;
      
      toast({
        title: "Motocicletta creata",
        description: "La nuova motocicletta è stata aggiunta con successo.",
      });
    }
    
    // Handle photo upload (in a real app, this would be an API call)
    if (values.intakePhoto) {
      console.log("Photo to upload:", values.intakePhoto);
      // In a real app, you would upload the photo to a server here
    }
    
    // Show success toast
    toast({
      title: "Riparazione creata",
      description: "La nuova riparazione è stata creata con successo.",
    });
    
    // Navigate back to repairs list
    navigate('/repairs');
  }
  
  function onCreateCustomer(values: NewCustomerFormValues) {
    // Create new customer
    const newCustomer = createCustomer(values);
    
    // Update local customers list
    const updatedCustomers: Customer[] = [...customersList, newCustomer];
    setCustomersList(updatedCustomers);
    
    // Show success toast
    toast({
      title: "Cliente creato",
      description: "Il nuovo cliente è stato creato con successo.",
    });
    
    // Close dialog
    setIsNewCustomerDialogOpen(false);
  }

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => navigate('/repairs')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Nuova Riparazione</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dettagli Riparazione</CardTitle>
        </CardHeader>
        <CardContent>
          <RepairForm
            customers={customersList}
            motorcycles={motorcyclesList}
            onSubmit={onSubmit}
            onCancel={() => navigate('/repairs')}
            onNewCustomerClick={() => setIsNewCustomerDialogOpen(true)}
          />
        </CardContent>
      </Card>
      
      {/* New Customer Dialog */}
      <NewCustomerDialog
        open={isNewCustomerDialogOpen}
        onOpenChange={setIsNewCustomerDialogOpen}
        onSubmit={onCreateCustomer}
      />
    </Layout>
  );
};

export default NewRepairPage;
