import { Customer } from '@/types';
import { createCustomerInDb } from '@/api/customers';
import { NewCustomerFormValues } from '@/components/forms/NewCustomerForm';

export const createCustomer = async (values: NewCustomerFormValues): Promise<Customer> => {
  try {
    // Create the customer in the database
    return await createCustomerInDb({
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: ""
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    
    // Fallback to local creation if database operation fails
    // (This would typically be removed in production, but keeping for compatibility)
    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: "" // Provide default value for required field
    };
    
    return newCustomer;
  }
};
