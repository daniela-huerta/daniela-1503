import { Link } from 'react-router';
import { LoginForm } from '../features/auth/LoginForm';
import { AuthLayout } from '../layouts/AuthLayout';

export function LoginPage() {
  return (
    <AuthLayout
      title="Inicia sesión"
      subtitle="Accede a tu panel de carreras."
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-bold text-shell-700 hover:underline">
            Regístrate
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}