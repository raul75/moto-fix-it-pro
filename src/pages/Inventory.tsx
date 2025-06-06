import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { InventoryPart } from '@/types';
import EditInventoryPartDialog from '@/components/dialogs/EditInventoryPartDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInventoryParts, createInventoryPart, updateInventoryPart, deleteInventoryPart } from '@/api/inventory';

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<InventoryPart | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // New part form state
  const [newPart, setNewPart] = useState<Partial<InventoryPart>>({
    name: '',
    partNumber: '',
    price: 0,
    cost: 0,
    quantity: 0,
    minimumQuantity: 0,
    location: '',
    supplier: ''
  });

  // Fetch inventory parts with React Query
  const { data: inventoryParts = [], isLoading } = useQuery({
    queryKey: ['inventory-parts'],
    queryFn: getInventoryParts,
    initialData: []
  });

  // Create part mutation
  const createPartMutation = useMutation({
    mutationFn: createInventoryPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-parts'] });
      toast({
        title: "Ricambio aggiunto",
        description: `${newPart.name} è stato aggiunto al magazzino.`,
      });
      setDialogOpen(false);
      setNewPart({
        name: '',
        partNumber: '',
        price: 0,
        cost: 0,
        quantity: 0,
        minimumQuantity: 0,
        location: '',
        supplier: ''
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore durante l'aggiunta del ricambio",
        variant: "destructive"
      });
    }
  });

  // Update part mutation
  const updatePartMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InventoryPart> }) => 
      updateInventoryPart(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-parts'] });
      toast({
        title: "Ricambio aggiornato",
        description: "Le modifiche sono state salvate con successo.",
      });
      setEditDialogOpen(false);
      setSelectedPart(null);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore durante l'aggiornamento del ricambio",
        variant: "destructive"
      });
    }
  });

  // Delete part mutation
  const deletePartMutation = useMutation({
    mutationFn: deleteInventoryPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-parts'] });
      toast({
        title: "Ricambio eliminato",
        description: "Il ricambio è stato eliminato dal magazzino.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore durante l'eliminazione del ricambio",
        variant: "destructive"
      });
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (['price', 'cost', 'quantity', 'minimumQuantity'].includes(name)) {
      setNewPart(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setNewPart(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmitNewPart = (e: React.FormEvent) => {
    e.preventDefault();
    createPartMutation.mutate(newPart as Omit<InventoryPart, 'id'>);
  };

  // Handle edit part
  const handleEditPart = (part: InventoryPart) => {
    setSelectedPart(part);
    setEditDialogOpen(true);
  };

  // Handle save edited part
  const handleSaveEditedPart = (updates: Partial<InventoryPart>) => {
    if (selectedPart) {
      updatePartMutation.mutate({ id: selectedPart.id, updates });
    }
  };

  // Handle delete part
  const handleDeletePart = (part: InventoryPart) => {
    if (confirm(`Sei sicuro di voler eliminare "${part.name}"?`)) {
      deletePartMutation.mutate(part.id);
    }
  };

  // Filter parts based on search term
  const filteredParts = inventoryParts.filter(part => {
    const searchLower = searchTerm.toLowerCase();
    return (
      part.name.toLowerCase().includes(searchLower) ||
      part.partNumber.toLowerCase().includes(searchLower)
    );
  });

  // Check if part is low stock
  const isLowStock = (part: InventoryPart) => {
    return part.quantity <= (part.minimumQuantity || 0);
  };

  // Export inventory to CSV
  const exportInventory = () => {
    const headers = ['Nome Ricambio', 'Codice', 'Prezzo', 'Costo', 'Quantità', 'Min Quantità', 'Posizione', 'Fornitore'];
    
    let csvContent = headers.join(',') + '\n';
    
    inventoryParts.forEach(part => {
      const row = [
        `"${part.name.replace(/"/g, '""')}"`,
        `"${part.partNumber.replace(/"/g, '""')}"`,
        part.price,
        part.cost,
        part.quantity,
        part.minimumQuantity || 0,
        `"${(part.location || '').replace(/"/g, '""')}"`,
        `"${(part.supplier || '').replace(/"/g, '""')}"`
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Inventario esportato",
      description: "Il file CSV è stato scaricato.",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Magazzino</h1>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca ricambi..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex gap-1" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuovo Ricambio
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Ricambio</TableHead>
              <TableHead>Codice</TableHead>
              <TableHead className="text-right">Prezzo</TableHead>
              <TableHead className="text-right">Costo</TableHead>
              <TableHead className="text-right">Quantità</TableHead>
              <TableHead>Posizione</TableHead>
              <TableHead>Fornitore</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">Caricamento...</p>
                </TableCell>
              </TableRow>
            ) : filteredParts.map(part => (
              <TableRow key={part.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {isLowStock(part) && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    {part.name}
                  </div>
                </TableCell>
                <TableCell>{part.partNumber}</TableCell>
                <TableCell className="text-right">€{part.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">€{part.cost.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span>{part.quantity}</span>
                    {isLowStock(part) && (
                      <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200">
                        Scorta bassa
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{part.location || "—"}</TableCell>
                <TableCell>{part.supplier || "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPart(part)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePart(part)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {!isLoading && filteredParts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">Nessun ricambio trovato.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Totale ricambi: {inventoryParts.length}
          </p>
          <p className="text-sm text-muted-foreground">
            Valore magazzino: €{inventoryParts.reduce((sum, part) => sum + (part.cost * part.quantity), 0).toFixed(2)}
          </p>
        </div>
        <Button variant="outline" onClick={exportInventory}>Esporta Inventario</Button>
      </div>

      {/* Dialog for new part */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Ricambio</DialogTitle>
            <DialogDescription>
              Compila i dettagli per aggiungere un nuovo ricambio all'inventario.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitNewPart} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name">Nome Ricambio *</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={newPart.name} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="partNumber">Codice *</Label>
                <Input 
                  id="partNumber" 
                  name="partNumber"
                  value={newPart.partNumber} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Prezzo (€) *</Label>
                  <Input 
                    id="price" 
                    name="price"
                    type="number" 
                    min="0" 
                    step="0.01"
                    value={newPart.price} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cost">Costo (€) *</Label>
                  <Input 
                    id="cost" 
                    name="cost"
                    type="number" 
                    min="0" 
                    step="0.01"
                    value={newPart.cost} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantità *</Label>
                  <Input 
                    id="quantity" 
                    name="quantity"
                    type="number" 
                    min="0" 
                    step="1"
                    value={newPart.quantity} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="minimumQuantity">Scorta Minima</Label>
                  <Input 
                    id="minimumQuantity" 
                    name="minimumQuantity"
                    type="number" 
                    min="0" 
                    step="1"
                    value={newPart.minimumQuantity} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Posizione</Label>
                <Input 
                  id="location" 
                  name="location"
                  value={newPart.location} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="supplier">Fornitore</Label>
                <Input 
                  id="supplier" 
                  name="supplier"
                  value={newPart.supplier} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annulla</Button>
              <Button type="submit" disabled={createPartMutation.isPending}>
                {createPartMutation.isPending ? 'Salvando...' : 'Salva Ricambio'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Part Dialog */}
      <EditInventoryPartDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        part={selectedPart}
        onSave={handleSaveEditedPart}
        isLoading={updatePartMutation.isPending}
      />
    </Layout>
  );
};

export default InventoryPage;
