import { useMemo } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { validateStep, canNavigateToStep } from '@/config/wizard-flows';
import { StepValidation, WizardStep } from '@/types/epi';

/**
 * Hook customizado para validação de steps do wizard
 * Centraliza toda a lógica de validação e navegação
 */
export function useWizardValidation() {
    const { state, currentStep } = useWizard();

    /**
     * Validação do step atual
     */
    const currentStepValidation = useMemo((): StepValidation => {
        return validateStep(currentStep, state);
    }, [currentStep, state]);

    /**
     * Verifica se pode navegar para um step específico
     */
    const canNavigateTo = useMemo(() => {
        return (targetStep: WizardStep): boolean => {
            return canNavigateToStep(targetStep, state);
        };
    }, [state]);

    /**
     * Verifica se pode avançar para o próximo step
     */
    const canNavigateNext = useMemo((): boolean => {
        const nextStep = Math.min(currentStep + 1, 5) as WizardStep;
        return canNavigateToStep(nextStep, state);
    }, [currentStep, state]);

    /**
     * Verifica se pode voltar para o step anterior
     */
    const canNavigatePrev = useMemo((): boolean => {
        return currentStep > 1;
    }, [currentStep]);

    /**
     * Obter validação de um step específico
     */
    const getStepValidation = (step: WizardStep): StepValidation => {
        return validateStep(step, state);
    };

    /**
     * Verifica se todos os steps anteriores ao atual são válidos
     */
    const arePreviousStepsValid = useMemo((): boolean => {
        for (let step = 1; step < currentStep; step++) {
            if (!validateStep(step as WizardStep, state).isValid) {
                return false;
            }
        }
        return true;
    }, [currentStep, state]);

    /**
     * Obter lista de erros de todos os steps
     */
    const getAllErrors = useMemo((): { step: WizardStep; errors: string[] }[] => {
        const allErrors: { step: WizardStep; errors: string[] }[] = [];

        for (let step = 1; step <= 5; step++) {
            const validation = validateStep(step as WizardStep, state);
            if (!validation.isValid && validation.errors) {
                allErrors.push({
                    step: step as WizardStep,
                    errors: validation.errors
                });
            }
        }

        return allErrors;
    }, [state]);

    /**
     * Calcular progresso do wizard (percentual de steps válidos)
     */
    const progress = useMemo((): number => {
        let validSteps = 0;
        for (let step = 1; step <= currentStep; step++) {
            if (validateStep(step as WizardStep, state).isValid) {
                validSteps++;
            }
        }
        return (validSteps / 5) * 100;
    }, [currentStep, state]);

    /**
     * Verificar se o wizard pode ser finalizado
     */
    const canFinishWizard = useMemo((): boolean => {
        return validateStep(5, state).isValid && arePreviousStepsValid;
    }, [state, arePreviousStepsValid]);

    return {
        // Validação do step atual
        currentStepValidation,
        isCurrentStepValid: currentStepValidation.isValid,
        currentStepErrors: currentStepValidation.errors || [],
        currentStepWarnings: currentStepValidation.warnings || [],

        // Navegação
        canNavigateNext,
        canNavigatePrev,
        canNavigateTo,

        // Validação de steps específicos
        getStepValidation,
        arePreviousStepsValid,

        // Informações gerais
        getAllErrors,
        progress,
        canFinishWizard
    };
}
