
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import { Repair, Customer, Motorcycle } from '@/types';

interface RepairCardProps {
  repair: Repair;
  customer: Customer;
  motorcycle: Motorcycle;
  className?: string;
}

const RepairCard: React.FC<RepairCardProps> = ({ 
  repair, 
  customer, 
  motorcycle, 
  className 
}) => {
  // Format date to local string (e.g., "15 Nov 2023")
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className={cn("card-hover", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{repair.title}</h3>
          <StatusBadge status={repair.status} />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{repair.description}</p>
          
          <div className="text-sm">
            <span className="font-medium">Cliente:</span> {customer.name}
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Moto:</span> {motorcycle.make} {motorcycle.model} ({motorcycle.year})
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Data creazione:</span> {formatDate(repair.dateCreated)}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button asChild variant="outline" size="sm">
              <Link to={`/repairs/${repair.id}`}>
                Visualizza Dettagli
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepairCard;
