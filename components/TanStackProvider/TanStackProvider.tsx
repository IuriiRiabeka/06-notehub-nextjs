'use client';

import { QueryClient, QueryClientProvider, HydrationBoundary, type DehydratedState } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function TanStackProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export function HydrateClient({ state, children }: { state: DehydratedState; children: ReactNode }) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
