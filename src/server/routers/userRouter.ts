import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { hashPassword, comparePasswords, generateToken } from '@/lib/auth';
import { AUTH_CONFIG, ERROR_MESSAGES } from '@/lib/constants';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
        name: z.string().min(
          AUTH_CONFIG.nameMinLength,
          `Name must be at least ${AUTH_CONFIG.nameMinLength} characters`
        ),
        password: z.string().min(
          AUTH_CONFIG.passwordMinLength,
          ERROR_MESSAGES.WEAK_PASSWORD
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: ERROR_MESSAGES.USER_EXISTS,
        });
      }

      const hashedPassword = await hashPassword(input.password);

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      const token = generateToken(user.id);

      return { user, token };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
      }

      const isValidPassword = await comparePasswords(input.password, user.password);

      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
      }

      const token = generateToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
        token,
      };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
