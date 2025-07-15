import { PageHeader } from "@/components/page-header";
import { VerificationClient } from "./verification-client";

export default function VerificationPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Verificação de Identidade com IA"
        description="Verifique a identidade do usuário usando reconhecimento facial ou obtenha sugestões de possíveis correspondências."
      />
      <VerificationClient />
    </div>
  );
}
