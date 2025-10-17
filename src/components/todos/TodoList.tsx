'use client';

import React from 'react';
import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from './TodoItem';
import { Loader } from '@/components/shared/Loader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Select } from '@/components/shared/Input';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setFilter, setPriorityFilter } from '@/store/slices/todoSlice';
import { STATUS_FILTER_OPTIONS, PRIORITY_FILTER_OPTIONS } from '@/lib/constants';

export const TodoList: React.FC = () => {
  const { todos, isLoading } = useTodos();
  const dispatch = useAppDispatch();
  const { filter, priorityFilter } = useAppSelector((state) => state.todos);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" text="Loading todos..." />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <Select
            label="Filter by Status"
            value={filter}
            onChange={(e) => dispatch(setFilter(e.target.value as any))}
            options={STATUS_FILTER_OPTIONS}
          />

          <Select
            label="Filter by Priority"
            value={priorityFilter}
            onChange={(e) => dispatch(setPriorityFilter(e.target.value as any))}
            options={PRIORITY_FILTER_OPTIONS}
          />
        </div>
      </div>

      {todos.length === 0 ? (
        <EmptyState
          title="No todos found"
          description="Get started by creating a new todo above."
        />
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};