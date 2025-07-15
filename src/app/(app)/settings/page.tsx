import { PageHeader } from "@/components/page-header";
import { SettingsForm } from "./settings-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Configuração do Sistema"
        description="Gerencie parâmetros para integrações de sistemas e conexões de API."
      />
      <div className="max-w-4xl w-full">
         <SettingsForm />
      </div>
    </div>
  );
}
