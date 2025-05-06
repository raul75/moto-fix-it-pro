
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import RepairCard from '@/components/RepairCard';
import { repairs, motorcycles, customers, getRepairsByStatus } from '@/data/mockData';

const RepairsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter repairs by status
  const pendingRepairs = getRepairsByStatus('pending');
  const inProgressRepairs = getRepairsByStatus('in-progress');
  const completedRepairs = getRepairsByStatus('completed');
  
  // Filter repairs based on search query
  const filterRepairs = (repairsList: typeof repairs) => {
    if (!searchQuery.trim()) return repairsList;
    
    const query = searchQuery.toLowerCase();
    return repairsList.filter(repair => {
      // Find associated motorcycle and customer
      const motorcycle = motorcycles.find(m => m.id === repair.motorcycleId);
      const customer = customers.find(c => c.id === repair.customerId);
      
      // Search in multiple fields
      return (
        repair.title.toLowerCase().includes(query) ||
        repair.description.toLowerCase().includes(query) ||
        motorcycle?.make.toLowerCase().includes(query) ||
        motorcycle?.model.toLowerCase().includes(query) ||
        motorcycle?.licensePlate.toLowerCase().includes(query) ||
        customer?.name.toLowerCase().includes(query)
      );
    });
  };
  
  // Prepare repair cards with all needed data
  const renderRepairs = (repairsList: typeof repairs) => {
    const filteredRepairs = filterRepairs(repairsList);
    
    if (filteredRepairs.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery.trim() 
              ? "Nessuna riparazione trovata con questi criteri di ricerca." 
              : "Nessuna riparazione presente in questa categoria."}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRepairs.map(repair => {
          const motorcycle = motorcycles.find(m => m.id === repair.motorcycleId)!;
          const customer = customers.find(c => c.id === repair.customerId)!;
          
          return (
            <div 
              key={repair.id} 
              onClick={() => navigate(`/repairs/${repair.id}`)}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <RepairCard 
                repair={repair} 
                customer={customer}
                motorcycle={motorcycle}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold">Riparazioni</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca riparazioni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button className="flex gap-1 whitespace-nowrap" onClick={() => navigate('/repairs/new')}>
            <Plus className="h-4 w-4" />
            Nuova Riparazione
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="pending" className="flex-1 md:flex-none">
            In Attesa ({pendingRepairs.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex-1 md:flex-none">
            In Lavorazione ({inProgressRepairs.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 md:flex-none">
            Completate ({completedRepairs.length})
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="pending">
            {renderRepairs(pendingRepairs)}
          </TabsContent>
          
          <TabsContent value="in-progress">
            {renderRepairs(inProgressRepairs)}
          </TabsContent>
          
          <TabsContent value="completed">
            {renderRepairs(completedRepairs)}
          </TabsContent>
        </div>
      </Tabs>
    </Layout>
  );
};

export default RepairsPage;
