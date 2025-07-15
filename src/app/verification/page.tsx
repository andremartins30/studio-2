'use client';

import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { VerificationClient } from "./verification-client";

export default function VerificationPage() {
    return (
        <ProtectedPage>
            <div className="flex flex-col gap-8">
                <PageHeader
                    title="Verificação de Identidade"
                    description="Use IA para verificar a identidade de funcionários comparando fotos em tempo real com registros biométricos."
                />
                <VerificationClient />
            </div>
        </ProtectedPage>
    );
}
