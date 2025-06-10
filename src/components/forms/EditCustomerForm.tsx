
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Customer } from '@/types';

const editCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().optional(),
});

export type EditCustomerFormValues = z.infer<typeof editCustomerSchema>;

type EditCustomerFormProps = {
  customer: Customer;
  onSubmit: (values: EditCustomerFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const EditCustomerForm = ({ customer, onSubmit, onCancel, isLoading = false }: EditCustomerFormProps) => {
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCustomerFormValues>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('customers.name')} *</Label>
        <Input
          id="name"
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('customers.email')} *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t('customers.phone')} *</Label>
        <Input
          id="phone"
          {...register('phone')}
          error={errors.phone?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t('customers.address')}</Label>
        <Input
          id="address"
          {...register('address')}
          error={errors.address?.message}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('customers.saving')}
            </>
          ) : (
            t('common.save')
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditCustomerForm;
