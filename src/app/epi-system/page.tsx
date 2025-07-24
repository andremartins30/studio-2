'use client';

import { WizardProvider } from '@/contexts/wizard-context';
import { NotificationProvider } from '@/contexts/notification-context';
import { ProtectedPage } from '@/components/protected-page';
import { PageHeader } from '@/components/page-header';
import EpiWizard from '@/components/epi-wizard';

export default function EpiSystemPage() {
    return (
        <ProtectedPage>
            <NotificationProvider>
                <WizardProvider>
                    <div className="bg-white rounded-lg shadow-sm border">
                        <EpiWizard />
                    </div>
                </WizardProvider>
            </NotificationProvider>
        </ProtectedPage>
    );
}
