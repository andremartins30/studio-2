'use client';

import React, { useState } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { useNotification } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmprestadoEpiItem } from '@/types/epi';

// Mock data - EPIs emprestados pelos funcionários selecionados
const mockLoanedEpis: EmprestadoEpiItem[] = [
    {
        id: '1',
        codigoEpi: 'EPI001',
        idLote: 'LT001',
        nome: 'Capacete de Segurança',
        itemEpi: 'Capacete',
        detalhe: 'Cor: Branco, Tamanho: M',
        dataEmprestimo: '2024-01-15',
        situacao: 'emprestado',
        employeeId: '1',
        acao: 'devolver'
    },
    {
        id: '2',
        codigoEpi: 'EPI002',
        idLote: 'LT002',
        nome: 'Luvas de Proteção',
        itemEpi: 'Luvas',
        detalhe: 'Material: Látex, Tamanho: G',
        dataEmprestimo: '2024-01-15',
        situacao: 'emprestado',
        employeeId: '1',
        acao: 'devolver'
    },
    {
        id: '3',
        codigoEpi: 'EPI003',
        idLote: 'LT003',
        nome: 'Óculos de Segurança',
        itemEpi: 'Óculos',
        detalhe: 'Lente: Incolor, Anti-embaçante',
        dataEmprestimo: '2024-01-20',
        situacao: 'vencido',
        employeeId: '2',
        acao: 'devolver'
    }
];

export default function DevolutionActionDefinition() {
    const { state, updateState, nextStep, prevStep } = useWizard();
    const { addNotification } = useNotification();
    const [dataDevolucao, setDataDevolucao] = useState(new Date().toISOString().split('T')[0]);
    const [loanedEpis, setLoanedEpis] = useState<EmprestadoEpiItem[]>(mockLoanedEpis);

    const handleAcaoChange = (epiId: string, novaAcao: 'devolver' | 'naoDevolver') => {
        setLoanedEpis(prev =>
            prev.map(epi =>
                epi.id === epiId ? { ...epi, acao: novaAcao } : epi
            )
        );
    };

    const handleSetSelectedItems = () => {
        const selectedEpis = loanedEpis.filter(epi => epi.acao === 'devolver');
        const actions = selectedEpis.map(epi => ({
            employeeId: epi.employeeId,
            epiId: epi.id,
            quantidade: 1,
            dataEmprestimo: epi.dataEmprestimo,
            dataDevolucao: dataDevolucao,
            acao: 'devolver'
        }));

        updateState({
            loanActions: actions,
            dataDevolucao: dataDevolucao
        });

        addNotification({
            type: 'success',
            title: 'Itens Configurados',
            message: `${selectedEpis.length} item(ns) configurado(s) para devolução.`,
        });
    };

    const handleNext = () => {
        if (!state.confirmarValidacao) {
            addNotification({
                type: 'error',
                title: 'Validação Obrigatória',
                message: 'É obrigatório confirmar a validação das ações configuradas.',
            });
            return;
        }

        if (state.loanActions.length === 0) {
            addNotification({
                type: 'error',
                title: 'Configuração Obrigatória',
                message: 'Configure pelo menos um item para devolução.',
            });
            return;
        }

        nextStep();
    };

    const getSituacaoBadge = (situacao: string) => {
        switch (situacao) {
            case 'emprestado':
                return <Badge variant="default" className="bg-blue-100 text-blue-800">Emprestado</Badge>;
            case 'vencido':
                return <Badge variant="destructive">Vencido</Badge>;
            case 'danificado':
                return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Danificado</Badge>;
            default:
                return <Badge variant="outline">{situacao}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600">
                Configure as ações de devolução para os EPIs emprestados aos funcionários selecionados
            </div>

            {/* Configurações Gerais */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Configurações da Devolução</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dataDevolucao" className="text-sm font-medium">
                                Data de Devolução
                            </Label>
                            <Input
                                id="dataDevolucao"
                                type="date"
                                value={dataDevolucao}
                                onChange={(e) => setDataDevolucao(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                onClick={handleSetSelectedItems}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Setar itens selecionados
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de EPIs Emprestados */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">EPIs Emprestados</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="border rounded-lg max-h-80 overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white">
                                <TableRow className="bg-gray-50">
                                    <TableHead>Situação</TableHead>
                                    <TableHead>Cód. EPI</TableHead>
                                    <TableHead>Id. Lote</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Item de EPI</TableHead>
                                    <TableHead>Detalhe</TableHead>
                                    <TableHead>Data Empréstimo</TableHead>
                                    <TableHead>Ação</TableHead>
                                    <TableHead>Data Devolução</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loanedEpis.map((epi) => (
                                    <TableRow key={epi.id} className="text-sm">
                                        <TableCell>{getSituacaoBadge(epi.situacao)}</TableCell>
                                        <TableCell className="font-medium">{epi.codigoEpi}</TableCell>
                                        <TableCell>{epi.idLote}</TableCell>
                                        <TableCell>{epi.nome}</TableCell>
                                        <TableCell>{epi.itemEpi}</TableCell>
                                        <TableCell>{epi.detalhe}</TableCell>
                                        <TableCell>{new Date(epi.dataEmprestimo).toLocaleDateString('pt-BR')}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={epi.acao}
                                                onValueChange={(value: 'devolver' | 'naoDevolver') =>
                                                    handleAcaoChange(epi.id, value)
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="devolver">Devolver</SelectItem>
                                                    <SelectItem value="naoDevolver">Não Devolver</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            {epi.acao === 'devolver' ? new Date(dataDevolucao).toLocaleDateString('pt-BR') : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Confirmação Obrigatória */}
            <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="confirmarValidacao"
                            checked={state.confirmarValidacao}
                            onCheckedChange={(checked) => updateState({ confirmarValidacao: !!checked })}
                            className="mt-1"
                        />
                        <div>
                            <Label htmlFor="confirmarValidacao" className="text-sm font-medium text-yellow-800">
                                Confirmo a realização da validação das ações configuradas
                            </Label>
                            <p className="text-xs text-yellow-700 mt-1">
                                Este campo é obrigatório para prosseguir com a devolução dos EPIs.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Resumo das Configurações */}
            {state.loanActions.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Resumo das Configurações</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <strong>Itens para Devolução:</strong><br />
                                {state.loanActions.length} item(ns)
                            </div>
                            <div>
                                <strong>Data de Devolução:</strong><br />
                                {new Date(dataDevolucao).toLocaleDateString('pt-BR')}
                            </div>
                            <div>
                                <strong>Funcionários:</strong><br />
                                {state.selectedEmployees.length} pessoa(s)
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
                        Avançar →
                    </Button>
                </div>
            </div>
        </div>
    );
}
