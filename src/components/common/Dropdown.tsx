import React, { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: Option[];
  icon?: React.ReactNode;
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  name,
  options,
  icon,
  error,
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="w-full mb-2 text-sm">
        <div className="flex items-center relative">
          <select
            className={`w-full border rounded-md ${
              icon ? 'pl-10' : 'pl-3'
            } h-12 p-3 focus:outline-none focus:border-navy ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            name={name}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};
