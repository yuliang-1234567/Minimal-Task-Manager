import React from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={`
          ${fullWidth ? 'w-full' : ''}
          px-3 py-2
          border
          rounded-lg
          focus:outline-none
          focus:ring-2
          focus:ring-primary/50
          dark:bg-gray-800
          dark:border-gray-700
          dark:text-white
          ${error ? 'border-danger' : 'border-gray-300 dark:border-gray-700'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
};

export default Textarea;