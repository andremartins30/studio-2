import { redirect } from 'next/navigation';

export default function RootPage() {
  // Página inicial redireciona para login
  redirect('/login');
}
