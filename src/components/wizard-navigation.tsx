'use client';

import React from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getStepInfo } from '@/config/wizard-flows';
import { useWizardValidation } from '@/hooks/use-wizard-validation';

export function WizardNavigation() {
    const { currentStep, currentFlow, goToStep } = useWizard();
    const { canNavigateTo } = useWizardValidation();

    // Gerar steps dinamicamente baseado na configuração
    const steps = Array.from({ length: 5 }, (_, index) => {
        const stepNumber = index + 1;
        const stepInfo = getStepInfo(currentFlow, stepNumber as 1 | 2 | 3 | 4 | 5);
        return {
            step: stepNumber,
            title: stepInfo.title.split(' ')[0], // Primeira palavra do título
            description: stepInfo.description
        };
    });

    return (
        <div className="flex justify-between items-center mb-4 p-3 bg-white rounded-lg border">
            {steps.map((step, index) => (
                <React.Fragment key={step.step}>
                    <div className="flex flex-col items-center">
                        <Button
                            variant={currentStep === step.step ? 'default' : currentStep > step.step ? 'secondary' : 'outline'}
                            size="sm"
                            className={cn(
                                'w-8 h-8 rounded-full p-0 mb-1 text-xs',
                                currentStep === step.step && 'bg-blue-600 text-white',
                                currentStep > step.step && 'bg-green-600 text-white'
                            )}
                            onClick={() => {
                                // Usar validação centralizada para determinar se pode navegar
                                if (canNavigateTo(step.step as 1 | 2 | 3 | 4 | 5)) {
                                    goToStep(step.step as 1 | 2 | 3 | 4 | 5);
                                }
                            }}
                            disabled={!canNavigateTo(step.step as 1 | 2 | 3 | 4 | 5)}
                        >
                            {currentStep > step.step ? '✓' : step.step}
                        </Button>
                        <div className="text-center">
                            <div className="text-xs font-medium">{step.title}</div>
                            <div className="text-xs text-gray-500 hidden sm:block">{step.description}</div>
                        </div>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={cn(
                                'flex-1 h-0.5 mx-2 mt-4',
                                currentStep > step.step ? 'bg-green-600' : 'bg-gray-300'
                            )}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
