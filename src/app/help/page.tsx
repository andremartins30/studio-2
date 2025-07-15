import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, Building } from "lucide-react";

const faqs = [
  {
    question: "How do I enroll a new employee?",
    answer: "Navigate to the 'Biometric Enrollment' page from the sidebar. Fill in the employee's name and ID, then use the 'Capture Photo' button to take their picture. Finally, click 'Register User' to save the new profile."
  },
  {
    question: "What happens if an identity verification fails?",
    answer: "If a verification fails, the system will deny access and log the attempt. The 'Identity Verification' tool will show a 'Failed' status and may list possible alternative employee IDs if the facial scan is similar to other registered users."
  },
  {
    question: "Can I track the history of a specific piece of equipment?",
    answer: "Yes, on the 'Material Management' page, you can use the search bar to find equipment by its ID or type. The 'Transaction History' page also allows searching to see all logs related to a specific item or employee."
  },
  {
    question: "How do I update the API keys for integrations?",
    answer: "Go to the 'System Configuration' page. Here you can update the endpoint URLs and authentication keys for both UNISYSTEM and TOTVS RM. Click 'Save Configuration' to apply the changes."
  },
  {
    question: "Is it possible to export transaction data?",
    answer: "Yes. On the 'Transaction History' page, you will find an 'Export' button. This allows you to download the current view of the transaction log as a CSV file for reporting and auditing purposes."
  }
];

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Help & Support"
        description="Find answers to common questions and get in touch with our support team."
      />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
        <div>
             <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Technical Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-accent" />
                        <span className="text-muted-foreground">+55 (11) 98765-4321</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-accent" />
                        <span className="text-muted-foreground">support@epicontrol.com</span>
                    </div>
                     <div className="flex items-start gap-4">
                        <Building className="h-5 w-5 text-accent mt-1" />
                        <div className="text-muted-foreground">
                            <p>EPI Control HQ</p>
                            <p>Rua da Tecnologia, 123</p>
                             <p>São Paulo, SP, Brazil</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
