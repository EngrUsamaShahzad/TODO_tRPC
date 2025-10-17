import { inferAsyncReturnType } from '@trpc/server';
import { prisma } from './db';
import { verifyToken } from '@/lib/auth';

export async function createContext({ req }: { req: Request }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  let user = null;

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded && typeof decoded !== 'string') {
        user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, name: true },
        });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  return { prisma, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
