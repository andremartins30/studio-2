'use client';

import React, { useEffect } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoanAction } from '@/types/epi';

export default function ActionDefinition() {
    const { state, updateState, nextStep, prevStep } = useWizard();

    useEffect(() => {
        // Gerar ações para cada combinação funcionário-EPI
        const actions: LoanAction[] = [];
        state.selectedEmployees.forEach(employee => {
            state.selectedEpis.forEach(epi => {
                actions.push({
                    employeeId: employee.id,
                    epiId: epi.id,
                    quantidade: epi.quantidade,
                    dataEmprestimo: new Date().toISOString().split('T')[0],
                    dataDevolucao: state.dataDevolucao,
                    acao: state.acaoPadrao || 'fornecer'
                });
            });
        });

        if (state.loanActions.length === 0) {
            updateState({ loanActions: actions });
        }
    }, [state.selectedEmployees, state.selectedEpis, state.acaoPadrao, state.dataDevolucao, updateState]);

    const handleSetSelectedItems = () => {
        // Aplicar a ação padrão e data de devolução para todos os itens selecionados
        const updatedActions = state.loanActions.map(action => ({
            ...action,
            dataDevolucao: state.dataDevolucao,
            acao: state.acaoPadrao
        }));

        updateState({ loanActions: updatedActions });
    };

    const handleNext = () => {
        if (!state.confirmarValidacao) {
            alert('Por favor, confirme a validação das ações configuradas.');
            return;
        }
        nextStep();
    };

    const getEmployeeName = (employeeId: string) => {
        const employee = state.selectedEmployees.find(e => e.id === employeeId);
        return employee ? employee.nome : 'Funcionário não encontrado';
    };

    const getEpiName = (epiId: string) => {
        const epi = state.selectedEpis.find(e => e.id === epiId);
        return epi ? epi.nome : 'EPI não encontrado';
    };

    const getEpiCode = (epiId: string) => {
        const epi = state.selectedEpis.find(e => e.id === epiId);
        return epi ? epi.codigoEpi : '';
    };

    return (
        <div className="space-y-6">
            <div className="text-sm text-gray-600">
                Abaixo encontra-se a lista dos lotes selecionados anteriormente com sua respectiva situação.
                Defina qual ação deve ser tomada para cada lote.
            </div>

            {/* Configurações Gerais */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Data de Devolução:</Label>
                            <Input
                                type="date"
                                value={state.dataDevolucao || ''}
                                onChange={(e) => updateState({ dataDevolucao: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Ação:</Label>
                            <Select
                                value={state.acaoPadrao}
                                onValueChange={(value) => updateState({ acaoPadrao: value })}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecione uma ação" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fornecer">Fornecer</SelectItem>
                                    <SelectItem value="devolver">Devolver</SelectItem>
                                    <SelectItem value="substituir">Substituir</SelectItem>
                                    <SelectItem value="cancelar">Cancelar</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button onClick={handleSetSelectedItems} className="w-full">
                        Setar Itens selecionados
                    </Button>
                </CardContent>
            </Card>

            {/* Tabela de Ações */}
            <Card>
                <CardContent className="pt-6">
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Situação</TableHead>
                                    <TableHead>Cód. EPI</TableHead>
                                    <TableHead>Id. Lote</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Item de EPI</TableHead>
                                    <TableHead>Detalhe</TableHead>
                                    <TableHead>Data de Em...</TableHead>
                                    <TableHead>Ação</TableHead>
                                    <TableHead>Data de De...</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {state.selectedEmployees.map((employee) => (
                                    <React.Fragment key={employee.id}>
                                        <TableRow className="bg-gray-100">
                                            <TableCell colSpan={9} className="font-semibold">
                                                ▼ Nome: {employee.nome}
                                            </TableCell>
                                        </TableRow>
                                        {state.selectedEpis.map((epi) => {
                                            const action = state.loanActions.find(
                                                a => a.employeeId === employee.id && a.epiId === epi.id
                                            );
                                            return (
                                                <TableRow key={`${employee.id}-${epi.id}`}>
                                                    <TableCell>
                                                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                                                    </TableCell>
                                                    <TableCell>{epi.codigoEpi}</TableCell>
                                                    <TableCell>{epi.idLote}</TableCell>
                                                    <TableCell>{epi.nome}</TableCell>
                                                    <TableCell>Automático</TableCell>
                                                    <TableCell>OK</TableCell>
                                                    <TableCell>{action?.dataEmprestimo || new Date().toLocaleDateString('pt-BR')}</TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={action?.acao || 'fornecer'}
                                                            onValueChange={(value) => {
                                                                const updatedActions = state.loanActions.map(a =>
                                                                    a.employeeId === employee.id && a.epiId === epi.id
                                                                        ? { ...a, acao: value }
                                                                        : a
                                                                );
                                                                updateState({ loanActions: updatedActions });
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-32">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="fornecer">Fornecer</SelectItem>
                                                                <SelectItem value="devolver">Devolver</SelectItem>
                                                                <SelectItem value="substituir">Substituir</SelectItem>
                                                                <SelectItem value="cancelar">Cancelar</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="date"
                                                            value={action?.dataDevolucao || ''}
                                                            onChange={(e) => {
                                                                const updatedActions = state.loanActions.map(a =>
                                                                    a.employeeId === employee.id && a.epiId === epi.id
                                                                        ? { ...a, dataDevolucao: e.target.value }
                                                                        : a
                                                                );
                                                                updateState({ loanActions: updatedActions });
                                                            }}
                                                            className="w-36"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {state.loanActions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Nenhuma ação configurada ainda.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirmação */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="confirmarValidacao"
                            checked={state.confirmarValidacao}
                            onCheckedChange={(checked) => updateState({ confirmarValidacao: !!checked })}
                        />
                        <Label htmlFor="confirmarValidacao" className="text-sm">
                            Confirmo a realização da validação das ações configuradas.
                        </Label>
                    </div>
                </CardContent>
            </Card>

            {/* Resumo */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Resumo das Ações</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <strong>Funcionários:</strong> {state.selectedEmployees.length}
                        </div>
                        <div>
                            <strong>EPIs:</strong> {state.selectedEpis.length}
                        </div>
                        <div>
                            <strong>Total de Ações:</strong> {state.loanActions.length}
                        </div>
                        <div>
                            <strong>Tipo Operação:</strong> {state.tipoOperacao}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6 border-t">
                <Button variant="outline">
                    Opções
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={prevStep}>
                        ← Voltar
                    </Button>
                    <Button onClick={handleNext} disabled={!state.confirmarValidacao}>
                        Avançar →
                    </Button>
                </div>
            </div>
        </div>
    );
}
