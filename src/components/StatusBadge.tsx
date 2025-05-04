
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RepairStatus } from '@/types';

interface StatusBadgeProps {
  status: RepairStatus;
  className?: string;
}

const statusMap = {
  'pending': {
    label: 'In Attesa',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-200'
  },
  'in-progress': {
    label: 'In Lavorazione',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  },
  'completed': {
    label: 'Completato',
    className: 'bg-green-100 text-green-800 hover:bg-green-200'
  },
  'cancelled': {
    label: 'Annullato',
    className: 'bg-red-100 text-red-800 hover:bg-red-200'
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <Badge 
      className={cn(
        'font-normal',
        statusMap[status].className,
        className
      )}
    >
      {statusMap[status].label}
    </Badge>
  );
};

export default StatusBadge;
