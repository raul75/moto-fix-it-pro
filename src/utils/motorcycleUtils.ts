
import { Motorcycle } from '@/types';

type NewMotorcycleData = {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  vin?: string;
  customerId: string;
};

export const createMotorcycle = (data: NewMotorcycleData): Motorcycle => {
  // Create new motorcycle with all required fields of Motorcycle type
  const newMotorcycle: Motorcycle = {
    id: `m-${Date.now()}`,
    customerId: data.customerId,
    make: data.make,
    model: data.model,
    year: data.year,
    licensePlate: data.licensePlate,
    vin: data.vin
  };
  
  return newMotorcycle;
};
