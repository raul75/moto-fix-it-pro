
import supabase from '@/lib/supabase';
import { InventoryPart } from '@/types';

// Convert Supabase inventory part to our app's InventoryPart type
const mapInventoryPart = (dbPart: any): InventoryPart => ({
  id: dbPart.id,
  name: dbPart.name,
  partNumber: dbPart.part_number,
  price: dbPart.price,
  cost: dbPart.cost,
  quantity: dbPart.quantity,
  minimumQuantity: dbPart.minimum_quantity || 0,
  location: dbPart.location || undefined,
  supplier: dbPart.supplier || undefined,
});

// Get all inventory parts
export async function getInventoryParts(): Promise<InventoryPart[]> {
  const { data, error } = await supabase
    .from('inventory_parts')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(mapInventoryPart);
}

// Get inventory part by ID
export async function getInventoryPartById(id: string): Promise<InventoryPart> {
  const { data, error } = await supabase
    .from('inventory_parts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapInventoryPart(data);
}

// Create a new inventory part
export async function createInventoryPart(part: Omit<InventoryPart, 'id'>): Promise<InventoryPart> {
  const { data, error } = await supabase
    .from('inventory_parts')
    .insert([{
      name: part.name,
      part_number: part.partNumber,
      price: part.price,
      cost: part.cost,
      quantity: part.quantity,
      minimum_quantity: part.minimumQuantity || null,
      location: part.location || null,
      supplier: part.supplier || null
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapInventoryPart(data);
}

// Update an inventory part
export async function updateInventoryPart(id: string, updates: Partial<InventoryPart>): Promise<InventoryPart> {
  const updateData: any = {
    updated_at: new Date().toISOString()
  };
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.partNumber !== undefined) updateData.part_number = updates.partNumber;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.cost !== undefined) updateData.cost = updates.cost;
  if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
  if (updates.minimumQuantity !== undefined) updateData.minimum_quantity = updates.minimumQuantity;
  if (updates.location !== undefined) updateData.location = updates.location;
  if (updates.supplier !== undefined) updateData.supplier = updates.supplier;
  
  const { data, error } = await supabase
    .from('inventory_parts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return mapInventoryPart(data);
}

// Update inventory part quantity (used when parts are consumed in repairs)
export async function updateInventoryPartQuantity(id: string, newQuantity: number): Promise<InventoryPart> {
  return updateInventoryPart(id, { quantity: newQuantity });
}

// Reduce inventory part quantity by amount (used when parts are used in repairs)
export async function consumeInventoryPart(id: string, quantityUsed: number): Promise<InventoryPart> {
  // Get current quantity first
  const currentPart = await getInventoryPartById(id);
  const newQuantity = Math.max(0, currentPart.quantity - quantityUsed);
  
  return updateInventoryPartQuantity(id, newQuantity);
}

// Delete an inventory part
export async function deleteInventoryPart(id: string): Promise<void> {
  const { error } = await supabase
    .from('inventory_parts')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
}
