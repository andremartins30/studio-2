'use client';

import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { EnrollmentForm } from "./enrollment-form";

export default function EnrollmentPage() {
  return (
    <ProtectedPage>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Cadastro Biométrico"
          description="Cadastre novos usuários capturando sua imagem e vinculando-a a uma matrícula de funcionário."
        />
        <div className="max-w-2xl mx-auto w-full">
          <EnrollmentForm />
        </div>
      </div>
    </ProtectedPage>
  );
}
