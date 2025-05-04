
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CustomersPage from "./pages/Customers";
import InventoryPage from "./pages/Inventory";
import InvoicesPage from "./pages/Invoices";
import PhotosPage from "./pages/Photos";
import SettingsPage from "./pages/Settings";
import RepairDetailsPage from "./pages/RepairDetails";
import CustomerDetailsPage from "./pages/CustomerDetails";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccessDenied from "./pages/AccessDenied";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Pagine pubbliche */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/accesso-negato" element={<AccessDenied />} />
            
            {/* Pagine protette che richiedono l'autenticazione */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Pagine per admin e tecnici */}
            <Route path="/customers" element={
              <ProtectedRoute roles={['admin', 'tecnico']}>
                <CustomersPage />
              </ProtectedRoute>
            } />
            <Route path="/customers/:id" element={
              <ProtectedRoute roles={['admin', 'tecnico']}>
                <CustomerDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute roles={['admin', 'tecnico']}>
                <InventoryPage />
              </ProtectedRoute>
            } />
            <Route path="/invoices" element={
              <ProtectedRoute roles={['admin', 'tecnico']}>
                <InvoicesPage />
              </ProtectedRoute>
            } />
            <Route path="/photos" element={
              <ProtectedRoute roles={['admin', 'tecnico']}>
                <PhotosPage />
              </ProtectedRoute>
            } />
            <Route path="/repairs/:id" element={
              <ProtectedRoute roles={['admin', 'tecnico']}>
                <RepairDetailsPage />
              </ProtectedRoute>
            } />
            
            {/* Pagine solo per admin */}
            <Route path="/settings" element={
              <ProtectedRoute roles="admin">
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            {/* Pagina non trovata */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

