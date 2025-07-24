'use client';

import React from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { useNotification } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ParameterSelection() {
    const { state, updateState, nextStep, resetWizard } = useWizard();
    const { addNotification } = useNotification();

    const handleNext = () => {
        addNotification({
            type: 'success',
            title: 'Parâmetros Configurados',
            message: `Tipo de operação: ${state.tipoOperacao}, Destino: ${state.destino}`,
        });
        nextStep();
    };

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600">
                Defina abaixo o tipo de ação, a quem se destina e a ação a ser tomada em caso de Fornecimento
            </div>

            {/* Tipo de Operação */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Tipo</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <RadioGroup
                        value={state.tipoOperacao}
                        onValueChange={(value) => updateState({ tipoOperacao: value as any })}
                        className="flex flex-wrap gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fornecimento" id="fornecimento" />
                            <Label htmlFor="fornecimento" className="text-sm">Fornecimento</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="devolucao" id="devolucao" />
                            <Label htmlFor="devolucao" className="text-sm">Devolução</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="descarte" id="descarte" />
                            <Label htmlFor="descarte" className="text-sm">Descarte</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cancelamento" id="cancelamento" />
                            <Label htmlFor="cancelamento" className="text-sm">Cancelamento</Label>
                        </div>
                    </RadioGroup>

                    {/* Checkbox condicional para devolução */}
                    {state.tipoOperacao === 'devolucao' && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="aceitoSugestaoAcao"
                                    checked={state.aceitoSugestaoAcao || false}
                                    onCheckedChange={(checked) => updateState({ aceitoSugestaoAcao: !!checked })}
                                />
                                <Label htmlFor="aceitoSugestaoAcao" className="text-sm font-medium">
                                    Aceito sugestão na ação
                                </Label>
                            </div>
                            <p className="text-xs text-blue-600 mt-1 ml-6">
                                Permite que o sistema sugira automaticamente as melhores ações para devolução.
                            </p>
                        </div>
                    )}

                    {/* Checkbox condicional para descarte */}
                    {state.tipoOperacao === 'descarte' && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="aceitoSugestaoDescarte"
                                    checked={state.aceitoSugestaoDescarte || false}
                                    onCheckedChange={(checked) => updateState({ aceitoSugestaoDescarte: !!checked })}
                                />
                                <Label htmlFor="aceitoSugestaoDescarte" className="text-sm font-medium">
                                    Aceito sugestão na ação
                                </Label>
                            </div>
                            <p className="text-xs text-orange-600 mt-1 ml-6">
                                Permite que o sistema sugira automaticamente quais EPIs devem ser descartados.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Destino */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Destino</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                    <RadioGroup
                        value={state.destino}
                        onValueChange={(value) => updateState({ destino: value as any })}
                        className="space-y-2"
                    >
                        <div className="flex items-start space-x-2">
                            <RadioGroupItem value="funcionarios" id="funcionarios" className="mt-1" />
                            <div>
                                <Label htmlFor="funcionarios" className="font-medium text-sm">
                                    Funcionários com Exposição a Riscos
                                </Label>
                                <p className="text-xs text-gray-600 mt-1">
                                    Apenas EPIs com ligação ao funcionário através de avaliação de risco.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="qualquerPessoa" id="qualquerPessoa" />
                            <Label htmlFor="qualquerPessoa" className="text-sm">Qualquer Pessoa</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="localTrabalho" id="localTrabalho" />
                            <Label htmlFor="localTrabalho" className="text-sm">Local de Trabalho</Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Gerar Relatório */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="gerarRelatorio"
                            checked={state.gerarRelatorio}
                            onCheckedChange={(checked) => updateState({ gerarRelatorio: !!checked })}
                        />
                        <Label htmlFor="gerarRelatorio" className="text-sm">
                            Gerar Relatório no final do processo
                        </Label>
                    </div>
                    {state.gerarRelatorio && (
                        <div className="mt-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm h-8"
                                    placeholder="Nome do relatório"
                                />
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    📁
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={resetWizard} size="sm">
                    Cancelar
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" disabled size="sm">
                        ← Voltar
                    </Button>
                    <Button onClick={handleNext} size="sm">
                        Avançar →
                    </Button>
                </div>
            </div>
        </div>
    );
}
