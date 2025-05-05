
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/StatsCard';
import RepairCard from '@/components/RepairCard';
import { Wrench, Users, Package, Receipt, Plus } from 'lucide-react';
import { repairs, getActiveRepairs, motorcycles, customers, inventoryParts, invoices, getLowStockParts } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const activeRepairs = getActiveRepairs();
  const lowStockParts = getLowStockParts();
  
  const pendingCount = repairs.filter(r => r.status === 'pending').length;
  const inProgressCount = repairs.filter(r => r.status === 'in-progress').length;
  const completedCount = repairs.filter(r => r.status === 'completed').length;
  
  // Find the motorcycle and customer for each repair
  const repairsWithDetails = activeRepairs.map(repair => {
    const motorcycle = motorcycles.find(m => m.id === repair.motorcycleId)!;
    const customer = customers.find(c => c.id === repair.customerId)!;
    return { repair, motorcycle, customer };
  });

  // Function to handle card clicks
  const handleCardClick = (type: string) => {
    switch(type) {
      case 'repairs':
        navigate('/repairs');
        break;
      case 'customers':
        navigate('/customers');
        break;
      case 'inventory':
        navigate('/inventory');
        break;
      case 'invoices':
        navigate('/invoices');
        break;
      default:
        break;
    }
  };

  // Function to handle new repair button click
  const handleNewRepairClick = () => {
    navigate('/repairs/new');
  };

  // Function to handle repair card click
  const handleRepairClick = (repairId: string) => {
    navigate(`/repairs/${repairId}`);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button className="flex gap-1" onClick={handleNewRepairClick}>
          <Plus className="h-4 w-4" />
          Nuova Riparazione
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div onClick={() => handleCardClick('repairs')} className="cursor-pointer">
          <StatsCard 
            title="Riparazioni Attive"
            value={activeRepairs.length}
            icon={<Wrench className="h-5 w-5" />}
            description="Riparazioni in attesa o in corso"
          />
        </div>
        <div onClick={() => handleCardClick('customers')} className="cursor-pointer">
          <StatsCard 
            title="Clienti"
            value={customers.length}
            icon={<Users className="h-5 w-5" />}
            trend={{ value: 5, positive: true }}
          />
        </div>
        <div onClick={() => handleCardClick('inventory')} className="cursor-pointer">
          <StatsCard 
            title="Ricambi in Magazzino"
            value={inventoryParts.reduce((sum, part) => sum + part.quantity, 0)}
            icon={<Package className="h-5 w-5" />}
            description={`${lowStockParts.length} ricambi sotto scorta minima`}
          />
        </div>
        <div onClick={() => handleCardClick('invoices')} className="cursor-pointer">
          <StatsCard 
            title="Fatture da Incassare"
            value={`€${invoices.filter(i => i.status === 'sent').reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}`}
            icon={<Receipt className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Active repairs section */}
      <h2 className="text-xl font-semibold mb-4">Riparazioni Attive</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {repairsWithDetails.map(({ repair, customer, motorcycle }) => (
          <div 
            key={repair.id} 
            onClick={() => handleRepairClick(repair.id)}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <RepairCard 
              repair={repair} 
              customer={customer}
              motorcycle={motorcycle}
            />
          </div>
        ))}
      </div>

      {/* Stats breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Stato Riparazioni</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">In Attesa</span>
              <span className="text-sm font-medium">{pendingCount}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400" 
                style={{ width: `${(pendingCount / repairs.length) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">In Lavorazione</span>
              <span className="text-sm font-medium">{inProgressCount}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400" 
                style={{ width: `${(inProgressCount / repairs.length) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completate</span>
              <span className="text-sm font-medium">{completedCount}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400" 
                style={{ width: `${(completedCount / repairs.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Parti sotto scorta minima</h3>
          <div className="space-y-2">
            {lowStockParts.length > 0 ? (
              lowStockParts.map(part => (
                <div key={part.id} className="text-sm">
                  <div className="flex justify-between">
                    <span>{part.name}</span>
                    <span className="text-red-500 font-medium">{part.quantity} disponibili</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Min: {part.minimumQuantity}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nessuna parte sotto la scorta minima</p>
            )}
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Fatture recenti</h3>
          <div className="space-y-2">
            {invoices.map(invoice => (
              <div key={invoice.id} className="text-sm">
                <div className="flex justify-between">
                  <span>#{invoice.number}</span>
                  <span className="font-medium">€{invoice.total.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {invoice.date} - {invoice.status === 'paid' ? 'Pagata' : invoice.status === 'sent' ? 'Inviata' : invoice.status === 'overdue' ? 'Scaduta' : 'Bozza'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
