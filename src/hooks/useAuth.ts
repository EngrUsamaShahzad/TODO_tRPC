import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setCredentials, logout as logoutAction, initializeAuth } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);

  const registerMutation = trpc.user.register.useMutation();
  const loginMutation = trpc.user.login.useMutation();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const register = async (email: string, name: string, password: string) => {
    try {
      console.log("Register input:", { email, name, password });
      const result = await registerMutation.mutateAsync({ email, name, password });
      //const result = await registerMutation.mutateAsync({ email, name, password });
      dispatch(setCredentials({ user: result.user, token: result.token }));
      router.push('/todos');
      return result;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      dispatch(setCredentials({ user: result.user, token: result.token }));
      router.push('/todos');
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    router.push('/');
  };

  return {
    user,
    token,
    isAuthenticated,
    register,
    login,
    logout,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    registerError: registerMutation.error,
    loginError: loginMutation.error,
  };
}