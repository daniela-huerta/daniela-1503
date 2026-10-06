import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-shell-600 text-white shadow-md shadow-shell-600/25 hover:bg-shell-700',
  secondary: 'bg-white text-bark-900 ring-1 ring-bark-900/15 hover:bg-cream',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-4 py-2.5 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shell-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}