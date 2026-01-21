import React from 'react';

type FieldProps = {
  label: string;
  name?: string; // Make optional since StudentFormPage doesn't pass it
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean; // Add required prop
  children?: React.ReactNode; // Add children prop for StudentFormPage
  error?: string; // Add error prop
};

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  disabled,
  required = false,
  children,
  error,
}: FieldProps) {
  // If children are provided (StudentFormPage pattern)
  if (children) {
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
  
  // Otherwise render input field (Form.tsx pattern)
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm
                   outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20
                   disabled:cursor-not-allowed disabled:bg-zinc-100"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}