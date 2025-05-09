
import supabase from '@/lib/supabase';
import { Customer } from '@/types';

// Convert Supabase customer to our app's Customer type
const mapCustomer = (dbCustomer: any): Customer => ({
  id: dbCustomer.id,
  name: dbCustomer.name,
  email: dbCustomer.email,
  phone: dbCustomer.phone,
  address: dbCustomer.address || undefined,
});

// Get all customers
export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(mapCustomer);
}

// Get a customer by ID
export async function getCustomerById(id: string): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapCustomer(data);
}

// Create a new customer
export async function createCustomerInDb(customer: Omit<Customer, 'id'>): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert([{
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || null,
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapCustomer(data);
}

// Update a customer
export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .update({
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
      address: updates.address || null,
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapCustomer(data);
}

// Delete a customer
export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
}
