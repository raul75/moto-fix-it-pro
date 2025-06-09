
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Redirect authenticated users to dashboard, others to workshop
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/workshop');
    }
  }, [isAuthenticated, navigate]);
  
  return null; // This component doesn't render anything as it redirects immediately
};

export default Index;
