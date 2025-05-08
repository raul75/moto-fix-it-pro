
import { Customer } from '@/types';
import { NewCustomerFormValues } from '@/components/forms/NewCustomerForm';

export const createCustomer = (values: NewCustomerFormValues): Customer => {
  // Create new customer with all required fields of Customer type
  const newCustomer: Customer = {
    id: `c-${Date.now()}`,
    name: values.name,
    email: values.email,
    phone: values.phone,
    address: "" // Provide default value for required field
  };
  
  return newCustomer;
};
