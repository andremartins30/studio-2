'use client';

import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { SettingsForm } from "@/components/settings-form";

export default function SettingsPage() {
    return (
        <ProtectedPage>
            <div className="flex flex-col gap-8">
                <PageHeader
                    title="Configuração do Sistema"
                    description="Configure suas informações pessoais e preferências do sistema."
                />

                <SettingsForm />
            </div>
        </ProtectedPage>
    );
}
