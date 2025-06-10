import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ArrowLeft, 
  Edit, 
  ImagePlus, 
  Save, 
  Loader2, 
  CalendarIcon,
  Image,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Repair, RepairStatus, Photo } from '@/types';
import { getRepairById, updateRepair, uploadPhotoToRepair } from '@/api/repairs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UsedPartsForm from '@/components/forms/UsedPartsForm';
import { cn } from "@/lib/utils";

const RepairDetailsPage = () => {
  const { id: repairId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<RepairStatus>('pending');
  const [laborHours, setLaborHours] = useState<number | undefined>(undefined);
  const [laborRate, setLaborRate] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [completionDate, setCompletionDate] = useState<Date | undefined>(undefined);
  const [photoUploadDialogOpen, setPhotoUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [showPartsForm, setShowPartsForm] = useState(false);

  // Fetch repair data
  const repairQuery = useQuery({
    queryKey: ['repairs', repairId],
    queryFn: () => getRepairById(repairId!),
    enabled: !!repairId,
  });
  
  // Pre-fill form when repair data is available
  React.useEffect(() => {
    if (repairQuery.data) {
      const repair = repairQuery.data;
      setTitle(repair.title);
      setDescription(repair.description);
      setStatus(repair.status);
      setLaborHours(repair.laborHours);
      setLaborRate(repair.laborRate);
      setNotes(repair.notes || '');
      setCompletionDate(repair.dateCompleted ? new Date(repair.dateCompleted) : undefined);
    }
  }, [repairQuery.data]);
  
  // Update repair mutation
  const updateRepairMutation = useMutation({
    mutationFn: (updates: Partial<Repair>) => updateRepair(repairId!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs', repairId] });
      toast({
        title: "Riparazione aggiornata",
        description: "La riparazione è stata aggiornata con successo.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Si è verificato un errore",
        variant: "destructive"
      });
    }
  });
  
  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: () => uploadPhotoToRepair(repairId!, selectedFile!, photoCaption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs', repairId] });
      toast({
        title: "Foto aggiunta",
        description: "La foto è stata aggiunta con successo.",
      });
      setPhotoUploadDialogOpen(false);
      setSelectedFile(null);
      setPhotoCaption('');
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante il caricamento della foto",
        variant: "destructive"
      });
    }
  });

  const handlePartsUpdate = () => {
    repairQuery.refetch();
  };
  
  const handleSave = async () => {
    updateRepairMutation.mutate({
      title,
      description,
      status,
      laborHours,
      laborRate,
      notes,
      dateCompleted: completionDate?.toISOString()
    });
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    if (repairQuery.data) {
      const repair = repairQuery.data;
      setTitle(repair.title);
      setDescription(repair.description);
      setStatus(repair.status);
      setLaborHours(repair.laborHours);
      setLaborRate(repair.laborRate);
      setNotes(repair.notes || '');
      setCompletionDate(repair.dateCompleted ? new Date(repair.dateCompleted) : undefined);
    }
  };
  
  const handlePhotoUpload = async () => {
    uploadPhotoMutation.mutate();
  };
  
  const repair = repairQuery.data;
  
  if (repairQuery.isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-pulse text-muted-foreground">Caricamento dettagli riparazione...</div>
        </div>
      </Layout>
    );
  }
  
  if (!repair || repairQuery.isError) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-muted-foreground">Riparazione non trovata.</div>
        </div>
      </Layout>
    );
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
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Modifica Riparazione' : 'Dettagli Riparazione'}
        </h1>
        {repair.status !== 'completed' && (
          <Button 
            size="sm" 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={updateRepairMutation.isPending}
          >
            {isEditing ? (
              <>
                {updateRepairMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salva
                  </>
                )}
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Modifica
              </>
            )}
          </Button>
        )}
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
            disabled={updateRepairMutation.isPending}
          >
            Annulla
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Riparazione</CardTitle>
              <CardDescription>
                Dettagli sulla riparazione e sullo stato di avanzamento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titolo</Label>
                  {isEditing ? (
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      disabled={updateRepairMutation.isPending}
                    />
                  ) : (
                    <p className="font-semibold">{repair.title}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Stato</Label>
                  {isEditing ? (
                    <Select 
                      value={status} 
                      onValueChange={(value) => setStatus(value as RepairStatus)}
                      disabled={updateRepairMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona uno stato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">In Attesa</SelectItem>
                        <SelectItem value="in-progress">In Corso</SelectItem>
                        <SelectItem value="completed">Completata</SelectItem>
                        <SelectItem value="cancelled">Annullata</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge 
                      variant="secondary"
                      className={
                        status === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
                        status === 'in-progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                        status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        'bg-red-100 text-red-800 hover:bg-red-200'
                      }
                    >
                      {status}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrizione</Label>
                {isEditing ? (
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="resize-none"
                    disabled={updateRepairMutation.isPending}
                  />
                ) : (
                  <p className="font-semibold">{repair.description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="laborHours">Ore di Lavoro</Label>
                  {isEditing ? (
                    <Input 
                      type="number"
                      id="laborHours" 
                      value={laborHours || ''} 
                      onChange={(e) => setLaborHours(parseFloat(e.target.value) || undefined)} 
                      disabled={updateRepairMutation.isPending}
                    />
                  ) : (
                    <p className="font-semibold">{repair.laborHours || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="laborRate">Tariffa Oraria</Label>
                  {isEditing ? (
                    <Input 
                      type="number"
                      id="laborRate" 
                      value={laborRate || ''} 
                      onChange={(e) => setLaborRate(parseFloat(e.target.value) || undefined)} 
                      disabled={updateRepairMutation.isPending}
                    />
                  ) : (
                    <p className="font-semibold">{repair.laborRate ? `€${repair.laborRate.toFixed(2)}` : 'N/A'}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Note</Label>
                {isEditing ? (
                  <Textarea 
                    id="notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    className="resize-none"
                    disabled={updateRepairMutation.isPending}
                  />
                ) : (
                  <p className="font-semibold">{repair.notes || 'N/A'}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="completionDate">Data di Completamento</Label>
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !completionDate && "text-muted-foreground"
                        )}
                        disabled={updateRepairMutation.isPending}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {completionDate ? format(completionDate, "PPP", { locale: it }) : <span>Seleziona una data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={completionDate}
                        onSelect={setCompletionDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <p className="font-semibold">
                    {repair.dateCompleted ? format(new Date(repair.dateCompleted), 'dd MMMM yyyy', { locale: it }) : 'N/A'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Ricambi e Materiali</CardTitle>
                {repair?.status !== 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPartsForm(!showPartsForm)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Ricambio
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {showPartsForm && repair?.status !== 'completed' && (
                <div className="mb-6">
                  <UsedPartsForm
                    repairId={repairId!}
                    usedParts={repair?.parts || []}
                    onUpdate={handlePartsUpdate}
                  />
                </div>
              )}
              
              {!showPartsForm && (
                <>
                  {repair?.parts && repair.parts.length > 0 ? (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ricambio</TableHead>
                            <TableHead className="text-right">Quantità</TableHead>
                            <TableHead className="text-right">Prezzo Unitario</TableHead>
                            <TableHead className="text-right">Totale</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {repair.parts.map(part => (
                            <TableRow key={part.id}>
                              <TableCell>{part.partName}</TableCell>
                              <TableCell className="text-right">{part.quantity}</TableCell>
                              <TableCell className="text-right">€{part.priceEach.toFixed(2)}</TableCell>
                              <TableCell className="text-right">€{(part.quantity * part.priceEach).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={3} className="font-medium">Totale Ricambi</TableCell>
                            <TableCell className="text-right font-medium">
                              €{repair.parts.reduce((sum, part) => sum + (part.quantity * part.priceEach), 0).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nessun ricambio utilizzato</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Foto</CardTitle>
                {repair.status !== 'completed' && (
                  <Button variant="outline" size="sm" onClick={() => setPhotoUploadDialogOpen(true)}>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Aggiungi Foto
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {repair.photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {repair.photos.map(photo => (
                    <div key={photo.id} className="relative">
                      <img src={photo.url} alt={photo.caption || 'Foto riparazione'} className="rounded-md aspect-video object-cover w-full" />
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-2 rounded-b-md">
                          {photo.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nessuna foto presente</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Cliente</CardTitle>
              <CardDescription>
                Dettagli sul cliente e sulla moto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Cliente</Label>
                <p className="font-semibold">{repair.customerId}</p>
              </div>
              <div>
                <Label>Moto</Label>
                <p className="font-semibold">{repair.motorcycleId}</p>
              </div>
              <div>
                <Label>Creato il</Label>
                <p className="font-semibold">
                  {format(new Date(repair.dateCreated), 'dd MMMM yyyy', { locale: it })}
                </p>
              </div>
              <div>
                <Label>Ultimo aggiornamento</Label>
                <p className="font-semibold">
                  {format(new Date(repair.dateUpdated), 'dd MMMM yyyy', { locale: it })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Photo Upload Dialog */}
      <Dialog open={photoUploadDialogOpen} onOpenChange={setPhotoUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Carica Foto</DialogTitle>
            <DialogDescription>
              Aggiungi una foto alla riparazione.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo" className="text-right">
                Foto
              </Label>
              <Input 
                type="file" 
                id="photo" 
                className="col-span-3" 
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="caption" className="text-right">
                Caption
              </Label>
              <Input 
                type="text" 
                id="caption" 
                className="col-span-3" 
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPhotoUploadDialogOpen(false)}>
              Annulla
            </Button>
            <Button type="submit" onClick={handlePhotoUpload} disabled={uploadPhotoMutation.isPending}>
              {uploadPhotoMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Caricamento...
                </>
              ) : (
                "Carica"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default RepairDetailsPage;
