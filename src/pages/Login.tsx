
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect se l'utente è già autenticato
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Schema di validazione con Zod
  const formSchema = z.object({
    email: z.string().email(t('validation.emailInvalid')),
    password: z.string().min(6, t('validation.passwordMin', { count: 6 })),
  });

  // Form con react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const success = await login(values.email, values.password);
      
      if (success) {
        navigate('/');
      } else {
        toast({
          title: t('auth.loginFailed'),
          description: t('auth.checkCredentials'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('auth.loginFailed'),
        description: error instanceof Error ? error.message : t('auth.unknownError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-accent/10 p-6">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary text-primary-foreground p-4 rounded-full">
            <Wrench className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">{t('app.title')}</h1>
        <p className="text-muted-foreground">{t('app.description')}</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.login')}</CardTitle>
          <CardDescription>{t('auth.loginDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('common.loading') : t('auth.loginButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            {t('auth.noAccount')} <Link to="/register" className="text-primary hover:underline">{t('auth.registerHere')}</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
