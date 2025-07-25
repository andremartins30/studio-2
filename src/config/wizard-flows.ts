import React from 'react';
import { FlowConfig, StepConfig, WizardState, StepValidation } from '@/types/epi';

/**
 * Constantes para títulos e descrições padronizadas
 */
export const FLOW_TITLES = {
    fornecimento: 'Assistente para Fornecimento Automático',
    devolucao: 'Assistente para Devolução de EPIs',
    descarte: 'Assistente para Descarte de EPIs',
    cancelamento: 'Assistente para Cancelamento de EPIs'
} as const;

export const STEP_TITLES = {
    fornecimento: {
        1: 'Seleção de Parâmetros',
        2: 'Seleção de Funcionários',
        3: 'Seleção do Lote',
        4: 'Definir Ação por Lote',
        5: 'Execução Concluída',
    },
    devolucao: {
        1: 'Seleção de Parâmetros',
        2: 'Seleção de Funcionários',
        3: 'Definir Ação por Lote',
        4: 'Motivo da Devolução',
        5: 'Execução Concluída',
    },
    descarte: {
        1: 'Seleção de Parâmetros',
        2: 'Seleção de Funcionários',
        3: 'Definir Ação por Lote',
        4: 'Motivo do Descarte',
        5: 'Execução Concluída',
    },
    cancelamento: {
        1: 'Seleção de Parâmetros',
        2: 'Seleção de Funcionários',
        3: 'Definição de Ações por Lote',
        4: 'Motivo do Cancelamento',
        5: 'Execução Concluída',
    }
} as const;

export const STEP_DESCRIPTIONS = {
    fornecimento: {
        1: 'Configurações iniciais',
        2: 'Seleção de pessoas',
        3: 'EPIs disponíveis',
        4: 'Definir empréstimos',
        5: 'Processo concluído',
    },
    devolucao: {
        1: 'Configurações iniciais',
        2: 'Com EPIs emprestados',
        3: 'Configurar devoluções',
        4: 'Razão da devolução',
        5: 'Processo concluído',
    },
    descarte: {
        1: 'Configurações iniciais',
        2: 'Com EPIs p/ descarte',
        3: 'Configurar descartes',
        4: 'Razão do descarte',
        5: 'Processo concluído',
    },
    cancelamento: {
        1: 'Configurações iniciais',
        2: 'Com EPIs emprestados',
        3: 'Configurar cancelamentos',
        4: 'Motivo do cancelamento',
        5: 'Processo concluído',
    }
} as const;

/**
 * Funções de validação padronizadas para cada step
 */
