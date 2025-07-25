'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useWizard } from '@/contexts/wizard-context';
import { useWizardValidation } from '@/hooks/use-wizard-validation';
import { BaseStepProps } from '@/types/epi';

/**
 * Interface para configuração do layout do step
 */
interface StepLayoutConfig {
    title?: string;
    description?: string;
    showCard?: boolean;
    showNavigation?: boolean;
    backButtonLabel?: string;
    nextButtonLabel?: string;
    backButtonVariant?: 'default' | 'outline' | 'secondary' | 'destructive';
    nextButtonVariant?: 'default' | 'outline' | 'secondary' | 'destructive';
    customButtons?: React.ReactNode;
    className?: string;
}

/**
 * Props para o BaseStep
 */
interface BaseStepComponentProps extends BaseStepProps {
    layout?: StepLayoutConfig;
    children: React.ReactNode;
    onValidate?: () => boolean;
    validationMessage?: string;
    showValidationErrors?: boolean;
}

/**
 * Componente base padronizado para todos os steps do wizard
 * Fornece estrutura consistente, navegação e validação
 */
export function BaseStep({
    children,
    layout = {},
    onValidate,
    validationMessage,
    showValidationErrors = true,
    onNext,
    onPrev
}: BaseStepComponentProps) {
    const { nextStep, prevStep, resetWizard } = useWizard();
    const {
        currentStepValidation,
        canNavigateNext,
        canNavigatePrev,
        currentStepErrors,
        currentStepWarnings
    } = useWizardValidation();

    const {
        title,
        description,
        showCard = true,
        showNavigation = true,
        backButtonLabel = '← Voltar',
        nextButtonLabel = 'Avançar →',
        backButtonVariant = 'outline',
        nextButtonVariant = 'default',
        customButtons,
        className = ''
    } = layout;

    /**
     * Função para avançar com validação
     */
    const handleNext = () => {
        // Executar validação customizada se fornecida
        if (onValidate && !onValidate()) {
            return;
        }

        // Executar callback personalizado se fornecido
        if (onNext) {
            onNext();
        } else {
            nextStep();
        }
    };

    /**
     * Função para voltar
     */
    const handlePrev = () => {
        if (onPrev) {
            onPrev();
        } else {
            prevStep();
        }
    };

    /**
     * Renderizar alertas de validação
     */
    const renderValidationAlerts = () => {
        if (!showValidationErrors) return null;

        return (
            <>
                {/* Erros de validação */}
                {currentStepErrors.length > 0 && (
                    <Alert variant="destructive" className="mb-4">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="font-medium mb-1">Erro de validação:</div>
                            <ul className="list-disc list-inside space-y-1">
                                {currentStepErrors.map((error, index) => (
                                    <li key={index} className="text-sm">{error}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Avisos de validação */}
                {currentStepWarnings.length > 0 && (
                    <Alert className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="font-medium mb-1">Atenção:</div>
                            <ul className="list-disc list-inside space-y-1">
                                {currentStepWarnings.map((warning, index) => (
                                    <li key={index} className="text-sm">{warning}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Mensagem de validação customizada */}
                {validationMessage && (
                    <Alert variant="default" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{validationMessage}</AlertDescription>
                    </Alert>
                )}

                {/* Sucesso quando step está válido */}
                {currentStepValidation.isValid && currentStepErrors.length === 0 && (
                    <Alert className="mb-4 border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Configurações válidas. Você pode prosseguir para a próxima etapa.
                        </AlertDescription>
                    </Alert>
                )}
            </>
        );
    };

    /**
     * Renderizar navegação
     */
    const renderNavigation = () => {
        if (!showNavigation) return null;

        return (
            <div className="flex justify-between pt-6 border-t">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={resetWizard}
                        size="sm"
                    >
                        Cancelar
                    </Button>
                </div>

                <div className="flex gap-2">
                    {customButtons}

                    <Button
                        variant={backButtonVariant}
                        onClick={handlePrev}
                        disabled={!canNavigatePrev}
                        size="sm"
                    >
                        {backButtonLabel}
                    </Button>

                    <Button
                        variant={nextButtonVariant}
                        onClick={handleNext}
                        disabled={!canNavigateNext}
                        size="sm"
                    >
                        {nextButtonLabel}
                    </Button>
                </div>
            </div>
        );
    };

    /**
     * Renderizar conteúdo
     */
    const content = (
        <div className={`space-y-4 ${className}`}>
            {/* Cabeçalho opcional */}
            {title && (
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    {description && (
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                    )}
                </div>
            )}

            {/* Alertas de validação */}
            {renderValidationAlerts()}

            {/* Conteúdo do step */}
            {children}

            {/* Navegação */}
            {renderNavigation()}
        </div>
    );

    // Retornar com ou sem card conforme configuração
    if (showCard) {
        return (
            <Card>
                <CardContent className="p-6">
                    {content}
                </CardContent>
            </Card>
        );
    }

    return content;
}

/**
 * Hook para usar configuração de layout comum
 */
export function useStepLayout() {
    const { currentStep } = useWizard();

    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === 5;

    return {
        getDefaultLayout: (overrides: Partial<StepLayoutConfig> = {}): StepLayoutConfig => ({
            backButtonLabel: isFirstStep ? 'Cancelar' : '← Voltar',
            nextButtonLabel: isLastStep ? 'Finalizar' : 'Avançar →',
            nextButtonVariant: isLastStep ? 'default' : 'default',
            showCard: true,
            showNavigation: true,
            ...overrides
        }),
        isFirstStep,
        isLastStep
    };
} 