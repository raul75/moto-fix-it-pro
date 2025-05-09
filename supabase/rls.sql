
-- Enable Row Level Security on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create a function to check if the user is an admin or technician
CREATE OR REPLACE FUNCTION auth.is_admin_or_tech()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' IN ('admin', 'tecnico')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a customer belongs to the current user
CREATE OR REPLACE FUNCTION auth.is_customer_owner(customer_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1
      FROM customers
      WHERE id = customer_id
      AND user_id = auth.uid()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies for customers table
CREATE POLICY "Admins and techs can view all customers" ON customers
  FOR SELECT USING (auth.is_admin_or_tech());
  
CREATE POLICY "Customers can view their own data" ON customers
  FOR SELECT USING (user_id = auth.uid());
  
CREATE POLICY "Admins and techs can insert customers" ON customers
  FOR INSERT WITH CHECK (auth.is_admin_or_tech());
  
CREATE POLICY "Admins and techs can update customers" ON customers
  FOR UPDATE USING (auth.is_admin_or_tech());

-- RLS policies for motorcycles
CREATE POLICY "Admins and techs can view all motorcycles" ON motorcycles
  FOR SELECT USING (auth.is_admin_or_tech());
  
CREATE POLICY "Customers can view their own motorcycles" ON motorcycles
  FOR SELECT USING (auth.is_customer_owner(customer_id));
  
CREATE POLICY "Admins and techs can manage motorcycles" ON motorcycles
  FOR ALL USING (auth.is_admin_or_tech());

-- RLS policies for repairs
CREATE POLICY "Admins and techs can view all repairs" ON repairs
  FOR SELECT USING (auth.is_admin_or_tech());
  
CREATE POLICY "Customers can view their own repairs" ON repairs
  FOR SELECT USING (auth.is_customer_owner(customer_id));
  
CREATE POLICY "Admins and techs can manage repairs" ON repairs
  FOR ALL USING (auth.is_admin_or_tech());

-- RLS policies for photos
CREATE POLICY "Anyone authenticated can view photos" ON photos
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Admins and techs can manage photos" ON photos
  FOR ALL USING (auth.is_admin_or_tech());

-- RLS policies for inventory parts
CREATE POLICY "Admins and techs can view and manage inventory" ON inventory_parts
  FOR ALL USING (auth.is_admin_or_tech());

-- RLS policies for used parts
CREATE POLICY "Admins and techs can manage used parts" ON used_parts
  FOR ALL USING (auth.is_admin_or_tech());
  
CREATE POLICY "Anyone authenticated can view used parts" ON used_parts
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS policies for invoices
CREATE POLICY "Admins and techs can view all invoices" ON invoices
  FOR SELECT USING (auth.is_admin_or_tech());
  
CREATE POLICY "Customers can view their own invoices" ON invoices
  FOR SELECT USING (auth.is_customer_owner(customer_id));
  
CREATE POLICY "Admins and techs can manage invoices" ON invoices
  FOR ALL USING (auth.is_admin_or_tech());
