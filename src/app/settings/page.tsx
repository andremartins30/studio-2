import { PageHeader } from "@/components/page-header";
import { SettingsForm } from "./settings-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="System Configuration"
        description="Manage parameters for system integrations and API connections."
      />
      <div className="max-w-4xl w-full">
         <SettingsForm />
      </div>
    </div>
  );
}
