'use client';

import React from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STEPS = {
    fornecimento: [
        { step: 1, title: 'Parâmetros', description: 'Configurações iniciais' },
        { step: 2, title: 'Funcionários', description: 'Seleção de pessoas' },
        { step: 3, title: 'Lote', description: 'EPIs disponíveis' },
        { step: 4, title: 'Ações', description: 'Definir empréstimos' },
        { step: 5, title: 'Finalização', description: 'Processo concluído' },
    ],
    devolucao: [
        { step: 1, title: 'Parâmetros', description: 'Configurações iniciais' },
        { step: 2, title: 'Funcionários', description: 'Com EPIs emprestados' },
        { step: 3, title: 'Ação por Lote', description: 'Configurar devoluções' },
        { step: 4, title: 'Motivo', description: 'Razão da devolução' },
        { step: 5, title: 'Finalização', description: 'Processo concluído' },
    ],
    descarte: [
        { step: 1, title: 'Parâmetros', description: 'Configurações iniciais' },
        { step: 2, title: 'Funcionários', description: 'Com EPIs p/ descarte' },
        { step: 3, title: 'Ação por Lote', description: 'Configurar descartes' },
        { step: 4, title: 'Motivo', description: 'Razão do descarte' },
        { step: 5, title: 'Finalização', description: 'Processo concluído' },
    ]
};

export function WizardNavigation() {
    const { currentStep, currentFlow, goToStep } = useWizard();

    const steps = STEPS[currentFlow];

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
                                // Só permite navegar para etapas anteriores ou atual
                                if (step.step <= currentStep) {
                                    goToStep(step.step as any);
                                }
                            }}
                            disabled={step.step > currentStep}
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
