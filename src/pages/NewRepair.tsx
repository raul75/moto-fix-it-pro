
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Customer, Motorcycle } from '@/types';
import NewCustomerDialog from '@/components/dialogs/NewCustomerDialog';
import RepairForm, { RepairFormValues } from '@/components/forms/RepairForm';
import { NewCustomerFormValues } from '@/components/forms/NewCustomerForm';
import { createCustomer } from '@/utils/customerUtils';
import { createMotorcycle } from '@/utils/motorcycleUtils';
import { getCustomers } from '@/api/customers';
import { getMotorcycles } from '@/api/motorcycles';
import { createRepairInDb, uploadPhotoToRepair } from '@/api/repairs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const NewRepairPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);

  // Fetch customers and motorcycles with React Query
  const { data: customersList = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    initialData: []
  });

  const { data: motorcyclesList = [] } = useQuery({
    queryKey: ['motorcycles'],
    queryFn: getMotorcycles,
    initialData: []
  });

  // Create repair mutation
  const createRepairMutation = useMutation({
    mutationFn: async (values: RepairFormValues) => {
      // Handle new motorcycle creation if needed
      let motorcycleId = values.motorcycleId;
      if (!motorcycleId && values.newMotorcycle) {
        // Make sure all required fields are available before creating a new motorcycle
        if (
          values.customerId && 
          values.newMotorcycle.make && 
          values.newMotorcycle.model && 
          values.newMotorcycle.year && 
          values.newMotorcycle.licensePlate
        ) {
          // Create a new motorcycle and get its ID
          const newMotorcycle = await createMotorcycle({
            make: values.newMotorcycle.make,
            model: values.newMotorcycle.model,
            year: values.newMotorcycle.year,
            licensePlate: values.newMotorcycle.licensePlate,
            vin: values.newMotorcycle.vin,
            customerId: values.customerId
          });
          
          motorcycleId = newMotorcycle.id;
          
          // Invalidate motorcycles query to refresh data
          queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
          
          toast({
            title: "Motocicletta creata",
            description: "La nuova motocicletta è stata aggiunta con successo.",
          });
        } else {
          throw new Error("Dati della moto incompleti");
        }
      }

      // Ensure we have a motorcycle ID
      if (!motorcycleId) {
        throw new Error("È necessario selezionare o creare una moto");
      }
      
      // Create the repair
      const newRepair = await createRepairInDb({
        motorcycleId,
        customerId: values.customerId,
        title: values.title,
        description: values.description,
        status: 'pending'
      });
      
      // Handle photo upload if present
      if (values.intakePhoto) {
        await uploadPhotoToRepair(
          newRepair.id,
          values.intakePhoto,
          "Foto di ingresso"
        );
      }
      
      return newRepair;
    },
    onSuccess: () => {
      // Invalidate repairs query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
      
      // Show success toast
      toast({
        title: "Riparazione creata",
        description: "La nuova riparazione è stata creata con successo.",
      });
      
      // Navigate back to repairs list
      navigate('/repairs');
    },
    onError: (error) => {
      console.error("Error creating repair:", error);
      toast({
        title: "Errore nella creazione",
        description: error instanceof Error ? error.message : "Si è verificato un errore",
        variant: "destructive"
      });
    }
  });
  
  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (newCustomer) => {
      // Update local customers list via query invalidation
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      // Show success toast
      toast({
        title: "Cliente creato",
        description: "Il nuovo cliente è stato creato con successo.",
      });
      
      // Close dialog
      setIsNewCustomerDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Errore nella creazione",
        description: error instanceof Error ? error.message : "Si è verificato un errore",
        variant: "destructive"
      });
    }
  });

  function onSubmit(values: RepairFormValues) {
    createRepairMutation.mutate(values);
  }
  
  function onCreateCustomer(values: NewCustomerFormValues) {
    createCustomerMutation.mutate(values);
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
            isLoading={createRepairMutation.isPending}
          />
        </CardContent>
      </Card>
      
      {/* New Customer Dialog */}
      <NewCustomerDialog
        open={isNewCustomerDialogOpen}
        onOpenChange={setIsNewCustomerDialogOpen}
        onSubmit={onCreateCustomer}
        isLoading={createCustomerMutation.isPending}
      />
    </Layout>
  );
};

export default NewRepairPage;
