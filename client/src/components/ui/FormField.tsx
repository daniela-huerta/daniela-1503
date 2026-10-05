import type { ChangeEvent } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  error?: string;
  autoComplete?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  error,
  autoComplete,
  onChange,
}: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-semibold text-bark-900">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`rounded-xl border bg-cream/60 px-3.5 py-2.5 text-bark-900 placeholder:text-bark-600/60 outline-none transition focus:border-leaf-500 focus:bg-white focus:ring-2 focus:ring-leaf-500/30 ${
           error ? 'border-red-500' : 'border-bark-900/15'
        }`}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}