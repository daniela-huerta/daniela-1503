import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

export function FormField({ label, name, error, type = 'text', ...inputProps }: FormFieldProps) {
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
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`rounded-xl border bg-cream/60 px-3.5 py-2.5 text-bark-900 placeholder:text-bark-600/60 outline-none transition focus:border-leaf-500 focus:bg-white focus:ring-2 focus:ring-leaf-500/30 disabled:opacity-60 ${
          error ? 'border-red-500' : 'border-bark-900/15'
        }`}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}