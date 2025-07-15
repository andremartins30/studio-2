import { PageHeader } from "@/components/page-header";
import { VerificationClient } from "./verification-client";

export default function VerificationPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI-Powered Identity Verification"
        description="Verify user identity using facial recognition or get suggestions for potential matches."
      />
      <VerificationClient />
    </div>
  );
}
