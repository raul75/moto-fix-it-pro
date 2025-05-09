
import supabase from '@/lib/supabase';
import { Motorcycle } from '@/types';

// Convert Supabase motorcycle to our app's Motorcycle type
const mapMotorcycle = (dbMotorcycle: any): Motorcycle => ({
  id: dbMotorcycle.id,
  customerId: dbMotorcycle.customer_id,
  make: dbMotorcycle.make,
  model: dbMotorcycle.model,
  year: dbMotorcycle.year,
  licensePlate: dbMotorcycle.license_plate,
  vin: dbMotorcycle.vin || undefined,
});

// Get all motorcycles
export async function getMotorcycles(): Promise<Motorcycle[]> {
  const { data, error } = await supabase
    .from('motorcycles')
    .select('*')
    .order('make');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(mapMotorcycle);
}

// Get motorcycles by customer ID
export async function getMotorcyclesByCustomerId(customerId: string): Promise<Motorcycle[]> {
  const { data, error } = await supabase
    .from('motorcycles')
    .select('*')
    .eq('customer_id', customerId)
    .order('make');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(mapMotorcycle);
}

// Get a motorcycle by ID
export async function getMotorcycleById(id: string): Promise<Motorcycle> {
  const { data, error } = await supabase
    .from('motorcycles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapMotorcycle(data);
}

// Create a new motorcycle
export async function createMotorcycleInDb(motorcycle: Omit<Motorcycle, 'id'>): Promise<Motorcycle> {
  const { data, error } = await supabase
    .from('motorcycles')
    .insert([{
      customer_id: motorcycle.customerId,
      make: motorcycle.make,
      model: motorcycle.model,
      year: motorcycle.year,
      license_plate: motorcycle.licensePlate,
      vin: motorcycle.vin || null,
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapMotorcycle(data);
}

// Update a motorcycle
export async function updateMotorcycle(id: string, updates: Partial<Motorcycle>): Promise<Motorcycle> {
  const updateData: any = {};
  
  if (updates.make) updateData.make = updates.make;
  if (updates.model) updateData.model = updates.model;
  if (updates.year) updateData.year = updates.year;
  if (updates.licensePlate) updateData.license_plate = updates.licensePlate;
  if (updates.vin !== undefined) updateData.vin = updates.vin;
  
  const { data, error } = await supabase
    .from('motorcycles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapMotorcycle(data);
}

// Delete a motorcycle
export async function deleteMotorcycle(id: string): Promise<void> {
  const { error } = await supabase
    .from('motorcycles')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
}