export const stepValidators = {
    /**
     * Validação para Step 1 - Seleção de Parâmetros
     */
    validateParameterSelection: (state: WizardState): StepValidation => {
        const errors: string[] = [];

        if (!state.tipoOperacao) {
            errors.push('Tipo de operação é obrigatório');
        }

        if (!state.destino) {
            errors.push('Destino é obrigatório');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Validação para Step 2 - Seleção de Funcionários
     */
    validateEmployeeSelection: (state: WizardState): StepValidation => {
        const errors: string[] = [];

        if (state.selectedEmployees.length === 0) {
            errors.push('Pelo menos um funcionário deve ser selecionado');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Validação para Step 3 - Seleção/Ação por Lote
     */
    validateBatchOrActionSelection: (state: WizardState): StepValidation => {
        const errors: string[] = [];

        // Fornecimento - precisa ter EPIs selecionados
        if (state.tipoOperacao === 'fornecimento' && state.selectedEpis.length === 0) {
            errors.push('Pelo menos um EPI deve ser selecionado');
        }

        // Devolução/Descarte/Cancelamento - precisa ter ações configuradas
        if ((state.tipoOperacao === 'devolucao' || state.tipoOperacao === 'descarte' || state.tipoOperacao === 'cancelamento') &&
            state.loanActions.length === 0) {
            errors.push('Pelo menos uma ação deve ser configurada');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Validação para Step 4 - Ações/Motivo
     */
    validateActionOrReason: (state: WizardState): StepValidation => {
        const errors: string[] = [];

        // Fornecimento - precisa confirmar validação
        if (state.tipoOperacao === 'fornecimento' && !state.confirmarValidacao) {
            errors.push('É obrigatório confirmar a validação das ações');
        }

        // Devolução - precisa ter motivo
        if (state.tipoOperacao === 'devolucao' && !state.motivoDevolucao) {
            errors.push('Motivo da devolução é obrigatório');
        }

        // Descarte - precisa ter motivo
        if (state.tipoOperacao === 'descarte' && !state.motivoDescarte) {
            errors.push('Motivo do descarte é obrigatório');
        }

        // Cancelamento - precisa ter motivo
        if (state.tipoOperacao === 'cancelamento' && !state.motivoCancelamento) {
            errors.push('Motivo do cancelamento é obrigatório');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Validação para Step 5 - Execução
     */
    validateExecution: (state: WizardState): StepValidation => {
        // Step de execução sempre é válido
        return { isValid: true };
    }
};

/**
 * Funções para verificar se pode navegar para um step específico
 */
export const navigationValidators = {
    canNavigateToStep2: (state: WizardState): boolean => {
        return stepValidators.validateParameterSelection(state).isValid;
    },

    canNavigateToStep3: (state: WizardState): boolean => {
        return stepValidators.validateParameterSelection(state).isValid &&
            stepValidators.validateEmployeeSelection(state).isValid;
    },

    canNavigateToStep4: (state: WizardState): boolean => {
        return stepValidators.validateParameterSelection(state).isValid &&
            stepValidators.validateEmployeeSelection(state).isValid &&
            stepValidators.validateBatchOrActionSelection(state).isValid;
    },

    canNavigateToStep5: (state: WizardState): boolean => {
        return stepValidators.validateParameterSelection(state).isValid &&
            stepValidators.validateEmployeeSelection(state).isValid &&
            stepValidators.validateBatchOrActionSelection(state).isValid &&
            stepValidators.validateActionOrReason(state).isValid;
    }
};

/**
 * Configuração base para todos os steps - será estendida pelos flows específicos
 */
export const baseStepConfigs: Omit<StepConfig, 'component'>[] = [
    {
        id: 1,
        title: 'Parâmetros',
        description: 'Configurações iniciais',
        validate: stepValidators.validateParameterSelection,
        canNavigateBack: false,
        canNavigateForward: (state) => stepValidators.validateParameterSelection(state).isValid
    },
    {
        id: 2,
        title: 'Funcionários',
        description: 'Seleção de pessoas',
        validate: stepValidators.validateEmployeeSelection,
        canNavigateBack: true,
        canNavigateForward: (state) => stepValidators.validateEmployeeSelection(state).isValid
    },
    {
        id: 3,
        title: 'Lote/Ação',
        description: 'Configuração de itens',
        validate: stepValidators.validateBatchOrActionSelection,
        canNavigateBack: true,
        canNavigateForward: (state) => stepValidators.validateBatchOrActionSelection(state).isValid
    },
    {
        id: 4,
        title: 'Ação/Motivo',
        description: 'Finalização da configuração',
        validate: stepValidators.validateActionOrReason,
        canNavigateBack: true,
        canNavigateForward: (state) => stepValidators.validateActionOrReason(state).isValid
    },
    {
        id: 5,
        title: 'Execução',
        description: 'Processo finalizado',
        validate: stepValidators.validateExecution,
        canNavigateBack: true,
        canNavigateForward: () => true
    }
];

/**
 * Estados iniciais específicos para cada flow
 */
export const flowInitialStates = {
    fornecimento: {
        tipoOperacao: 'fornecimento' as const,
        acaoPadrao: 'fornecer'
    },
    devolucao: {
        tipoOperacao: 'devolucao' as const,
        motivoDevolucao: 'EPI com defeito'
    },
    descarte: {
        tipoOperacao: 'descarte' as const,
        motivoDescarte: ''
    },
    cancelamento: {
        tipoOperacao: 'cancelamento' as const,
        destino: 'funcionarios' as const,
        aceitoSugestaoAcao: true,
        motivoCancelamento: ''
    }
};

/**
 * Função para obter o título do wizard baseado no flow atual
 */
export const getWizardTitle = (flow: keyof typeof FLOW_TITLES): string => {
    return FLOW_TITLES[flow];
};

/**
 * Função para obter título e descrição de um step específico
 */
export const getStepInfo = (flow: keyof typeof STEP_TITLES, step: 1 | 2 | 3 | 4 | 5) => {
    return {
        title: STEP_TITLES[flow][step],
        description: STEP_DESCRIPTIONS[flow][step]
    };
};

/**
 * Função para validar um step específico
 */
export const validateStep = (step: 1 | 2 | 3 | 4 | 5, state: WizardState): StepValidation => {
    switch (step) {
        case 1: return stepValidators.validateParameterSelection(state);
        case 2: return stepValidators.validateEmployeeSelection(state);
        case 3: return stepValidators.validateBatchOrActionSelection(state);
        case 4: return stepValidators.validateActionOrReason(state);
        case 5: return stepValidators.validateExecution(state);
        default: return { isValid: false, errors: ['Step inválido'] };
    }
};

/**
 * Função para verificar se pode navegar para um step específico
 */
export const canNavigateToStep = (targetStep: 1 | 2 | 3 | 4 | 5, state: WizardState): boolean => {
    switch (targetStep) {
        case 1: return true; // Sempre pode voltar ao primeiro step
        case 2: return navigationValidators.canNavigateToStep2(state);
        case 3: return navigationValidators.canNavigateToStep3(state);
        case 4: return navigationValidators.canNavigateToStep4(state);
        case 5: return navigationValidators.canNavigateToStep5(state);
        default: return false;
    }
}; 