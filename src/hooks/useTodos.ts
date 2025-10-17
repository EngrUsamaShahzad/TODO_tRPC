import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setTodos,
  addTodo as addTodoAction,
  updateTodo as updateTodoAction,
  removeTodo as removeTodoAction,
} from '@/store/slices/todoSlice';

// 🧠 Helper — safely format due date into ISO string
const formatTodoDates = (data: any) => {
  return {
    ...data,
    dueDate: data?.dueDate ? new Date(data.dueDate).toISOString() : null,
  };
};

export function useTodos() {
  const dispatch = useAppDispatch();
  const { todos, filter, priorityFilter } = useAppSelector((state) => state.todos);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // 🧩 Queries & Mutations
  const todosQuery = trpc.todo.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createMutation = trpc.todo.create.useMutation();
  const updateMutation = trpc.todo.update.useMutation();
  const deleteMutation = trpc.todo.delete.useMutation();
  const toggleMutation = trpc.todo.toggleComplete.useMutation();

  // 🌀 Sync todos from server to Redux
  useEffect(() => {
    if (todosQuery.data) {
      dispatch(setTodos(todosQuery.data));
    }
  }, [todosQuery.data, dispatch]);

  // ➕ Create Todo
  const createTodo = async (data: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
  }) => {
    try {
      const formatted = formatTodoDates(data);
      const newTodo = await createMutation.mutateAsync(formatted);
      dispatch(addTodoAction(newTodo));
      return newTodo;
    } catch (error) {
      console.error('Create Todo Error:', error);
      throw error;
    }
  };

  // 🔄 Update Todo
  const updateTodo = async (id: string, data: any) => {
    try {
      const formatted = formatTodoDates(data);
      const updatedTodo = await updateMutation.mutateAsync({ id, ...formatted });
      dispatch(updateTodoAction(updatedTodo));
      return updatedTodo;
    } catch (error) {
      console.error('Update Todo Error:', error);
      throw error;
    }
  };

  // ❌ Delete Todo
  const deleteTodo = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id });
      dispatch(removeTodoAction(id));
    } catch (error) {
      console.error('Delete Todo Error:', error);
      throw error;
    }
  };

  // ✅ Toggle Complete
  const toggleComplete = async (id: string) => {
    try {
      const updatedTodo = await toggleMutation.mutateAsync({ id });
      dispatch(updateTodoAction(updatedTodo));
      return updatedTodo;
    } catch (error) {
      console.error('Toggle Todo Error:', error);
      throw error;
    }
  };

  // 🧹 Filtering Logic
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
    return true;
  });

  return {
    todos: filteredTodos,
    allTodos: todos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    refetch: todosQuery.refetch,
    isLoading: todosQuery.isLoading,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
}
