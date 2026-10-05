import { Link } from 'react-router';
import { RegisterForm } from '../features/auth/RegisterForm';
import { AuthLayout } from '../layouts/AuthLayout';

export function RegisterPage() {
  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Regístrate para consultar tus carreras y cargar saldo."
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-bold text-shell-700 hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}