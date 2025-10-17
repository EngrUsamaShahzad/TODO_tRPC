'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './shared/Button';
import { Input } from './shared/Input';
import { Alert } from './shared/Alert';
import { APP_CONFIG, AUTH_CONFIG, ERROR_MESSAGES } from '@/lib/constants';
import { handleError } from '@/lib/errorHandler';

export const AuthForm: React.FC = () => {
  const { register, login, isRegistering, isLoggingIn } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        if (name.trim().length < AUTH_CONFIG.nameMinLength) {
          setError(`Name must be at least ${AUTH_CONFIG.nameMinLength} characters`);
          return;
        }
        if (password.length < AUTH_CONFIG.passwordMinLength) {
          setError(ERROR_MESSAGES.WEAK_PASSWORD);
          return;
        }
        await register(email, name, password);
      }
    } catch (err) {
      setError(handleError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{APP_CONFIG.name}</h1>
          <p className="text-gray-600 mt-2">
            {isLoginMode ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
        )}

        <div className="space-y-4">
          {!isLoginMode && (
            <Input
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            helperText={!isLoginMode ? `Minimum ${AUTH_CONFIG.passwordMinLength} characters` : undefined}
            required
          />

          <Button
            type="button"
            onClick={handleSubmit}
            variant="primary"
            isLoading={isLoginMode ? isLoggingIn : isRegistering}
            className="w-full"
          >
            {isLoginMode ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            {isLoginMode
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};