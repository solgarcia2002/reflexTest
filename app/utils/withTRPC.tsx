import { withTRPC } from '@trpc/next';
import superjson from 'superjson';
import type { AppRouter } from '../server/routers/index';

export const TrpcProvider = withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      url: '/api/trpc',
      transformer: superjson,
      // Agrega cualquier otra configuración necesaria aquí.
    };
  },
})(function TrpcProvider({ children }) {
  return <>{children}</>;
});
