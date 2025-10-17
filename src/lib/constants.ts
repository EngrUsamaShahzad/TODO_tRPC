// Application-wide constants
export const APP_CONFIG = {
  name: 'Todo Manager',
  description: 'Manage your tasks efficiently',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

// Authentication
export const AUTH_CONFIG = {
  tokenKey: 'token',
  userKey: 'user',
  tokenExpiry: '7d',
  passwordMinLength: 6,
  nameMinLength: 2,
} as const;

// Pagination
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
} as const;

// Todo priorities
export const TODO_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const PRIORITY_OPTIONS = [
  { value: TODO_PRIORITY.LOW, label: 'Low' },
  { value: TODO_PRIORITY.MEDIUM, label: 'Medium' },
  { value: TODO_PRIORITY.HIGH, label: 'High' },
] as const;

export const PRIORITY_COLORS = {
  [TODO_PRIORITY.LOW]: 'bg-green-100 text-green-800 border-green-200',
  [TODO_PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [TODO_PRIORITY.HIGH]: 'bg-red-100 text-red-800 border-red-200',
} as const;

// Filter options
export const FILTER_OPTIONS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const STATUS_FILTER_OPTIONS = [
  { value: FILTER_OPTIONS.ALL, label: 'All' },
  { value: FILTER_OPTIONS.ACTIVE, label: 'Active' },
  { value: FILTER_OPTIONS.COMPLETED, label: 'Completed' },
] as const;

export const PRIORITY_FILTER_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  ...PRIORITY_OPTIONS,
] as const;

// API Configuration
export const API_CONFIG = {
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 30000,
  staleTime: 5000,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Auth errors
  AUTH_REQUIRED: 'You must be logged in to access this resource',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User with this email already exists',
  WEAK_PASSWORD: `Password must be at least ${AUTH_CONFIG.passwordMinLength} characters`,
  
  // Todo errors
  TODO_NOT_FOUND: 'Todo not found',
  TODO_TITLE_REQUIRED: 'Title is required',
  TODO_CREATE_FAILED: 'Failed to create todo',
  TODO_UPDATE_FAILED: 'Failed to update todo',
  TODO_DELETE_FAILED: 'Failed to delete todo',
  
  // Network errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  TODO_CREATED: 'Todo created successfully',
  TODO_UPDATED: 'Todo updated successfully',
  TODO_DELETED: 'Todo deleted successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  REGISTER_SUCCESS: 'Account created successfully',
} as const;

// UI Constants
export const UI_CONFIG = {
  modalAnimationDuration: 200,
  toastDuration: 3000,
  debounceDelay: 300,
} as const;

// Date formats
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  displayWithTime: 'MMM dd, yyyy HH:mm',
  input: 'yyyy-MM-dd\'T\'HH:mm',
} as const;