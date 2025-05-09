
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import i18n config
import './i18n/i18n';

// Global error handler
window.addEventListener('error', (event) => {
  // Log the error for debugging purposes
  console.error('Caught in global handler:', event.error);
  
  // Check if it's a Supabase-related error
  if (event.error?.message?.includes('Supabase')) {
    console.warn('Supabase connection issue detected. Check your environment variables and connection settings.');
  }
});

createRoot(document.getElementById("root")!).render(<App />);
