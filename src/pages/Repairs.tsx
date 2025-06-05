
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit } from 'lucide-react';
import RepairCard from '@/components/RepairCard';
import { getRepairs, getRepairsByStatus } from '@/api/repairs';
import { getCustomers } from '@/api/customers';
import { getMotorcyclesByCustomerId } from '@/api/motorcycles';

const RepairsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch all repairs
  const { data: allRepairs = [], isLoading: repairsLoading } = useQuery({
    queryKey: ['repairs'],
    queryFn: getRepairs
  });

  // Fetch customers for filtering
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  });

  // Filter repairs by status
  const pendingRepairs = allRepairs.filter(r => r.status === 'pending');
  const inProgressRepairs = allRepairs.filter(r => r.status === 'in-progress');
  const completedRepairs = allRepairs.filter(r => r.status === 'completed');
  
  // Filter repairs based on search query
  const filterRepairs = (repairsList: typeof allRepairs) => {
    if (!searchQuery.trim()) return repairsList;
    
    const query = searchQuery.toLowerCase();
    return repairsList.filter(repair => {
      // Find associated customer
      const customer = customers.find(c => c.id === repair.customerId);
      
      // Search in multiple fields
      return (
        repair.title.toLowerCase().includes(query) ||
        repair.description.toLowerCase().includes(query) ||
        customer?.name.toLowerCase().includes(query)
      );
    });
  };
  
  // Prepare repair cards with all needed data
  const renderRepairs = (repairsList: typeof allRepairs) => {
    const filteredRepairs = filterRepairs(repairsList);
    
    if (filteredRepairs.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery.trim() 
              ? t('repairs.no_repairs_found')
              : t('repairs.no_repairs_in_category')}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRepairs.map(repair => {
          const customer = customers.find(c => c.id === repair.customerId);
          
          return (
            <div key={repair.id} className="relative group">
              <div 
                onClick={() => navigate(`/repairs/${repair.id}`)}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <RepairCard 
                  repair={repair} 
                  customer={customer || { id: '', name: 'Cliente non trovato', email: '', phone: '' }}
                  motorcycle={{ id: '', make: '', model: '', year: '', licensePlate: '', customerId: '' }}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/repairs/${repair.id}`);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  if (repairsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold">{t('repairs.title')}</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('repairs.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button className="flex gap-1 whitespace-nowrap" onClick={() => navigate('/repairs/new')}>
            <Plus className="h-4 w-4" />
            {t('repairs.new_repair')}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="pending" className="flex-1 md:flex-none">
            {t('repairs.pending')} ({pendingRepairs.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex-1 md:flex-none">
            {t('repairs.in_progress')} ({inProgressRepairs.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 md:flex-none">
            {t('repairs.completed')} ({completedRepairs.length})
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
