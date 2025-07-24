import { LoginForm } from './login-form';
import { LoginCredentials } from '@/components/login-credentials';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Login */}
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>

        {/* Credenciais de Acesso */}
        <div className="flex items-center justify-center">
          <LoginCredentials />
        </div>
      </div>
    </div>
  );
}
