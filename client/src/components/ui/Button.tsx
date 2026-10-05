import type { ButtonHTMLAttributes } from 'react';

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-xl bg-shell-600 px-4 py-2.5 font-semibold text-white shadow-md shadow-shell-600/25 transition hover:bg-shell-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shell-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}