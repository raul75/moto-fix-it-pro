
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ChevronLeft, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { customers, motorcycles } from '@/data/mockData';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

const formSchema = z.object({
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

const newCustomerSchema = z.object({
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

const NewRepairPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [customersList, setCustomersList] = useState([...customers]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      customerId: "",
      motorcycleId: "",
    },
  });
  
  const newCustomerForm = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  
  const watchCustomerId = form.watch('customerId');
  const customerMotorcycles = watchCustomerId 
    ? motorcycles.filter(m => m.customerId === watchCustomerId)
    : [];

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would make an API call to create the repair
    console.log("Form submitted:", values);
    
    // Show success toast
    toast({
      title: "Riparazione creata",
      description: "La nuova riparazione è stata creata con successo.",
    });
    
    // Navigate back to repairs list
    navigate('/repairs');
  }
  
  function onCreateCustomer(values: z.infer<typeof newCustomerSchema>) {
    // In a real app, this would make an API call to create the customer
    const newCustomer = {
      id: `c-${Date.now()}`,
      ...values,
      address: "",
      createdAt: new Date().toISOString()
    };
    
    // Update local customers list
    const updatedCustomers = [...customersList, newCustomer];
    setCustomersList(updatedCustomers);
    
    // Update the form with the new customer
    form.setValue('customerId', newCustomer.id);
    
    // Show success toast
    toast({
      title: "Cliente creato",
      description: "Il nuovo cliente è stato creato con successo.",
    });
    
    // Close dialog
    setIsNewCustomerDialogOpen(false);
    newCustomerForm.reset();
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
                              {customersList.map(customer => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  {customer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            size="icon"
                            onClick={() => setIsNewCustomerDialogOpen(true)}
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
                  onClick={() => navigate('/repairs')}
                >
                  Annulla
                </Button>
                <Button type="submit">Crea Riparazione</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* New Customer Dialog */}
      <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crea Nuovo Cliente</DialogTitle>
          </DialogHeader>
          
          <Form {...newCustomerForm}>
            <form onSubmit={newCustomerForm.handleSubmit(onCreateCustomer)} className="space-y-4 pt-2">
              <FormField
                control={newCustomerForm.control}
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
                control={newCustomerForm.control}
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
                control={newCustomerForm.control}
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
                  onClick={() => setIsNewCustomerDialogOpen(false)}
                >
                  Annulla
                </Button>
                <Button type="submit">Crea Cliente</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default NewRepairPage;
