
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Download } from 'lucide-react';
import { invoices, customers } from '@/data/mockData';

const InvoicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Status mapping for invoices
  const invoiceStatusMap = {
    'draft': {
      label: 'Bozza',
      className: 'bg-gray-100 text-gray-800'
    },
    'sent': {
      label: 'Inviata',
      className: 'bg-blue-100 text-blue-800'
    },
    'paid': {
      label: 'Pagata',
      className: 'bg-green-100 text-green-800'
    },
    'overdue': {
      label: 'Scaduta',
      className: 'bg-red-100 text-red-800'
    }
  };

  // Find customer by ID
  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Cliente sconosciuto';
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => {
    const searchLower = searchTerm.toLowerCase();
    const customerName = getCustomerName(invoice.customerId).toLowerCase();
    
    return (
      invoice.number.toLowerCase().includes(searchLower) ||
      customerName.includes(searchLower)
    );
  });

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Fatture</h1>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca fatture..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex gap-1">
            <Plus className="h-4 w-4" />
            Nuova Fattura
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numero</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Scadenza</TableHead>
              <TableHead className="text-right">Totale</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map(invoice => {
              const status = invoiceStatusMap[invoice.status];
              return (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.number}</TableCell>
                  <TableCell>{getCustomerName(invoice.customerId)}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell className="text-right font-medium">€{invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={`${status.className} hover:${status.className}`}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Scarica</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">Nessuna fattura trovata.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Totale fatture: {invoices.length}
          </p>
          <p className="text-sm text-muted-foreground">
            Da incassare: €{invoices.filter(i => i.status === 'sent').reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
          </p>
        </div>
        <Button variant="outline">Esporta fatture</Button>
      </div>
    </Layout>
  );
};

export default InvoicesPage;
