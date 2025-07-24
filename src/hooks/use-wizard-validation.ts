import { useWizard } from '@/contexts/wizard-context';

export function useWizardValidation() {
    const { state } = useWizard();

    const validateStep1 = () => {
        return true; // Parâmetros básicos sempre válidos
    };

    const validateStep2 = () => {
        return state.selectedEmployees.length > 0;
    };

    const validateStep3 = () => {
        return state.selectedEpis.length > 0;
    };

    const validateStep4 = () => {
        return state.confirmarValidacao && state.loanActions.length > 0;
    };

    const validateStep5 = () => {
        return true; // Sempre válido na conclusão
    };

    const canProceedToStep = (step: number) => {
        switch (step) {
            case 1:
                return validateStep1();
            case 2:
                return validateStep2();
            case 3:
                return validateStep3();
            case 4:
                return validateStep4();
            case 5:
                return validateStep5();
            default:
                return false;
        }
    };

    const getValidationMessage = (step: number) => {
        switch (step) {
            case 2:
                return !validateStep2() ? 'Selecione pelo menos um funcionário' : '';
            case 3:
                return !validateStep3() ? 'Selecione pelo menos um EPI' : '';
            case 4:
                return !validateStep4() ? 'Confirme a validação das ações configuradas' : '';
            default:
                return '';
        }
    };

    return {
        validateStep1,
        validateStep2,
        validateStep3,
        validateStep4,
        validateStep5,
        canProceedToStep,
        getValidationMessage,
    };
}
