"use client"; // Required for client-side interactivity like useState and event handlers

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Uncomment if/when redirection is needed

export default function CreateProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState<number | ''>(''); // Allow empty string for initial state
  const [margin, setMargin] = useState<number | ''>(''); // Allow empty string for initial state
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  // const router = useRouter(); // Uncomment if/when redirection is needed

  const validateForm = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (cost === '' || cost < 0) newErrors.cost = 'Cost must be a positive number.';
    if (margin === '' || margin < 0 || margin > 100) newErrors.margin = 'Margin must be between 0 and 100.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitMessage(null); // Clear previous messages
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          cost: Number(cost),
          margin: Number(margin),
          userId: 'client-temp-userid', // Placeholder for actual Firebase user ID
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage('Project created successfully!');
        // Clear form
        setName('');
        setDescription('');
        setCost('');
        setMargin('');
        setErrors({});
        // Optionally, redirect: router.push('/dashboard/projetos');
      } else {
        setSubmitMessage(`Error: ${result.message || 'Failed to create project.'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name*</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Cost (R$)*</label>
          <input
            type="number"
            id="cost"
            value={cost}
            onChange={(e) => setCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="0"
            step="0.01"
          />
          {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
        </div>

        <div>
          <label htmlFor="margin" className="block text-sm font-medium text-gray-700">Margin (%)*</label>
          <input
            type="number"
            id="margin"
            value={margin}
            onChange={(e) => setMargin(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="0"
            max="100"
            step="0.01"
          />
          {errors.margin && <p className="text-red-500 text-xs mt-1">{errors.margin}</p>}
        </div>

        {submitMessage && (
          <p className={`text-sm ${submitMessage.startsWith('Error:') ? 'text-red-600' : 'text-green-600'}`}>
            {submitMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}
