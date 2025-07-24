'use client';

import React, { useEffect } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function ExecutionComplete() {
    const { state, updateState, resetWizard, currentFlow } = useWizard();

    useEffect(() => {
        // Simular processamento e gerar ID do empréstimo, devolução ou descarte
        if (currentFlow === 'fornecimento' && !state.loanId) {
            const loanId = Math.floor(Math.random() * 1000) + 1;
            const now = new Date();
            const processStarted = new Date(now.getTime() - 4000).toLocaleString('pt-BR');
            const processFinished = now.toLocaleString('pt-BR');

            updateState({
                loanId: loanId.toString(),
                processStarted,
                processFinished,
                success: true
            });
        } else if (currentFlow === 'devolucao' && !state.devolutionId) {
            const devolutionId = Math.floor(Math.random() * 1000) + 5000;
            const now = new Date();
            const processStarted = new Date(now.getTime() - 3000).toLocaleString('pt-BR');
            const processFinished = now.toLocaleString('pt-BR');

            updateState({
                devolutionId: devolutionId.toString(),
                processStarted,
                processFinished,
                success: true
            });
        } else if (currentFlow === 'descarte' && !state.descarteId) {
            const descarteId = Math.floor(Math.random() * 1000) + 8000;
            const now = new Date();
            const processStarted = new Date(now.getTime() - 2500).toLocaleString('pt-BR');
            const processFinished = now.toLocaleString('pt-BR');

            updateState({
                descarteId: descarteId.toString(),
                processStarted,
                processFinished,
                success: true
            });
        }
    }, [state.loanId, state.devolutionId, state.descarteId, updateState, currentFlow]);

    const handleGenerateReport = () => {
        // Aqui seria implementada a geração do relatório
        alert('Relatório gerado com sucesso!');
    };

    const handleClose = () => {
        resetWizard();
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return '';
        return dateString;
    };

    return (
        <div className="space-y-6">
            {/* Título */}
            <div className="text-xl font-semibold text-center">
                Execução concluída
            </div>

            {/* Status de Sucesso */}
            <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-green-700">
                        <CheckCircle className="h-8 w-8" />
                        <div>
                            <div className="font-semibold text-lg">
                                A execução do processo foi concluída com sucesso.
                            </div>
                            <div className="text-sm mt-2 grid grid-cols-3 gap-8">
                                <div>
                                    <strong>Solicitado em:</strong><br />
                                    {formatDateTime(state.processStarted)}
                                </div>
                                <div>
                                    <strong>Iniciado em:</strong><br />
                                    {formatDateTime(state.processStarted)}
                                </div>
                                <div>
                                    <strong>Finalizado em:</strong><br />
                                    {formatDateTime(state.processFinished)}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Botão para Gerar Relatório */}
            {state.gerarRelatorio && (
                <Card>
                    <CardContent className="pt-6 text-center">
                        <Button onClick={handleGenerateReport} size="lg">
                            Clique aqui para gerar o Relatório
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Informações do Empréstimo */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Informações do Processo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                            As operações realizadas no processo podem ser verificadas através dos registros gerados sendo eles:
                        </p>
                        <div className="mt-2 font-semibold">
                            {currentFlow === 'fornecimento' && `Id de Empréstimo: ${state.loanId}`}
                            {currentFlow === 'devolucao' && `Id de Devolução: ${state.devolutionId}`}
                            {currentFlow === 'descarte' && `Id de Descarte: ${state.descarteId}`}
                        </div>
                    </div>

                    {/* Resumo do Processo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div><strong>Tipo de Operação:</strong> {state.tipoOperacao}</div>
                            <div><strong>Destino:</strong> {state.destino}</div>
                            <div><strong>Funcionários Processados:</strong> {state.selectedEmployees.length}</div>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <strong>
                                    {currentFlow === 'fornecimento' && 'EPIs Fornecidos'}
                                    {currentFlow === 'devolucao' && 'EPIs Devolvidos'}
                                    {currentFlow === 'descarte' && 'EPIs Descartados'}:
                                </strong> {currentFlow === 'descarte' 
                                    ? (state.lotesPorFuncionario?.reduce((total, lote) => 
                                        total + lote.itens.filter(item => item.acao === 'descartar').length, 0) || 0)
                                    : state.selectedEpis.length}
                            </div>
                            <div><strong>Total de Ações:</strong> {state.loanActions.length}</div>
                            <div><strong>Status:</strong> <span className="text-green-600">Concluído</span></div>
                        </div>
                    </div>

                    {/* Detalhes dos Funcionários */}
                    <div>
                        <h4 className="font-semibold mb-2">Funcionários Processados:</h4>
                        <div className="space-y-1">
                            {state.selectedEmployees.map((employee) => (
                                <div key={employee.id} className="text-sm bg-blue-50 p-2 rounded">
                                    {employee.nome} - {employee.matricula}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detalhes dos EPIs */}
                    {currentFlow !== 'descarte' && (
                        <div>
                            <h4 className="font-semibold mb-2">
                                {currentFlow === 'fornecimento' ? 'EPIs Fornecidos' : 'EPIs Devolvidos'}:
                            </h4>
                            <div className="space-y-1">
                                {state.selectedEpis.map((epi) => (
                                    <div key={epi.id} className={`text-sm p-2 rounded ${currentFlow === 'fornecimento' ? 'bg-green-50' : 'bg-orange-50'}`}>
                                        {epi.nome} - {epi.codigoEpi} (Quantidade: {epi.quantidade})
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Detalhes dos EPIs Descartados */}
                    {currentFlow === 'descarte' && state.lotesPorFuncionario && (
                        <div>
                            <h4 className="font-semibold mb-2">EPIs Descartados:</h4>
                            <div className="space-y-2">
                                {state.lotesPorFuncionario.map((lote) => (
                                    <div key={lote.funcionario.id} className="bg-red-50 p-3 rounded">
                                        <div className="font-medium text-sm mb-2">
                                            {lote.funcionario.nome} - {lote.funcionario.matricula}
                                        </div>
                                        <div className="space-y-1">
                                            {lote.itens.filter(item => item.acao === 'descartar').map((item) => (
                                                <div key={item.id} className="text-xs bg-red-100 p-2 rounded">
                                                    {item.nome} - {item.codigoEpi} ({item.situacao})
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Motivo da Devolução */}
                    {currentFlow === 'devolucao' && state.motivoDevolucao && (
                        <div>
                            <h4 className="font-semibold mb-2">Motivo da Devolução:</h4>
                            <div className="text-sm bg-yellow-50 p-2 rounded">
                                {state.motivoDevolucao}
                            </div>
                        </div>
                    )}

                    {/* Motivo do Descarte */}
                    {currentFlow === 'descarte' && state.motivoDescarte && (
                        <div>
                            <h4 className="font-semibold mb-2">Motivo do Descarte:</h4>
                            <div className="text-sm bg-red-50 p-2 rounded">
                                {state.motivoDescarte}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Logs do Sistema */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Log do Processo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono space-y-1">
                        <div>[{formatDateTime(state.processStarted)}] Processo iniciado</div>
                        <div>[{formatDateTime(state.processStarted)}] Validando parâmetros de entrada</div>
                        <div>[{formatDateTime(state.processStarted)}] Selecionando funcionários: {state.selectedEmployees.length} funcionário(s)</div>
                        {currentFlow !== 'descarte' && <div>[{formatDateTime(state.processStarted)}] Selecionando EPIs: {state.selectedEpis.length} item(s)</div>}
                        {currentFlow === 'descarte' && state.lotesPorFuncionario && (
                            <div>[{formatDateTime(state.processStarted)}] EPIs para descarte: {state.lotesPorFuncionario.reduce((total, lote) => total + lote.itens.filter(item => item.acao === 'descartar').length, 0)} item(s)</div>
                        )}
                        <div>[{formatDateTime(state.processStarted)}] Configurando ações: {state.loanActions.length} ação(s)</div>
                        {currentFlow === 'fornecimento' && (
                            <>
                                <div>[{formatDateTime(state.processStarted)}] Processando empréstimos...</div>
                                <div>[{formatDateTime(state.processFinished)}] Empréstimo ID {state.loanId} gerado com sucesso</div>
                            </>
                        )}
                        {currentFlow === 'devolucao' && (
                            <>
                                <div>[{formatDateTime(state.processStarted)}] Processando devoluções...</div>
                                {state.motivoDevolucao && <div>[{formatDateTime(state.processStarted)}] Motivo registrado: {state.motivoDevolucao}</div>}
                                <div>[{formatDateTime(state.processFinished)}] Devolução ID {state.devolutionId} gerada com sucesso</div>
                            </>
                        )}
                        {currentFlow === 'descarte' && (
                            <>
                                <div>[{formatDateTime(state.processStarted)}] Processando descartes...</div>
                                {state.motivoDescarte && <div>[{formatDateTime(state.processStarted)}] Motivo registrado: {state.motivoDescarte}</div>}
                                {state.dataDescarte && <div>[{formatDateTime(state.processStarted)}] Data de descarte: {new Date(state.dataDescarte).toLocaleDateString('pt-BR')}</div>}
                                <div>[{formatDateTime(state.processFinished)}] Descarte ID {state.descarteId} gerado com sucesso</div>
                            </>
                        )}
                        <div>[{formatDateTime(state.processFinished)}] Processo concluído com sucesso</div>
                    </div>
                </CardContent>
            </Card>

            {/* Botão de Fechar */}
            <div className="flex justify-center pt-6 border-t">
                <Button onClick={handleClose} size="lg" className="px-8">
                    Fechar
                </Button>
            </div>
        </div>
    );
}
