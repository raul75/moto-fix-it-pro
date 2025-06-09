import supabase from '@/lib/supabase';
import { Repair, RepairStatus, Photo, UsedPart } from '@/types';
import { consumeInventoryPart } from '@/api/inventory';
import { createInvoiceInDb } from '@/api/invoices';

// Convert Supabase repair to our app's Repair type
const mapRepair = (dbRepair: any): Repair => ({
  id: dbRepair.id,
  motorcycleId: dbRepair.motorcycle_id,
  customerId: dbRepair.customer_id,
  title: dbRepair.title,
  description: dbRepair.description,
  dateCreated: dbRepair.date_created,
  dateUpdated: dbRepair.date_updated,
  dateCompleted: dbRepair.date_completed || undefined,
  status: dbRepair.status as RepairStatus,
  laborHours: dbRepair.labor_hours || undefined,
  laborRate: dbRepair.labor_rate || undefined,
  notes: dbRepair.notes || undefined,
  photos: [], // We'll load these separately
  parts: [], // We'll load these separately
});

// Get all repairs
export async function getRepairs(): Promise<Repair[]> {
  const { data, error } = await supabase
    .from('repairs')
    .select('*')
    .order('date_created', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(mapRepair);
}

// Get repairs by status
export async function getRepairsByStatus(status: RepairStatus): Promise<Repair[]> {
  const { data, error } = await supabase
    .from('repairs')
    .select('*')
    .eq('status', status)
    .order('date_created', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(mapRepair);
}

// Get repairs by customer ID
export async function getRepairsByCustomerId(customerId: string): Promise<Repair[]> {
  const { data, error } = await supabase
    .from('repairs')
    .select('*')
    .eq('customer_id', customerId)
    .order('date_created', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(mapRepair);
}

// Get a repair by ID with photos and parts
export async function getRepairById(id: string): Promise<Repair> {
  // Get the repair
  const { data: repairData, error: repairError } = await supabase
    .from('repairs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (repairError) {
    throw new Error(repairError.message);
  }
  
  const repair = mapRepair(repairData);
  
  // Get repair photos
  const { data: photosData, error: photosError } = await supabase
    .from('photos')
    .select('*')
    .eq('repair_id', id);
  
  if (photosError) {
    throw new Error(photosError.message);
  }
  
  repair.photos = photosData.map(photo => ({
    id: photo.id,
    repairId: photo.repair_id,
    url: photo.url,
    caption: photo.caption || undefined,
    dateAdded: photo.date_added
  }));
  
  // Get used parts
  const { data: partsData, error: partsError } = await supabase
    .from('used_parts')
    .select('*')
    .eq('repair_id', id);
  
  if (partsError) {
    throw new Error(partsError.message);
  }
  
  repair.parts = partsData.map(part => ({
    id: part.id,
    repairId: part.repair_id,
    partId: part.part_id,
    partName: part.part_name,
    quantity: part.quantity,
    priceEach: part.price_each
  }));
  
  return repair;
}

// Create a new repair
export async function createRepairInDb(repair: Omit<Repair, 'id' | 'dateCreated' | 'dateUpdated' | 'photos' | 'parts'>): Promise<Repair> {
  // Insert the repair
  const { data, error } = await supabase
    .from('repairs')
    .insert([{
      motorcycle_id: repair.motorcycleId,
      customer_id: repair.customerId,
      title: repair.title,
      description: repair.description,
      status: repair.status || 'pending',
      labor_hours: repair.laborHours || null,
      labor_rate: repair.laborRate || null,
      notes: repair.notes || null,
      date_completed: repair.dateCompleted || null
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return {
    ...mapRepair(data),
    photos: [],
    parts: []
  };
}

// Update a repair - UPDATED to auto-generate invoice when completed
export async function updateRepair(id: string, updates: Partial<Repair>): Promise<Repair> {
  const updateData: any = {
    date_updated: new Date().toISOString()
  };
  
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.laborHours !== undefined) updateData.labor_hours = updates.laborHours;
  if (updates.laborRate !== undefined) updateData.labor_rate = updates.laborRate;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.dateCompleted !== undefined) updateData.date_completed = updates.dateCompleted;
  
  // If status is being updated to completed, set completion date
  if (updates.status === 'completed') {
    updateData.date_completed = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('repairs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Auto-generate invoice when repair is completed
  if (updates.status === 'completed') {
    try {
      const completedRepair = await getRepairById(id);
      await generateInvoiceForRepair(completedRepair);
      console.log(`Invoice automatically generated for completed repair ${id}`);
    } catch (invoiceError) {
      console.error('Error generating invoice for completed repair:', invoiceError);
      // Don't throw here to avoid blocking the repair update
    }
  }
  
  return await getRepairById(id); // Fetch the complete repair with photos and parts
}

// Generate invoice for a completed repair
async function generateInvoiceForRepair(repair: Repair): Promise<void> {
  // Calculate costs
  const partsCost = repair.parts?.reduce((sum, part) => sum + (part.priceEach * part.quantity), 0) || 0;
  const laborCost = (repair.laborHours || 0) * (repair.laborRate || 0);
  const subtotal = partsCost + laborCost;
  const tax = subtotal * 0.22; // 22% IVA
  const total = subtotal + tax;
  
  // Generate invoice number
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now()}`;
  
  // Create invoice
  await createInvoiceInDb({
    repairId: repair.id,
    customerId: repair.customerId,
    number: invoiceNumber,
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    subtotal,
    tax,
    total,
    status: 'draft',
    notes: `Fattura generata automaticamente per la riparazione: ${repair.title}`
  });
}

// Add a photo to a repair
export async function addPhotoToRepair(repairId: string, url: string, caption?: string): Promise<Photo> {
  const { data, error } = await supabase
    .from('photos')
    .insert([{
      repair_id: repairId,
      url,
      caption: caption || null
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return {
    id: data.id,
    repairId: data.repair_id,
    url: data.url,
    caption: data.caption || undefined,
    dateAdded: data.date_added
  };
}

// Upload a photo and add it to a repair
export async function uploadPhotoToRepair(repairId: string, file: File, caption?: string): Promise<Photo> {
  // Generate a unique file name
  const fileName = `${repairId}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  
  // Upload the file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('repair-photos')
    .upload(fileName, file);
  
  if (uploadError) {
    throw new Error(`Error uploading file: ${uploadError.message}`);
  }
  
  // Get public URL
  const { data: urlData } = supabase
    .storage
    .from('repair-photos')
    .getPublicUrl(uploadData.path);
  
  // Add photo to the database
  return await addPhotoToRepair(repairId, urlData.publicUrl, caption);
}

// Add a part to a repair - UPDATED to integrate with inventory
export async function addPartToRepair(repairId: string, partId: string, partName: string, quantity: number, priceEach: number): Promise<UsedPart> {
  // First, add the part to the repair
  const { data, error } = await supabase
    .from('used_parts')
    .insert([{
      repair_id: repairId,
      part_id: partId,
      part_name: partName,
      quantity,
      price_each: priceEach
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Then, update the inventory by consuming the part quantity
  try {
    await consumeInventoryPart(partId, quantity);
    console.log(`Inventory updated: consumed ${quantity} units of part ${partId}`);
  } catch (inventoryError) {
    console.error('Error updating inventory:', inventoryError);
    // Note: We don't throw here to avoid rolling back the used_parts insertion
    // The part is still added to the repair, but inventory might not be updated
  }
  
  return {
    id: data.id,
    repairId: data.repair_id,
    partId: data.part_id,
    partName: data.part_name,
    quantity: data.quantity,
    priceEach: data.price_each
  };
}

// Delete a repair
export async function deleteRepair(id: string): Promise<void> {
  // Delete associated photos
  const { error: photosError } = await supabase
    .from('photos')
    .delete()
    .eq('repair_id', id);
  
  if (photosError) {
    throw new Error(photosError.message);
  }
  
  // Delete associated used parts
  const { error: partsError } = await supabase
    .from('used_parts')
    .delete()
    .eq('repair_id', id);
  
  if (partsError) {
    throw new Error(partsError.message);
  }
  
  // Delete the repair
  const { error } = await supabase
    .from('repairs')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
}
