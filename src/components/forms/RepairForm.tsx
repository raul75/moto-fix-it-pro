
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Customer, Motorcycle } from '@/types';
import { Plus } from 'lucide-react';

export const repairFormSchema = z.object({
  title: z.string().min(3, {
    message: "Il titolo deve essere di almeno 3 caratteri",
  }),
  description: z.string().min(10, {
    message: "La descrizione deve essere di almeno 10 caratteri",
  }),
  customerId: z.string({
    required_error: "Seleziona un cliente",
  }),
  motorcycleId: z.string({
    required_error: "Seleziona una moto",
  }),
});

export type RepairFormValues = z.infer<typeof repairFormSchema>;

type RepairFormProps = {
  customers: Customer[];
  motorcycles: Motorcycle[];
  onSubmit: (values: RepairFormValues) => void;
  onCancel: () => void;
  onNewCustomerClick: () => void;
};

const RepairForm = ({ 
  customers, 
  motorcycles, 
  onSubmit, 
  onCancel, 
  onNewCustomerClick 
}: RepairFormProps) => {
  const form = useForm<RepairFormValues>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      title: "",
      description: "",
      customerId: "",
      motorcycleId: "",
    },
  });
  
  const watchCustomerId = form.watch('customerId');
  const customerMotorcycles = watchCustomerId 
    ? motorcycles.filter(m => m.customerId === watchCustomerId)
    : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <div className="flex gap-2">
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Seleziona un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      size="icon"
                      onClick={onNewCustomerClick}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>
                    Il cliente proprietario della moto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="motorcycleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motocicletta</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={!watchCustomerId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={watchCustomerId ? "Seleziona una moto" : "Seleziona prima un cliente"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customerMotorcycles.map(motorcycle => (
                      <SelectItem key={motorcycle.id} value={motorcycle.id}>
                        {motorcycle.make} {motorcycle.model} - {motorcycle.licensePlate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  La moto da riparare
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo</FormLabel>
              <FormControl>
                <Input placeholder="Es. Manutenzione programmata" {...field} />
              </FormControl>
              <FormDescription>
                Un titolo breve per la riparazione
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrivi il problema o l'intervento da effettuare" 
                  className="resize-none min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Dettagli sul problema o sull'intervento da effettuare
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Annulla
          </Button>
          <Button type="submit">Crea Riparazione</Button>
        </div>
      </form>
    </Form>
  );
};

export default RepairForm;
