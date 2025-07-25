'use client';

import React from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { useNotification } from '@/contexts/notification-context';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseStep, useStepLayout } from '@/components/base-step';
import { UI_TEXTS, FORM_CONFIG, NOTIFICATION_MESSAGES } from '@/constants/wizard-constants';
import { BaseStepProps } from '@/types/epi';

/**
 * Componente de Seleção de Parâmetros refatorado usando BaseStep
 * Exemplo de como implementar um step seguindo o padrão padronizado
 */
export default function ParameterSelectionNew(props: BaseStepProps) {
    const { state, updateState } = useWizard();
    const { addNotification } = useNotification();
    const { getDefaultLayout } = useStepLayout();

    /**
     * Validação customizada para este step
     */
    const validateStep = (): boolean => {
        if (!state.tipoOperacao) {
            addNotification({
                type: 'error',
                title: UI_TEXTS.status.error,
                message: 'Selecione o tipo de operação',
            });
            return false;
        }

        if (!state.destino) {
            addNotification({
                type: 'error',
                title: UI_TEXTS.status.error,
                message: 'Selecione o destino',
            });
            return false;
        }

        return true;
    };

    /**
     * Callback personalizado para o botão "Avançar"
     */
    const handleNext = () => {
        addNotification({
            type: 'success',
            title: NOTIFICATION_MESSAGES.success.parametersConfigured,
            message: `Tipo: ${state.tipoOperacao}, Destino: ${state.destino}`,
        });

        // O BaseStep vai chamar nextStep() automaticamente
        if (props.onNext) {
            props.onNext();
        }
    };

    /**
     * Configuração do layout para este step
     */
    const stepLayout = getDefaultLayout({
        title: 'Configuração de Parâmetros',
        description: 'Defina o tipo de ação, destino e configurações adicionais',
        nextButtonLabel: 'Configurar Funcionários →'
    });

    return (
        <BaseStep
            layout={stepLayout}
            onValidate={validateStep}
            onNext={handleNext}
            {...props}
        >
            <div className="space-y-6">
                {/* Informação inicial */}
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                    💡 Defina abaixo o tipo de ação, a quem se destina e a ação a ser tomada
                </div>

                {/* Tipo de Operação */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            🔧 Tipo de Operação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <RadioGroup
                            value={state.tipoOperacao}
                            onValueChange={(value) => updateState({ tipoOperacao: value as any })}
                            className="space-y-3"
                        >
                            {FORM_CONFIG.operationTypes.map((option) => (
                                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                                    <RadioGroupItem
                                        value={option.value}
                                        id={option.value}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor={option.value} className="font-medium cursor-pointer">
                                            {option.label}
                                        </Label>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Destino */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            🎯 Destino da Operação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <RadioGroup
                            value={state.destino}
                            onValueChange={(value) => updateState({ destino: value as any })}
                            className="space-y-3"
                        >
                            {FORM_CONFIG.destinations.map((option) => (
                                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                                    <RadioGroupItem
                                        value={option.value}
                                        id={`dest-${option.value}`}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor={`dest-${option.value}`} className="font-medium cursor-pointer">
                                            {option.label}
                                        </Label>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Configurações Adicionais */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            ⚙️ Configurações Adicionais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                        {/* Gerar Relatório */}
                        <div className="flex items-start space-x-3 p-3 rounded-lg border">
                            <Checkbox
                                id="gerarRelatorio"
                                checked={state.gerarRelatorio}
                                onCheckedChange={(checked) => updateState({ gerarRelatorio: !!checked })}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <Label htmlFor="gerarRelatorio" className="font-medium cursor-pointer">
                                    Gerar Relatório
                                </Label>
                                <p className="text-sm text-gray-600 mt-1">
                                    Gerar relatório detalhado no final do processo
                                </p>
                            </div>
                        </div>

                        {/* Campo para nome do relatório quando selecionado */}
                        {state.gerarRelatorio && (
                            <div className="ml-6 pl-4 border-l-2 border-blue-200">
                                <Label htmlFor="nomeRelatorio" className="text-sm font-medium">
                                    Nome do Relatório
                                </Label>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        id="nomeRelatorio"
                                        type="text"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Digite o nome do relatório"
                                        defaultValue={`Relatório ${state.tipoOperacao} - ${new Date().toLocaleDateString('pt-BR')}`}
                                    />
                                    <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                                        📁
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Resumo das Seleções */}
                {(state.tipoOperacao || state.destino) && (
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                            <h4 className="font-medium text-green-800 mb-2">📋 Resumo das Configurações</h4>
                            <div className="text-sm space-y-1">
                                {state.tipoOperacao && (
                                    <div className="flex justify-between">
                                        <span className="text-green-700">Operação:</span>
                                        <span className="font-medium text-green-800 capitalize">
                                            {state.tipoOperacao}
                                        </span>
                                    </div>
                                )}
                                {state.destino && (
                                    <div className="flex justify-between">
                                        <span className="text-green-700">Destino:</span>
                                        <span className="font-medium text-green-800">
                                            {FORM_CONFIG.destinations.find(d => d.value === state.destino)?.label}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-green-700">Relatório:</span>
                                    <span className="font-medium text-green-800">
                                        {state.gerarRelatorio ? 'Sim' : 'Não'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </BaseStep>
    );
} 