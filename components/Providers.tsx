'use client';

import { type ReactNode } from 'react';
import { UserProvider } from './UserProvider';
import { FavoritesProvider } from './FavoritesProvider';

/**
 * Client-side context providers.
 * Wrapped around layout children so server components (Header, page.tsx) can
 * still be passed as children without turning them into client components.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </UserProvider>
  );
}
