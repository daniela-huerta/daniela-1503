import { useAuth } from '../features/auth/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main>
      <h1>Hola, {user?.fullName}</h1>
      <p>Saldo: ${user?.balance}</p>
      <button type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </main>
  );
}