import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ className, icon, ...props }) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={cn(
          'w-full rounded-full border border-gray-200 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          icon && 'pl-10',
          className
        )}
        {...props}
      />
    </div>
  );
};

export default Input;