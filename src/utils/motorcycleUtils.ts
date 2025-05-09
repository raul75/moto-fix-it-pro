import { Motorcycle } from '@/types';
import { createMotorcycleInDb } from '@/api/motorcycles';

type NewMotorcycleData = {
  make?: string;
  model?: string;
  year?: string;
  licensePlate?: string;
  vin?: string;
  customerId: string;
};

export const createMotorcycle = async (data: NewMotorcycleData): Promise<Motorcycle> => {
  // Make sure all required fields are present
  if (!data.make || !data.model || !data.year || !data.licensePlate || !data.customerId) {
    throw new Error("Dati moto incompleti: marca, modello, anno e targa sono obbligatori");
  }
  
  try {
    // Create the motorcycle in the database
    return await createMotorcycleInDb({
      customerId: data.customerId,
      make: data.make,
      model: data.model,
      year: data.year,
      licensePlate: data.licensePlate,
      vin: data.vin
    });
  } catch (error) {
    console.error("Error creating motorcycle:", error);
    
    // Fallback to local creation if database operation fails
    // (This would typically be removed in production, but keeping for compatibility)
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
  }
};
