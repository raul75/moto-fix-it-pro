
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { Wrench } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-accent/10 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary text-primary-foreground p-4 rounded-full">
            <Wrench className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">{t('app.title')}</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t('app.description')}
        </p>
        
        {isAuthenticated ? (
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            {t('app.nav.dashboard')} →
          </Button>
        ) : (
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')}>
              {t('auth.login')}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
              {t('auth.register')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

