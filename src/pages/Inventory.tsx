
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { inventoryParts } from '@/data/mockData';

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter parts based on search term
  const filteredParts = inventoryParts.filter(part => {
    const searchLower = searchTerm.toLowerCase();
    return (
      part.name.toLowerCase().includes(searchLower) ||
      part.partNumber.toLowerCase().includes(searchLower)
    );
  });

  // Check if part is low stock
  const isLowStock = (part: typeof inventoryParts[0]) => {
    return part.quantity <= (part.minimumQuantity || 0);
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
          <Button className="flex gap-1">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParts.map(part => (
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
              </TableRow>
            ))}
            
            {filteredParts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
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
        <Button variant="outline">Esporta Inventario</Button>
      </div>
    </Layout>
  );
};

export default InventoryPage;
