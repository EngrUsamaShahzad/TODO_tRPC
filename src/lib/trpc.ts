import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { AppRouter } from '@/server/routers/_app';
import superjson from 'superjson';
import { APP_CONFIG, AUTH_CONFIG } from './constants';

export const trpc = createTRPCReact<AppRouter>();

export function getTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${APP_CONFIG.url}/api/trpc`,
        transformer: superjson, // ✅ Move transformer here
        headers() {
          if (typeof window === 'undefined') return {};

          const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}
