import { useState } from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { useAuth } from '../features/auth/useAuth';
import { TopUpModal } from '../features/snailpay/TopUpModal';
import { formatCurrency } from '../lib/format';
import { BetsDonutChart } from '../features/stats/BetsDonutChart';
import { RaceWinsChart } from '../features/stats/RaceWinsChart';
import { countWinsBySnail, getTodayStats, RACES_PER_DAY, summarizeBets } from '../features/stats/dailyStats';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [stats] = useState(() => getTodayStats());

  const betsSummary = summarizeBets(stats.bets);
  const winsBySnail = countWinsBySnail(stats.races);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-bark-900/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <Button variant="secondary" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-extrabold text-bark-900">Hola, {user.fullName}</h1>
        <p className="mt-1 text-bark-600">Este es el resumen de tu día en la pista.</p>

        <section
          aria-labelledby="balance-title"
          className="mt-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-bark-900/5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 id="balance-title" className="text-sm font-semibold text-bark-600">
              Saldo disponible
            </h2>
            <p aria-live="polite" className="mt-1 text-4xl font-extrabold text-bark-900">
              {formatCurrency(user.balance)}
            </p>
          </div>
          <Button onClick={() => setIsTopUpOpen(true)}>Cargar saldo</Button>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section
                aria-labelledby="bets-title"
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-bark-900/5"
            >
                <h2 id="bets-title" className="text-lg font-extrabold text-bark-900">
                Tus apuestas de hoy
                </h2>
                <p className="mt-1 text-sm text-bark-600">Ganadas y perdidas en las carreras del día.</p>
                <div className="mt-4">
                <BetsDonutChart won={betsSummary.won} lost={betsSummary.lost} />
                </div>
            </section>

            <section
                aria-labelledby="wins-title"
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-bark-900/5"
            >
                <h2 id="wins-title" className="text-lg font-extrabold text-bark-900">
                Victorias por caracol
                </h2>
                <p className="mt-1 text-sm text-bark-600">
                Resultados de las {RACES_PER_DAY} carreras de hoy.
                </p>
                <div className="mt-4">
                <RaceWinsChart data={winsBySnail} />
                </div>
            </section>
        </div>
      </main>

      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </div>
  );
}