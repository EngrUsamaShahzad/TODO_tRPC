import { router } from "../trpc";
import { userRouter } from "./userRouter";
import { todoRouter } from "./todoRouter";

export const appRouter = router({
  user: userRouter,
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
