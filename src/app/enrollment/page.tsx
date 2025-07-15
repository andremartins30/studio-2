import { PageHeader } from "@/components/page-header";
import { EnrollmentForm } from "./enrollment-form";

export default function EnrollmentPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Biometric Enrollment"
        description="Register new users by capturing their image and linking it to an employee ID."
      />
      <div className="max-w-2xl mx-auto w-full">
         <EnrollmentForm />
      </div>
    </div>
  );
}
