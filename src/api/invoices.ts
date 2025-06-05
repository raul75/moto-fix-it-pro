
import supabase from '@/lib/supabase';
import { Invoice } from '@/types';

// Convert Supabase invoice to our app's Invoice type
const mapInvoice = (dbInvoice: any): Invoice => ({
  id: dbInvoice.id,
  repairId: dbInvoice.repair_id,
  customerId: dbInvoice.customer_id,
  number: dbInvoice.number,
  date: dbInvoice.date,
  dueDate: dbInvoice.due_date,
  subtotal: dbInvoice.subtotal,
  tax: dbInvoice.tax,
  total: dbInvoice.total,
  notes: dbInvoice.notes || undefined,
  status: dbInvoice.status as 'draft' | 'sent' | 'paid' | 'overdue',
});

// Get all invoices
export async function getInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(mapInvoice);
}

// Get invoices by customer ID
export async function getInvoicesByCustomerId(customerId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', customerId)
    .order('date', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(mapInvoice);
}

// Get an invoice by ID
export async function getInvoiceById(id: string): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapInvoice(data);
}

// Create a new invoice
export async function createInvoiceInDb(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .insert([{
      repair_id: invoice.repairId,
      customer_id: invoice.customerId,
      number: invoice.number,
      date: invoice.date,
      due_date: invoice.dueDate,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      notes: invoice.notes || null,
      status: invoice.status || 'draft',
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapInvoice(data);
}

// Update an invoice
export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
  const updateData: any = {};
  
  if (updates.number !== undefined) updateData.number = updates.number;
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
  if (updates.subtotal !== undefined) updateData.subtotal = updates.subtotal;
  if (updates.tax !== undefined) updateData.tax = updates.tax;
  if (updates.total !== undefined) updateData.total = updates.total;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.status !== undefined) updateData.status = updates.status;
  
  const { data, error } = await supabase
    .from('invoices')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapInvoice(data);
}

// Delete an invoice
export async function deleteInvoice(id: string): Promise<void> {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
}
