
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
};

export type Motorcycle = {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  vin?: string;
};

export type RepairStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type Repair = {
  id: string;
  motorcycleId: string;
  customerId: string;
  title: string;
  description: string;
  dateCreated: string;
  dateUpdated: string;
  dateCompleted?: string;
  status: RepairStatus;
  laborHours?: number;
  laborRate?: number;
  notes?: string;
  photos: Photo[];
  parts: UsedPart[];
};

export type Photo = {
  id: string;
  repairId: string;
  url: string;
  caption?: string;
  dateAdded: string;
};

export type InventoryPart = {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  cost: number;
  quantity: number;
  minimumQuantity?: number;
  location?: string;
  supplier?: string;
};

export type UsedPart = {
  id: string;
  repairId: string;
  partId: string;
  partName: string;
  quantity: number;
  priceEach: number;
};

export type Invoice = {
  id: string;
  repairId: string;
  customerId: string;
  number: string;
  date: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
};
