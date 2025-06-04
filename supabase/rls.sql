
-- Enable Row Level Security on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Funzione per verificare se l'utente è admin o tecnico
CREATE OR REPLACE FUNCTION public.is_admin_or_tech()
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

-- Funzione per verificare se un cliente appartiene all'utente corrente
CREATE OR REPLACE FUNCTION public.is_customer_owner(customer_id UUID)
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

-- Funzione per verificare se l'utente corrente è il cliente proprietario
CREATE OR REPLACE FUNCTION public.is_current_user_customer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'cliente'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLITICHE PER CUSTOMERS
CREATE POLICY "Admins and techs can view all customers" ON customers
  FOR SELECT USING (public.is_admin_or_tech());
  
CREATE POLICY "Customers can view their own data" ON customers
  FOR SELECT USING (user_id = auth.uid() AND public.is_current_user_customer());
  
CREATE POLICY "Admins and techs can insert customers" ON customers
  FOR INSERT WITH CHECK (public.is_admin_or_tech());
  
CREATE POLICY "Admins and techs can update customers" ON customers
  FOR UPDATE USING (public.is_admin_or_tech());

CREATE POLICY "Admins and techs can delete customers" ON customers
  FOR DELETE USING (public.is_admin_or_tech());

-- POLITICHE PER MOTORCYCLES
CREATE POLICY "Admins and techs can view all motorcycles" ON motorcycles
  FOR SELECT USING (public.is_admin_or_tech());
  
CREATE POLICY "Customers can view their own motorcycles" ON motorcycles
  FOR SELECT USING (
    public.is_current_user_customer() AND 
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = motorcycles.customer_id 
      AND customers.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Admins and techs can manage motorcycles" ON motorcycles
  FOR ALL USING (public.is_admin_or_tech());

-- POLITICHE PER REPAIRS
CREATE POLICY "Admins and techs can view all repairs" ON repairs
  FOR SELECT USING (public.is_admin_or_tech());
  
CREATE POLICY "Customers can view their own repairs" ON repairs
  FOR SELECT USING (
    public.is_current_user_customer() AND
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = repairs.customer_id 
      AND customers.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Admins and techs can manage repairs" ON repairs
  FOR ALL USING (public.is_admin_or_tech());

-- POLITICHE PER PHOTOS
CREATE POLICY "Admins and techs can view all photos" ON photos
  FOR SELECT USING (public.is_admin_or_tech());
  
CREATE POLICY "Customers can view photos of their repairs" ON photos
  FOR SELECT USING (
    public.is_current_user_customer() AND
    EXISTS (
      SELECT 1 FROM repairs r
      JOIN customers c ON c.id = r.customer_id
      WHERE r.id = photos.repair_id 
      AND c.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Admins and techs can manage photos" ON photos
  FOR ALL USING (public.is_admin_or_tech());

-- POLITICHE PER INVENTORY_PARTS (solo admin e tecnici)
CREATE POLICY "Admins and techs can manage inventory" ON inventory_parts
  FOR ALL USING (public.is_admin_or_tech());

-- POLITICHE PER USED_PARTS
CREATE POLICY "Admins and techs can manage used parts" ON used_parts
  FOR ALL USING (public.is_admin_or_tech());
  
CREATE POLICY "Customers can view used parts of their repairs" ON used_parts
  FOR SELECT USING (
    public.is_current_user_customer() AND
    EXISTS (
      SELECT 1 FROM repairs r
      JOIN customers c ON c.id = r.customer_id
      WHERE r.id = used_parts.repair_id 
      AND c.user_id = auth.uid()
    )
  );

-- POLITICHE PER INVOICES
CREATE POLICY "Admins and techs can view all invoices" ON invoices
  FOR SELECT USING (public.is_admin_or_tech());
  
CREATE POLICY "Customers can view their own invoices" ON invoices
  FOR SELECT USING (
    public.is_current_user_customer() AND
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = invoices.customer_id 
      AND customers.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Admins and techs can manage invoices" ON invoices
  FOR ALL USING (public.is_admin_or_tech());
