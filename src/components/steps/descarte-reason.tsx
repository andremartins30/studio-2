'use client';

import React, { useState } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { useNotification } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, Package } from 'lucide-react';

export default function DescarteReason() {
    const { state, updateState, nextStep, prevStep } = useWizard();
    const { addNotification } = useNotification();
    const [motivo, setMotivo] = useState(state.motivoDescarte || '');

    const getItemsToDiscard = () => {
        if (!state.lotesPorFuncionario) return 0;
        return state.lotesPorFuncionario.reduce((total, lote) => 
            total + lote.itens.filter(item => item.acao === 'descartar').length, 0
        );
    };

    const getItemsByReason = () => {
        if (!state.lotesPorFuncionario) return { vencidos: 0, defeito: 0, outros: 0 };
        
        let vencidos = 0;
        let defeito = 0;
        let outros = 0;

        state.lotesPorFuncionario.forEach(lote => {
            lote.itens.forEach(item => {
                if (item.acao === 'descartar') {
                    switch (item.situacao) {
                        case 'vencido':
                            vencidos++;
                            break;
                        case 'com_defeito':
                            defeito++;
                            break;
                        default:
                            outros++;
                            break;
                    }
                }
            });
        });

        return { vencidos, defeito, outros };
    };

    const handleMotivoChange = (value: string) => {
        setMotivo(value);
        updateState({ motivoDescarte: value });
    };

    const handleNext = () => {
        if (!motivo.trim()) {
            addNotification({
                type: 'error',
                title: 'Motivo Obrigatório',
                message: 'Informe o motivo do descarte para continuar',
            });
            return;
        }

        if (motivo.trim().length < 10) {
            addNotification({
                type: 'error',
                title: 'Motivo Muito Curto',
                message: 'O motivo deve ter pelo menos 10 caracteres',
            });
            return;
        }

        addNotification({
            type: 'success',
            title: 'Motivo Registrado',
            message: 'Motivo do descarte foi registrado com sucesso',
        });
        nextStep();
    };

    const itemsStats = getItemsByReason();
    const totalItems = getItemsToDiscard();

    // Sugestões de motivos baseadas nos tipos de situação
    const getSuggestedReasons = () => {
        const suggestions = [];
        
        if (itemsStats.vencidos > 0) {
            suggestions.push(`${itemsStats.vencidos} EPI(s) vencido(s) conforme data de validade.`);
        }
        
        if (itemsStats.defeito > 0) {
            suggestions.push(`${itemsStats.defeito} EPI(s) com defeito identificado durante inspeção.`);
        }
        
        if (itemsStats.outros > 0) {
            suggestions.push(`${itemsStats.outros} EPI(s) em situação inadequada para uso.`);
        }
        
        return suggestions.join(' ');
    };

    const suggestedReason = getSuggestedReasons();

    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {/* Resumo do Descarte */}
            <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-medium text-orange-800">Resumo do Descarte</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div className="text-sm">
                                    <div className="font-medium text-orange-700">Total de EPIs</div>
                                    <div className="text-2xl font-bold text-orange-800">{totalItems}</div>
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium text-orange-700">Funcionários</div>
                                    <div className="text-2xl font-bold text-orange-800">{state.selectedEmployees.length}</div>
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium text-orange-700">Data do Descarte</div>
                                    <div className="text-lg font-semibold text-orange-800">
                                        {state.dataDescarte ? new Date(state.dataDescarte).toLocaleDateString('pt-BR') : '-'}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Estatísticas por tipo */}
                            <div className="flex gap-2 mt-3">
                                {itemsStats.vencidos > 0 && (
                                    <Badge variant="destructive">
                                        {itemsStats.vencidos} Vencido(s)
                                    </Badge>
                                )}
                                {itemsStats.defeito > 0 && (
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                        {itemsStats.defeito} Com Defeito
                                    </Badge>
                                )}
                                {itemsStats.outros > 0 && (
                                    <Badge variant="outline">
                                        {itemsStats.outros} Outro(s)
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Formulário de Motivo */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Motivo do Descarte
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Alerta sobre obrigatoriedade */}
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-yellow-800">Informação Obrigatória</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                O motivo do descarte é obrigatório e será registrado para auditoria e controle.
                                Seja específico sobre o estado dos EPIs e a razão do descarte.
                            </p>
                        </div>
                    </div>

                    {/* Sugestão automática */}
                    {suggestedReason && (
                        <div className="space-y-2">
                            <Label>Sugestão baseada nos EPIs selecionados:</Label>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-sm text-gray-700">{suggestedReason}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => handleMotivoChange(suggestedReason)}
                                >
                                    Usar esta sugestão
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Campo de texto */}
                    <div className="space-y-2">
                        <Label htmlFor="motivoDescarte">
                            Motivo do Descarte *
                        </Label>
                        <Textarea
                            id="motivoDescarte"
                            placeholder="Informe o motivo do descarte (EPI com defeito, vencido, etc.)"
                            value={motivo}
                            onChange={(e) => handleMotivoChange(e.target.value)}
                            className="min-h-[120px] resize-none"
                            maxLength={500}
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>
                                {motivo.length < 10 
                                    ? `Mínimo 10 caracteres (faltam ${10 - motivo.length})`
                                    : 'Motivo válido'
                                }
                            </span>
                            <span>{motivo.length}/500 caracteres</span>
                        </div>
                    </div>

                    {/* Exemplos de motivos */}
                    <div className="space-y-2">
                        <Label>Exemplos de motivos válidos:</Label>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>• "EPIs vencidos conforme data de validade impressa no produto"</div>
                            <div>• "Capacetes com trincas identificadas durante inspeção visual"</div>
                            <div>• "Luvas com furos e desgaste excessivo após uso prolongado"</div>
                            <div>• "EPIs danificados em acidente de trabalho reportado em [data]"</div>
                            <div>• "Substituição por modelos mais seguros conforme nova norma técnica"</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <Card>
                <CardContent className="p-4">
                    <div className="text-sm text-gray-600">
                        <p className="font-medium mb-2">Informações importantes:</p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>O descarte será processado na data informada: <strong>{state.dataDescarte ? new Date(state.dataDescarte).toLocaleDateString('pt-BR') : 'Não informada'}</strong></li>
                            <li>Esta ação é irreversível e será registrada no histórico do funcionário</li>
                            <li>Um relatório de descarte será gerado automaticamente</li>
                            <li>Os responsáveis serão notificados sobre o descarte realizado</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={prevStep}>
                    Voltar
                </Button>
                <Button 
                    onClick={handleNext}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={!motivo.trim() || motivo.trim().length < 10}
                >
                    Finalizar Descarte
                </Button>
            </div>
        </div>
    );
}
