
import React from 'react';
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
import { ChevronLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { customers, motorcycles } from '@/data/mockData';

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

const NewRepairPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                      <FormDescription>
                        Il cliente proprietario della moto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
    </Layout>
  );
};

export default NewRepairPage;
