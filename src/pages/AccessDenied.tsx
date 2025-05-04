
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AccessDenied = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-accent/10 p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-destructive text-destructive-foreground p-4 rounded-full">
            <Shield className="h-12 w-12" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          {t('error.accessDenied')}
        </h1>
        
        <p className="text-lg text-muted-foreground mb-6">
          {t('error.noPermission')}
        </p>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
          <Button onClick={() => navigate('/')}>
            {t('nav.home')}
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            {t('nav.back')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;

