
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
import { DialogFooter } from '@/components/ui/dialog';
import { Customer } from '@/types';

export const newCustomerSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve essere di almeno 2 caratteri",
  }),
  email: z.string().email({
    message: "Inserisci un'email valida",
  }),
  phone: z.string().min(5, {
    message: "Il numero di telefono deve essere di almeno 5 caratteri",
  }),
});

type NewCustomerFormProps = {
  onSubmit: (values: z.infer<typeof newCustomerSchema>) => void;
  onCancel: () => void;
};

export type NewCustomerFormValues = z.infer<typeof newCustomerSchema>;

const NewCustomerForm = ({ onSubmit, onCancel }: NewCustomerFormProps) => {
  const form = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
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
                <Input type="email" placeholder="cliente@esempio.com" {...field} />
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
                <Input placeholder="+39 123 456 7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Annulla
          </Button>
          <Button type="submit">Crea Cliente</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NewCustomerForm;
