'use client';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MindConnectProvider } from '@/context/MindConnectContext';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MindConnectProvider>
          {children}
          <Toaster />
          <Sonner />
        </MindConnectProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
