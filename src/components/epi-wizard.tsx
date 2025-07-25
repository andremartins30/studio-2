'use client';

import React from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WizardNavigation } from '@/components/wizard-navigation';
import { WizardSummary } from '@/components/wizard-summary';
import { getWizardTitle, getStepInfo } from '@/config/wizard-flows';
import {
    ParameterSelection,
    EmployeeSelection,
    BatchSelection,
    ActionDefinition,
    ExecutionComplete,
} from './steps';
import DevolutionEmployeeSelection from './steps/devolution-employee-selection';
import DevolutionActionDefinition from './steps/devolution-action-definition';
import DevolutionReason from './steps/devolution-reason';
import DescarteEmployeeSelection from './steps/descarte-employee-selection';
import DescarteActionDefinition from './steps/descarte-action-definition';
import DescarteReason from './steps/descarte-reason';
import CancelamentoParameterSelection from './steps/cancelamento-parameter-selection';
import CancelamentoEmployeeSelection from './steps/cancelamento-employee-selection';

export default function EpiWizard() {
    const { currentStep, currentFlow } = useWizard();

    const progress = (currentStep / 5) * 100;
    const wizardTitle = getWizardTitle(currentFlow);
    const stepInfo = getStepInfo(currentFlow, currentStep);

    const renderCurrentStep = () => {
        // Fluxo de Fornecimento
        if (currentFlow === 'fornecimento') {
            switch (currentStep) {
                case 1:
                    return <ParameterSelection />;
                case 2:
                    return <EmployeeSelection />;
                case 3:
                    return <BatchSelection />;
                case 4:
                    return <ActionDefinition />;
                case 5:
                    return <ExecutionComplete />;
                default:
                    return <ParameterSelection />;
            }
        }

        // Fluxo de Devolução
        if (currentFlow === 'devolucao') {
            switch (currentStep) {
                case 1:
                    return <ParameterSelection />;
                case 2:
                    return <DevolutionEmployeeSelection />;
                case 3:
                    return <DevolutionActionDefinition />;
                case 4:
                    return <DevolutionReason />;
                case 5:
                    return <ExecutionComplete />;
                default:
                    return <ParameterSelection />;
            }
        }

        // Fluxo de Descarte
        if (currentFlow === 'descarte') {
            switch (currentStep) {
                case 1:
                    return <ParameterSelection />;
                case 2:
                    return <DescarteEmployeeSelection />;
                case 3:
                    return <DescarteActionDefinition />;
                case 4:
                    return <DescarteReason />;
                case 5:
                    return <ExecutionComplete />;
                default:
                    return <ParameterSelection />;
            }
        }

        // Fluxo de Cancelamento
        if (currentFlow === 'cancelamento') {
            switch (currentStep) {
                case 1:
                    return <CancelamentoParameterSelection />;
                case 2:
                    return <CancelamentoEmployeeSelection />;
                case 3:
                    return <ParameterSelection />; // TODO: Criar CancelamentoActionDefinition
                case 4:
                    return <ParameterSelection />; // TODO: Criar CancelamentoReason
                case 5:
                    return <ExecutionComplete />;
                default:
                    return <CancelamentoParameterSelection />;
            }
        }

        // Fallback
        return <ParameterSelection />;
    };

    return (
        <div className="w-full">
            <Card className="shadow-sm border">
                <CardHeader className="text-white" style={{ backgroundColor: 'hsl(202, 46%, 12%)' }}>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">
                            {wizardTitle}
                        </CardTitle>
                        <div className="text-sm">
                            Passo {currentStep} de 5
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="relative w-full h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-300 ease-out rounded-full"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: 'hsl(27, 79%, 54%)'
                                }}
                            />
                        </div>
                        <div className="mt-2 text-sm opacity-90">
                            {stepInfo.title}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4">
                    {/* Navegação entre etapas */}
                    <WizardNavigation />

                    {/* Resumo da operação */}
                    <WizardSummary />

                    {/* Conteúdo da etapa atual */}
                    {renderCurrentStep()}
                </CardContent>
            </Card>
        </div>
    );
}
