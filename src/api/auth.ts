
import supabase from '@/lib/supabase';
import { User, UserRole } from '@/types';

// Sign up a new user
export async function signUp(email: string, password: string, name: string, role: UserRole = 'cliente'): Promise<User> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  });
  
  if (authError) {
    throw new Error(authError.message);
  }
  
  if (!authData.user) {
    throw new Error('Registrazione fallita: account non creato');
  }
  
  // If the user is a client, create a customer record
  if (role === 'cliente') {
    const { error: customerError } = await supabase
      .from('customers')
      .insert([{
        user_id: authData.user.id,
        name: name,
        email: email,
        phone: '',
      }]);
    
    if (customerError) {
      throw new Error(`Errore nella creazione del cliente: ${customerError.message}`);
    }
  }
  
  // Return user data
  return {
    id: authData.user.id,
    email: authData.user.email || '',
    name: name,
    role: role,
    createdAt: authData.user.created_at || new Date().toISOString(),
    customerId: role === 'cliente' ? authData.user.id : undefined
  };
}

// Sign in a user
export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!data.user) {
    throw new Error('Login fallito: credenziali non valide');
  }
  
  const userData = data.user.user_metadata;
  
  return {
    id: data.user.id,
    email: data.user.email || '',
    name: userData.name || '',
    role: (userData.role as UserRole) || 'cliente',
    createdAt: data.user.created_at || '',
    customerId: userData.role === 'cliente' ? data.user.id : undefined,
    lastLogin: new Date().toISOString()
  };
}

// Sign out the current user
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

// Get the current user
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  
  if (!data.session) {
    return null;
  }
  
  const { user } = data.session;
  const userData = user.user_metadata;
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email || '',
    name: userData.name || '',
    role: (userData.role as UserRole) || 'cliente',
    createdAt: user.created_at || '',
    customerId: userData.role === 'cliente' ? user.id : undefined,
    lastLogin: userData.last_login || ''
  };
}

// Update a user's profile
export async function updateUserProfile(updates: { name?: string; email?: string }): Promise<User> {
  const { data, error } = await supabase.auth.updateUser({
    email: updates.email,
    data: updates.name ? { name: updates.name } : undefined
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!data.user) {
    throw new Error('Aggiornamento fallito: utente non trovato');
  }
  
  const userData = data.user.user_metadata;
  
  return {
    id: data.user.id,
    email: data.user.email || '',
    name: userData.name || '',
    role: (userData.role as UserRole) || 'cliente',
    createdAt: data.user.created_at || '',
    customerId: userData.role === 'cliente' ? data.user.id : undefined,
    lastLogin: userData.last_login || ''
  };
}

// Reset password
export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) {
    throw new Error(error.message);
  }
}

// Update password
export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) {
    throw new Error(error.message);
  }
}
