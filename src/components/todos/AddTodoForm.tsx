'use client';

import React, { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { Button } from '@/components/shared/Button';
import { Input, TextArea, Select } from '@/components/shared/Input';
import { Alert } from '@/components/shared/Alert';
import { PRIORITY_OPTIONS, TODO_PRIORITY, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import { handleError } from '@/lib/errorHandler';

export const AddTodoForm: React.FC = () => {
  const { createTodo, isCreating } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(TODO_PRIORITY.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError(ERROR_MESSAGES.TODO_TITLE_REQUIRED);
      return;
    }

    try {
      await createTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      });

      setTitle('');
      setDescription('');
      setPriority(TODO_PRIORITY.MEDIUM);
      setDueDate('');
      setSuccess(SUCCESS_MESSAGES.TODO_CREATED);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleError(err));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Todo</h2>
      
      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-4" />}
      
      <div className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          required
        />

        <TextArea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Enter description (optional)"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            options={PRIORITY_OPTIONS}
          />

          <Input
            label="Due Date"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          variant="primary"
          isLoading={isCreating}
          className="w-full"
        >
          Add Todo
        </Button>
      </div>
    </div>
  );
};