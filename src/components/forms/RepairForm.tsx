import React, { useState } from 'react';
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
import { Plus, Upload, Bike, Image, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  motorcycleId: z.string().optional(),
  // New motorcycle fields
  newMotorcycle: z.object({
    make: z.string().min(2, "La marca deve essere di almeno 2 caratteri").optional(),
    model: z.string().min(2, "Il modello deve essere di almeno 2 caratteri").optional(),
    year: z.string().min(4, "L'anno deve essere di 4 caratteri").optional(),
    licensePlate: z.string().min(5, "La targa deve essere di almeno 5 caratteri").optional(),
    vin: z.string().optional(),
  }).optional(),
  intakePhoto: z.any().optional(),
}).refine((data) => {
  // Either motorcycleId or newMotorcycle must be provided
  if (!data.motorcycleId) {
    return data.newMotorcycle && 
           data.newMotorcycle.make && 
           data.newMotorcycle.model && 
           data.newMotorcycle.year && 
           data.newMotorcycle.licensePlate;
  }
  return true;
}, {
  message: "Seleziona una moto esistente o inserisci i dettagli di una nuova moto",
  path: ["motorcycleId"]
});

export type RepairFormValues = z.infer<typeof repairFormSchema>;

type RepairFormProps = {
  customers: Customer[];
  motorcycles: Motorcycle[];
  onSubmit: (values: RepairFormValues) => void;
  onCancel: () => void;
  onNewCustomerClick: () => void;
  isLoading?: boolean;
};

const RepairForm = ({ 
  customers, 
  motorcycles, 
  onSubmit, 
  onCancel, 
  onNewCustomerClick,
  isLoading = false 
}: RepairFormProps) => {
  const [motorcycleTab, setMotorcycleTab] = useState<string>("existing");
  const [uploadedPhotoURL, setUploadedPhotoURL] = useState<string | null>(null);
  
  const form = useForm<RepairFormValues>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      title: "",
      description: "",
      customerId: "",
      motorcycleId: "",
      newMotorcycle: {
        make: "",
        model: "",
        year: "",
        licensePlate: "",
        vin: "",
      },
      intakePhoto: null,
    },
  });
  
  const watchCustomerId = form.watch('customerId');
  const customerMotorcycles = watchCustomerId 
    ? motorcycles.filter(m => m.customerId === watchCustomerId)
    : [];
    
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("intakePhoto", file);
      // Create a preview URL for the uploaded image
      const url = URL.createObjectURL(file);
      setUploadedPhotoURL(url);
    }
  };

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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
          
          {/* Motorcycle Selection with Tabs for existing or new */}
          <div className="space-y-2">
            <FormLabel>Motocicletta</FormLabel>
            <Tabs value={motorcycleTab} onValueChange={setMotorcycleTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing" disabled={isLoading}>Esistente</TabsTrigger>
                <TabsTrigger value="new" disabled={isLoading}>Nuova</TabsTrigger>
              </TabsList>
              
              <TabsContent value="existing">
                <FormField
                  control={form.control}
                  name="motorcycleId"
                  render={({ field }) => (
                    <FormItem>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Clear new motorcycle data when selecting existing
                          form.setValue("newMotorcycle", {
                            make: "",
                            model: "",
                            year: "",
                            licensePlate: "",
                            vin: ""
                          });
                        }} 
                        value={field.value}
                        disabled={!watchCustomerId || customerMotorcycles.length === 0 || isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={!watchCustomerId ? "Seleziona prima un cliente" : 
                              customerMotorcycles.length === 0 ? "Nessuna moto trovata" : "Seleziona una moto"} />
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
              </TabsContent>
              
              <TabsContent value="new">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="newMotorcycle.make"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marca</FormLabel>
                            <FormControl>
                              <Input placeholder="Honda, Yamaha, ecc." {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="newMotorcycle.model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modello</FormLabel>
                            <FormControl>
                              <Input placeholder="CBR, MT-07, ecc." {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="newMotorcycle.year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Anno</FormLabel>
                            <FormControl>
                              <Input placeholder="2023" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="newMotorcycle.licensePlate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Targa</FormLabel>
                            <FormControl>
                              <Input placeholder="AB123CD" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="newMotorcycle.vin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numero di Telaio (VIN)</FormLabel>
                          <FormControl>
                            <Input placeholder="Opzionale" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormDescription>
                            Il numero di telaio della moto (opzionale)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo</FormLabel>
              <FormControl>
                <Input placeholder="Es. Manutenzione programmata" {...field} disabled={isLoading} />
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
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Dettagli sul problema o sull'intervento da effettuare
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Intake Photo Upload */}
        <FormField
          control={form.control}
          name="intakePhoto"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Foto di Ingresso</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Upload className="mr-2 h-4 w-4" /> Carica Foto
                    </Button>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                  
                  {uploadedPhotoURL && (
                    <div className="p-2 border rounded-md">
                      <img 
                        src={uploadedPhotoURL} 
                        alt="Anteprima foto" 
                        className="max-h-48 mx-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Foto della moto all'ingresso in officina
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
                Creazione in corso...
              </>
            ) : (
              "Crea Riparazione"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RepairForm;
