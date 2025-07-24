'use client';

import React from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { useNotification } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DevolutionReason() {
    const { state, updateState, nextStep, prevStep } = useWizard();
    const { addNotification } = useNotification();

    const handleNext = () => {
        if (!state.motivoDevolucao || state.motivoDevolucao.trim() === '') {
            addNotification({
                type: 'error',
                title: 'Campo Obrigatório',
                message: 'Por favor, informe o motivo da devolução.',
            });
            return;
        }

        addNotification({
            type: 'success',
            title: 'Motivo Registrado',
            message: 'Motivo da devolução registrado com sucesso.',
        });

        // Generate devolution ID
        const devolutionId = `DEV-${Date.now().toString().slice(-6)}`;
        updateState({
            devolutionId,
            processFinished: new Date().toISOString(),
            success: true
        });

        nextStep();
    };

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600">
                Informe abaixo, se achar necessário, o motivo da devolução
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Motivo da Devolução</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="space-y-3">
                        <Label htmlFor="motivoDevolucao" className="text-sm font-medium">
                            Motivo da Devolução:
                        </Label>
                        <Textarea
                            id="motivoDevolucao"
                            value={state.motivoDevolucao || 'EPI com defeito'}
                            onChange={(e) => updateState({ motivoDevolucao: e.target.value })}
                            placeholder="Descreva o motivo da devolução..."
                            className="min-h-[120px] resize-none"
                            required
                        />
                        <div className="text-xs text-gray-500">
                            Este campo é obrigatório. Descreva brevemente o motivo da devolução dos EPIs.
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Resumo dos EPIs para Devolução */}
            {state.selectedEmployees.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Resumo da Devolução</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-2">
                            <div className="text-sm">
                                <strong>Funcionários:</strong> {state.selectedEmployees.length}
                            </div>
                            <div className="text-sm">
                                <strong>Data de Devolução:</strong> {state.dataDevolucao || new Date().toLocaleDateString('pt-BR')}
                            </div>
                            <div className="text-sm">
                                <strong>Ações Configuradas:</strong> {state.loanActions.length}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" size="sm">
                    Opções
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={prevStep} size="sm">
                        ← Voltar
                    </Button>
                    <Button onClick={handleNext} size="sm">
                        Finalizar Devolução →
                    </Button>
                </div>
            </div>
        </div>
    );
}
