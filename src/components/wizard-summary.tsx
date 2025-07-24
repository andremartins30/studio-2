'use client';

import React from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function WizardSummary() {
    const { state, currentStep, currentFlow } = useWizard();

    if (currentStep < 4) return null;

    return (
        <Card className="mb-4">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    📊 Resumo da Operação
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="space-y-1">
                        <h4 className="font-semibold text-gray-700 text-sm">Operação</h4>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-xs">Tipo:</span>
                                <Badge variant="outline" className="text-xs h-5">{state.tipoOperacao}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-xs">Destino:</span>
                                <Badge variant="outline" className="text-xs h-5">{state.destino}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-xs">Relatório:</span>
                                <Badge variant={state.gerarRelatorio ? 'default' : 'secondary'} className="text-xs h-5">
                                    {state.gerarRelatorio ? 'Sim' : 'Não'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h4 className="font-semibold text-gray-700 text-sm">Seleções</h4>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-xs">Funcionários:</span>
                                <Badge variant="outline" className="text-xs h-5">{state.selectedEmployees.length}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-xs">EPIs:</span>
                                <Badge variant="outline" className="text-xs h-5">
                                    {currentFlow === 'descarte' && state.lotesPorFuncionario 
                                        ? state.lotesPorFuncionario.reduce((total, lote) => 
                                            total + lote.itens.filter(item => item.acao === 'descartar').length, 0)
                                        : state.selectedEpis.length}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-xs">Ações:</span>
                                <Badge variant="outline" className="text-xs h-5">{state.loanActions.length}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h4 className="font-semibold text-gray-700 text-sm">Status</h4>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-xs">Etapa:</span>
                                <Badge variant="default" className="text-xs h-5">{currentStep} de 5</Badge>
                            </div>
                            {state.confirmarValidacao && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 text-xs">Validado:</span>
                                    <Badge variant="default" className="text-xs h-5">✓ Sim</Badge>
                                </div>
                            )}
                            {state.loanId && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 text-xs">ID Empréstimo:</span>
                                    <Badge variant="default" className="text-xs h-5">{state.loanId}</Badge>
                                </div>
                            )}
                            {state.devolutionId && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 text-xs">ID Devolução:</span>
                                    <Badge variant="default" className="text-xs h-5">{state.devolutionId}</Badge>
                                </div>
                            )}
                            {state.descarteId && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 text-xs">ID Descarte:</span>
                                    <Badge variant="default" className="text-xs h-5">{state.descarteId}</Badge>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lista detalhada quando há dados - mais compacta */}
                {state.selectedEmployees.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                        <h5 className="font-medium text-gray-700 mb-1 text-xs">Funcionários:</h5>
                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                            {state.selectedEmployees.map((employee) => (
                                <Badge key={employee.id} variant="secondary" className="text-xs h-5">
                                    {employee.nome} ({employee.matricula})
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {state.selectedEpis.length > 0 && currentFlow !== 'descarte' && (
                    <div className="mt-3 pt-3 border-t">
                        <h5 className="font-medium text-gray-700 mb-1 text-xs">EPIs:</h5>
                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                            {state.selectedEpis.map((epi) => (
                                <Badge key={epi.id} variant="secondary" className="text-xs h-5">
                                    {epi.nome} ({epi.codigoEpi}) - Qty: {epi.quantidade}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {currentFlow === 'descarte' && state.lotesPorFuncionario && (
                    <div className="mt-3 pt-3 border-t">
                        <h5 className="font-medium text-gray-700 mb-1 text-xs">EPIs para Descarte:</h5>
                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                            {state.lotesPorFuncionario.map((lote) => 
                                lote.itens.filter(item => item.acao === 'descartar').map((item) => (
                                    <Badge key={item.id} variant="destructive" className="text-xs h-5">
                                        {item.nome} ({item.codigoEpi}) - {item.situacao}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
