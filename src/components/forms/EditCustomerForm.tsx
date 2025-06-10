
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types';
import { Loader2 } from 'lucide-react';

const editCustomerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve essere di almeno 2 caratteri",
  }),
  email: z.string().email({
    message: "Inserisci un indirizzo email valido",
  }),
  phone: z.string().min(8, {
    message: "Il numero di telefono deve essere di almeno 8 caratteri",
  }),
  address: z.string().optional(),
});

export type EditCustomerFormValues = z.infer<typeof editCustomerFormSchema>;

type EditCustomerFormProps = {
  customer: Customer;
  onSubmit: (values: EditCustomerFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const EditCustomerForm = ({ customer, onSubmit, onCancel, isLoading = false }: EditCustomerFormProps) => {
  const form = useForm<EditCustomerFormValues>({
    resolver: zodResolver(editCustomerFormSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome del cliente" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="cliente@esempio.com" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefono</FormLabel>
              <FormControl>
                <Input placeholder="+39 123 456 7890" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indirizzo</FormLabel>
              <FormControl>
                <Input placeholder="Via, Città, CAP (opzionale)" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Annulla
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvataggio...
              </>
            ) : (
              "Salva Modifiche"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCustomerForm;
