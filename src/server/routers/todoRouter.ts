import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { TODO_PRIORITY, ERROR_MESSAGES } from '@/lib/constants';

const priorityEnum = z.enum([TODO_PRIORITY.LOW, TODO_PRIORITY.MEDIUM, TODO_PRIORITY.HIGH]);

export const todoRouter = router({
  getAll: protectedProcedure
    .input(
      z
        .object({
          completed: z.boolean().optional(),
          priority: priorityEnum.optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const where: any = {
        userId: ctx.user!.id,
      };

      if (input?.completed !== undefined) {
        where.completed = input.completed;
      }

      if (input?.priority) {
        where.priority = input.priority;
      }

      const todos = await ctx.prisma.todo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return todos;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid('Invalid todo ID') }))
    .query(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      });

      if (!todo || todo.userId !== ctx.user!.id) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ERROR_MESSAGES.TODO_NOT_FOUND,
        });
      }

      return todo;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, ERROR_MESSAGES.TODO_TITLE_REQUIRED).max(255, 'Title too long'),
        description: z.string().max(1000, 'Description too long').optional(),
        priority: priorityEnum.default(TODO_PRIORITY.MEDIUM),
        dueDate: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          userId: ctx.user!.id,
        },
      });

      return todo;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid('Invalid todo ID'),
        title: z.string().min(1, ERROR_MESSAGES.TODO_TITLE_REQUIRED).max(255).optional(),
        description: z.string().max(1000).optional(),
        completed: z.boolean().optional(),
        priority: priorityEnum.optional(),
        dueDate: z.string().datetime().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingTodo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      });

      if (!existingTodo || existingTodo.userId !== ctx.user!.id) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ERROR_MESSAGES.TODO_NOT_FOUND,
        });
      }

      const { id, ...updateData } = input;

      const todo = await ctx.prisma.todo.update({
        where: { id },
        data: {
          ...updateData,
          dueDate:
            updateData.dueDate === null
              ? null
              : updateData.dueDate
              ? new Date(updateData.dueDate)
              : undefined,
        },
      });

      return todo;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid('Invalid todo ID') }))
    .mutation(async ({ ctx, input }) => {
      const existingTodo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      });

      if (!existingTodo || existingTodo.userId !== ctx.user!.id) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ERROR_MESSAGES.TODO_NOT_FOUND,
        });
      }

      await ctx.prisma.todo.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  toggleComplete: protectedProcedure
    .input(z.object({ id: z.string().uuid('Invalid todo ID') }))
    .mutation(async ({ ctx, input }) => {
      const existingTodo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      });

      if (!existingTodo || existingTodo.userId !== ctx.user!.id) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ERROR_MESSAGES.TODO_NOT_FOUND,
        });
      }

      const todo = await ctx.prisma.todo.update({
        where: { id: input.id },
        data: { completed: !existingTodo.completed },
      });

      return todo;
    }),
});