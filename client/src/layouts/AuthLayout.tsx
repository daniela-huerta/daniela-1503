import type { ReactNode } from 'react';
import snailHero from '../assets/caracol.jpg';
import { Logo } from '../components/Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, footer, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-bark-900/10 ring-1 ring-bark-900/5 lg:grid-cols-2">
        <section className="relative h-56 sm:h-72 lg:h-auto lg:min-h-[560px]">
          <img src={snailHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 top-0 bg-linear-to-b from-white/90 via-white/60 to-transparent p-6 pb-16 lg:p-10 lg:pb-24">
            <Logo />
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 sm:p-12">
          <h1 className="text-2xl font-extrabold text-bark-900">{title}</h1>
          <p className="mt-1 mb-8 text-sm text-bark-600">{subtitle}</p>
          {children}
          <div className="mt-8 text-center text-sm text-bark-600">{footer}</div>
        </section>
      </div>
    </main>
  );
}