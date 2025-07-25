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
import { AlertCircle, Users, CheckSquare, FileText } from 'lucide-react';

/**
 * Componente para seleção de parâmetros do fluxo de cancelamento
 * Implementa interface específica para cancelamento de EPIs seguindo padrão TOTVS RM
 */
export default function CancelamentoParameterSelection(props: BaseStepProps) {
    const { state, updateState } = useWizard();
    const { addNotification } = useNotification();
    const { getDefaultLayout } = useStepLayout();

    /**
     * Validação específica para parâmetros de cancelamento
     */
    const validateCancellationParameters = (): boolean => {
        if (state.tipoOperacao !== 'cancelamento') {
            addNotification({
                type: 'error',
                title: UI_TEXTS.status.error,
                message: 'Tipo de operação deve ser Cancelamento',
            });
            return false;
        }

        if (!state.destino) {
            addNotification({
                type: 'error',
                title: UI_TEXTS.status.error,
                message: 'Selecione o destino da operação',
            });
            return false;
        }

        return true;
    };

    /**
     * Callback para avançar para seleção de funcionários
     */
    const handleNext = () => {
        addNotification({
            type: 'success',
            title: 'Parâmetros de Cancelamento Configurados',
            message: `Destino: ${FORM_CONFIG.destinations.find(d => d.value === state.destino)?.label}`,
        });

        if (props.onNext) {
            props.onNext();
        }
    };

    /**
     * Configuração específica do layout para cancelamento
     */
    const stepLayout = getDefaultLayout({
        title: 'Configuração de Parâmetros - Cancelamento',
        description: 'Configure os parâmetros para o processo de cancelamento de empréstimos de EPIs',
        nextButtonLabel: 'Selecionar Funcionários →'
    });

    return (
        <BaseStep
            layout={stepLayout}
            onValidate={validateCancellationParameters}
            onNext={handleNext}
            {...props}
        >
            <div className="space-y-6">
                {/* Informação sobre cancelamento */}
                <div className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h4 className="font-medium text-orange-800 mb-1">
                            Sobre o Cancelamento de EPIs
                        </h4>
                        <p className="text-sm text-orange-700">
                            O cancelamento irá remover o empréstimo ativo dos EPIs selecionados,
                            tornando-os disponíveis novamente no estoque. Esta ação é irreversível
                            e deve ser utilizada quando o funcionário não precisa mais do EPI.
                        </p>
                    </div>
                </div>

                {/* Tipo de Operação (fixo em Cancelamento) */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-orange-600" />
                            Tipo de Operação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-orange-800">Cancelamento</div>
                                    <div className="text-sm text-orange-700">
                                        Cancelamento de empréstimos de EPIs ativos
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Aceitar Sugestão na Ação */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                            Configurações da Ação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                            <Checkbox
                                id="aceitoSugestaoAcao"
                                checked={state.aceitoSugestaoAcao || false}
                                onCheckedChange={(checked) => updateState({ aceitoSugestaoAcao: !!checked })}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <Label htmlFor="aceitoSugestaoAcao" className="font-medium cursor-pointer">
                                    Aceitar sugestão na ação
                                </Label>
                                <p className="text-sm text-gray-600 mt-1">
                                    Permite que o sistema sugira automaticamente quais EPIs devem ser cancelados
                                    baseado em regras de negócio (ex: EPIs vencidos, funcionários desligados, etc.)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Destino da Operação */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            Destino da Operação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <RadioGroup
                            value={state.destino}
                            onValueChange={(value) => updateState({ destino: value as any })}
                            className="space-y-3"
                        >
                            {/* Apenas Funcionários com Exposição a Riscos */}
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                                <RadioGroupItem
                                    value="funcionariosComRisco"
                                    id="funcionariosComRisco"
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <Label htmlFor="funcionariosComRisco" className="font-medium cursor-pointer">
                                        Apenas Funcionários com Exposição a Riscos
                                    </Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Cancelar EPIs apenas de funcionários que possuem exposição a riscos
                                        ocupacionais identificados
                                    </p>
                                </div>
                            </div>

                            {/* Apenas Funcionários (padrão) */}
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                                <RadioGroupItem
                                    value="funcionarios"
                                    id="funcionarios"
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <Label htmlFor="funcionarios" className="font-medium cursor-pointer">
                                        Apenas Funcionários
                                    </Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Cancelar EPIs de todos os funcionários da empresa (padrão recomendado)
                                    </p>
                                </div>
                            </div>

                            {/* Qualquer Pessoa */}
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                                <RadioGroupItem
                                    value="qualquerPessoa"
                                    id="qualquerPessoa"
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <Label htmlFor="qualquerPessoa" className="font-medium cursor-pointer">
                                        Qualquer Pessoa
                                    </Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Incluir terceiros, visitantes e outras pessoas com EPIs emprestados
                                    </p>
                                </div>
                            </div>

                            {/* Local de Trabalho */}
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                                <RadioGroupItem
                                    value="localTrabalho"
                                    id="localTrabalho"
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <Label htmlFor="localTrabalho" className="font-medium cursor-pointer">
                                        Local de Trabalho
                                    </Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Cancelar EPIs vinculados a locais específicos de trabalho
                                    </p>
                                </div>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Opção: Gerar relatório */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-600" />
                            Relatório
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                            <Checkbox
                                id="gerarRelatorio"
                                checked={state.gerarRelatorio}
                                onCheckedChange={(checked) => updateState({ gerarRelatorio: !!checked })}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <Label htmlFor="gerarRelatorio" className="font-medium cursor-pointer">
                                    Gerar relatório no final do processo
                                </Label>
                                <p className="text-sm text-gray-600 mt-1">
                                    Gerar relatório detalhado com todos os cancelamentos realizados,
                                    incluindo funcionários, EPIs e motivos
                                </p>
                            </div>
                        </div>

                        {/* Campo para nome do relatório quando selecionado */}
                        {state.gerarRelatorio && (
                            <div className="mt-4 ml-6 pl-4 border-l-2 border-green-200">
                                <Label htmlFor="nomeRelatorio" className="text-sm font-medium">
                                    Nome do Relatório
                                </Label>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        id="nomeRelatorio"
                                        type="text"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Digite o nome do relatório"
                                        defaultValue={`Relatório Cancelamento EPIs - ${new Date().toLocaleDateString('pt-BR')}`}
                                    />
                                    <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                        📁
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Resumo das Configurações */}
                {state.destino && (
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                            <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                                <CheckSquare className="h-4 w-4" />
                                Resumo das Configurações
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-green-700">Operação:</span>
                                    <span className="font-medium text-green-800 bg-orange-100 px-2 py-1 rounded text-xs">
                                        Cancelamento
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-700">Destino:</span>
                                    <span className="font-medium text-green-800">
                                        {FORM_CONFIG.destinations.find(d => d.value === state.destino)?.label}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-700">Sugestão Automática:</span>
                                    <span className="font-medium text-green-800">
                                        {state.aceitoSugestaoAcao ? 'Habilitada' : 'Desabilitada'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-700">Relatório:</span>
                                    <span className="font-medium text-green-800">
                                        {state.gerarRelatorio ? 'Será gerado' : 'Não será gerado'}
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