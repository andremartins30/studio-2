import { PageHeader } from "@/components/page-header";
import { AppLayout } from "@/components/app-layout";
import { VerificationClient } from "./verification-client";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function VerificationPage() {
    // Verifica se o usuário está autenticado
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');

    if (!sessionToken) {
        // Usuário não autenticado, redireciona para login
        redirect('/login');
    }

    return (
        <AppLayout>
            <div className="flex flex-col gap-8">
                <PageHeader
                    title="Verificação de Identidade"
                    description="Use IA para verificar a identidade de funcionários comparando fotos em tempo real com registros biométricos."
                />
                <VerificationClient />
            </div>
        </AppLayout>
    );
}
