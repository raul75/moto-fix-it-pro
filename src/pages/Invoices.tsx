
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Download, Edit, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getInvoices, getCustomers } from '@/api/customers';
import { Invoice, Customer } from '@/types';
import { useToast } from '@/hooks/use-toast';
import EditInvoiceDialog from '@/components/dialogs/EditInvoiceDialog';

const InvoicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch data
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  });

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

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditDialogOpen(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Generate PDF content
    const customerName = getCustomerName(invoice.customerId);
    const content = `
FATTURA: ${invoice.number}
Cliente: ${customerName}
Data: ${invoice.date}
Scadenza: ${invoice.dueDate}

Subtotale: €${invoice.subtotal.toFixed(2)}
IVA: €${invoice.tax.toFixed(2)}
TOTALE: €${invoice.total.toFixed(2)}

${invoice.notes ? 'Note: ' + invoice.notes : ''}
    `;

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fattura_${invoice.number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download completato",
      description: `Fattura ${invoice.number} scaricata con successo`,
    });
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const customerName = getCustomerName(invoice.customerId);
    
    // Get company settings from localStorage (in a real app, this would come from API)
    const companyHeader = localStorage.getItem('company-header') || 'MotoFix Officina\nVia dell\'Officina 123\n20100 Milano (MI)\nP.IVA: IT12345678901';
    const companyLogo = localStorage.getItem('company-logo-url') || '';
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Fattura ${invoice.number}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px;
                color: #333;
              }
              .company-header { 
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
                margin-bottom: 30px;
                display: flex;
                align-items: flex-start;
                gap: 20px;
              }
              .company-logo {
                max-width: 120px;
                max-height: 80px;
              }
              .company-info {
                flex: 1;
                white-space: pre-line;
                font-size: 14px;
                line-height: 1.4;
              }
              .invoice-title { 
                text-align: center; 
                margin-bottom: 30px;
                font-size: 24px;
                font-weight: bold;
                color: #333;
              }
              .invoice-number {
                font-size: 18px;
                color: #666;
                margin-top: 5px;
              }
              .invoice-details { 
                margin-bottom: 30px;
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
              }
              .invoice-details p {
                margin: 5px 0;
                font-size: 14px;
              }
              .totals { 
                text-align: right; 
                margin-top: 30px;
                border-top: 1px solid #ddd;
                padding-top: 15px;
              }
              .totals p {
                margin: 5px 0;
                font-size: 14px;
              }
              .total-final {
                font-size: 18px !important;
                font-weight: bold !important;
                color: #333 !important;
                border-top: 2px solid #333;
                padding-top: 10px;
                margin-top: 10px;
              }
              .notes {
                margin-top: 30px;
                padding: 15px;
                background: #f8f9fa;
                border-left: 4px solid #333;
                font-size: 12px;
                color: #666;
              }
              @media print {
                body { margin: 0; }
                .company-header { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <div class="company-header">
              ${companyLogo ? `<img src="${companyLogo}" alt="Logo Azienda" class="company-logo">` : ''}
              <div class="company-info">${companyHeader}</div>
            </div>
            
            <div class="invoice-title">
              FATTURA
              <div class="invoice-number">${invoice.number}</div>
            </div>
            
            <div class="invoice-details">
              <p><strong>Cliente:</strong> ${customerName}</p>
              <p><strong>Data Fattura:</strong> ${new Date(invoice.date).toLocaleDateString('it-IT')}</p>
              <p><strong>Data Scadenza:</strong> ${new Date(invoice.dueDate).toLocaleDateString('it-IT')}</p>
            </div>
            
            <div class="totals">
              <p>Imponibile: €${invoice.subtotal.toFixed(2)}</p>
              <p>IVA (22%): €${invoice.tax.toFixed(2)}</p>
              <p class="total-final">TOTALE: €${invoice.total.toFixed(2)}</p>
            </div>
            
            ${invoice.notes ? `<div class="notes"><strong>Note:</strong><br>${invoice.notes}</div>` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  if (isLoadingInvoices) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-pulse text-muted-foreground">Caricamento fatture...</div>
        </div>
      </Layout>
    );
  }

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
                    <div className="flex gap-1 justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditInvoice(invoice)}
                        title="Modifica fattura"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handlePrintInvoice(invoice)}
                        title="Stampa fattura"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice)}
                        title="Scarica fattura"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
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

      {/* Edit Invoice Dialog */}
      {selectedInvoice && (
        <EditInvoiceDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          invoice={selectedInvoice}
          customers={customers}
        />
      )}
    </Layout>
  );
};

export default InvoicesPage;
