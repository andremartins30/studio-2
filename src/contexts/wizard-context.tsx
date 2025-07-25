'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WizardState, WizardStep, WizardContextType, WizardFlow, StepValidation } from '@/types/epi';
import { validateStep, canNavigateToStep } from '@/config/wizard-flows';

const initialState: WizardState = {
    tipoOperacao: 'fornecimento',
    destino: 'funcionarios',
    gerarRelatorio: false,
    selectedEmployees: [],
    codigoFiscal: '',
    codigoGrupoEpi: '',
    dataConsideração: 'livre',
    selectedEpis: [],
    considerarDataTransferencia: false,
    loanActions: [],
    acaoPadrao: 'fornecer',
    confirmarValidacao: false,
    motivoDevolucao: 'EPI com defeito',
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState<WizardStep>(1);
    const [currentFlow, setCurrentFlow] = useState<WizardFlow>('fornecimento');
    const [state, setState] = useState<WizardState>(initialState);

    const updateState = (updates: Partial<WizardState>) => {
        setState(prev => ({ ...prev, ...updates }));

        // Auto-switch flow based on operation type
        if (updates.tipoOperacao) {
            if (updates.tipoOperacao === 'devolucao') {
                setCurrentFlow('devolucao');
            } else if (updates.tipoOperacao === 'descarte') {
                setCurrentFlow('descarte');
            } else {
                setCurrentFlow('fornecimento');
            }
        }
    };

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 5) as WizardStep);
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1) as WizardStep);
    };

    const goToStep = (step: WizardStep) => {
        setCurrentStep(step);
    };

    const resetWizard = () => {
        setState(initialState);
        setCurrentStep(1);
        setCurrentFlow('fornecimento');
    };

    const switchFlow = (flow: WizardFlow) => {
        setCurrentFlow(flow);
        setCurrentStep(1);
        // Reset state when switching flows but keep basic info
        let tipoOperacao: WizardState['tipoOperacao'] = 'fornecimento';
        if (flow === 'devolucao') {
            tipoOperacao = 'devolucao';
        } else if (flow === 'descarte') {
            tipoOperacao = 'descarte';
        }

        setState({
            ...initialState,
            tipoOperacao
        });
    };

    // Funções de validação usando a configuração centralizada
    const validateCurrentStep = (): StepValidation => {
        return validateStep(currentStep, state);
    };

    const canNavigateToStepFn = (step: WizardStep): boolean => {
        return canNavigateToStep(step, state);
    };

    return (
        <WizardContext.Provider value={{
            currentStep,
            currentFlow,
            state,
            updateState,
            nextStep,
            prevStep,
            goToStep,
            resetWizard,
            switchFlow,
            validateCurrentStep,
            canNavigateToStep: canNavigateToStepFn,
        }}>
            {children}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (context === undefined) {
        throw new Error('useWizard must be used within a WizardProvider');
    }
    return context;
}
