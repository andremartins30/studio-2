'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { useNotification } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronRight, Calendar, AlertTriangle, Package } from 'lucide-react';
import { DescarteEpiItem, LoteFuncionario } from '@/types/epi';

// Mock data - EPIs por funcionário para descarte
const mockEpisByEmployee = {
    '1': [
        {
            id: 'epi_1_1',
            situacao: 'vencido' as const,
            codigoEpi: 'EPI001',
            idLote: 12345,
            nome: 'Capacete de Segurança',
            itemEpi: 'Capacete Classe A',
            detalhe: 'Cor branca, ajuste simples',
            dataEntrega: '2023-01-15',
            acao: 'descartar' as const,
            employeeId: '1'
        },
        {
            id: 'epi_1_2',
            situacao: 'com_defeito' as const,
            codigoEpi: 'EPI002',
            idLote: 12346,
            nome: 'Luvas de Segurança',
            itemEpi: 'Luvas Nitrílicas',
            detalhe: 'Tamanho M, antiderrapante',
            dataEntrega: '2023-02-20',
            acao: 'descartar' as const,
            employeeId: '1'
        }
    ],
    '2': [
        {
            id: 'epi_2_1',
            situacao: 'vencido' as const,
            codigoEpi: 'EPI003',
            idLote: 12347,
            nome: 'Óculos de Proteção',
            itemEpi: 'Óculos Antirrisco',
            detalhe: 'Lente incolor, hastes ajustáveis',
            dataEntrega: '2023-03-10',
            acao: 'descartar' as const,
            employeeId: '2'
        }
    ],
    '3': [
        {
            id: 'epi_3_1',
            situacao: 'com_defeito' as const,
            codigoEpi: 'EPI004',
            idLote: 12348,
            nome: 'Botina de Segurança',
            itemEpi: 'Botina Bico de Aço',
            detalhe: 'Solado antiderrapante, cano baixo',
            dataEntrega: '2023-01-25',
            acao: 'descartar' as const,
            employeeId: '3'
        },
        {
            id: 'epi_3_2',
            situacao: 'vencido' as const,
            codigoEpi: 'EPI005',
            idLote: 12349,
            nome: 'Protetor Auricular',
            itemEpi: 'Plugs de Espuma',
            detalhe: 'Descartável, NRR 29dB',
            dataEntrega: '2023-04-05',
            acao: 'nao_descartar' as const,
            employeeId: '3'
        }
    ]
};

export default function DescarteActionDefinition() {
    const { state, updateState, nextStep, prevStep } = useWizard();
    const { addNotification } = useNotification();
    const [dataDescarte, setDataDescarte] = useState(state.dataDescarte || '');
    const [lotesState, setLotesState] = useState<LoteFuncionario[]>([]);

    useEffect(() => {
        // Inicializar lotes com dados mockados para os funcionários selecionados
        const initialLotes: LoteFuncionario[] = state.selectedEmployees.map(funcionario => {
            const itensEpi = mockEpisByEmployee[funcionario.id as keyof typeof mockEpisByEmployee] || [];
            return {
                funcionario,
                itens: itensEpi,
                expandido: false
            };
        });
        
        setLotesState(initialLotes);
        updateState({ lotesPorFuncionario: initialLotes });
    }, [state.selectedEmployees, updateState]);

    const toggleExpansion = (funcionarioId: string) => {
        setLotesState(prev => prev.map(lote => 
            lote.funcionario.id === funcionarioId 
                ? { ...lote, expandido: !lote.expandido }
                : lote
        ));
    };

    const updateItemAction = (funcionarioId: string, itemId: string, acao: 'descartar' | 'nao_descartar') => {
        const newLotes = lotesState.map(lote => {
            if (lote.funcionario.id === funcionarioId) {
                return {
                    ...lote,
                    itens: lote.itens.map(item =>
                        item.id === itemId ? { ...item, acao } : item
                    )
                };
            }
            return lote;
        });
        
        setLotesState(newLotes);
        updateState({ lotesPorFuncionario: newLotes });
    };

    const setAllItemsAction = () => {
        if (!dataDescarte) {
            addNotification({
                type: 'error',
                title: 'Data Obrigatória',
                message: 'Informe a data de descarte antes de definir as ações',
            });
            return;
        }

        const newLotes = lotesState.map(lote => ({
            ...lote,
            itens: lote.itens.map(item => ({
                ...item,
                acao: 'descartar' as const,
                dataDescarte: dataDescarte
            }))
        }));

        setLotesState(newLotes);
        updateState({ 
            lotesPorFuncionario: newLotes,
            dataDescarte 
        });

        addNotification({
            type: 'success',
            title: 'Ações Definidas',
            message: 'Todos os itens foram configurados para descarte',
        });
    };

    const getTotalItems = () => {
        return lotesState.reduce((total, lote) => total + lote.itens.length, 0);
    };

    const getItemsToDiscard = () => {
        return lotesState.reduce((total, lote) => 
            total + lote.itens.filter(item => item.acao === 'descartar').length, 0
        );
    };

    const getSituationBadge = (situacao: DescarteEpiItem['situacao']) => {
        switch (situacao) {
            case 'vencido':
                return <Badge variant="destructive">Vencido</Badge>;
            case 'com_defeito':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Com Defeito</Badge>;
            case 'ok':
                return <Badge variant="default">OK</Badge>;
            default:
                return <Badge variant="outline">-</Badge>;
        }
    };

    const handleNext = () => {
        if (!dataDescarte) {
            addNotification({
                type: 'error',
                title: 'Data Obrigatória',
                message: 'Informe a data de descarte para continuar',
            });
            return;
        }

        const itemsToDiscard = getItemsToDiscard();
        if (itemsToDiscard === 0) {
            addNotification({
                type: 'error',
                title: 'Nenhum Item Selecionado',
                message: 'Selecione pelo menos um item para descarte',
            });
            return;
        }

        updateState({ dataDescarte });
        addNotification({
            type: 'success',
            title: 'Ações Configuradas',
            message: `${itemsToDiscard} item(s) configurado(s) para descarte`,
        });
        nextStep();
    };

    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {/* Configuração da Data de Descarte */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Configurações do Descarte
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="dataDescarte">Data de Descarte *</Label>
                            <Input
                                id="dataDescarte"
                                type="date"
                                value={dataDescarte}
                                onChange={(e) => setDataDescarte(e.target.value)}
                                className="mt-1"
                                required
                            />
                        </div>
                        <div>
                            <Label>Ação</Label>
                            <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm">
                                Descartar
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button 
                                onClick={setAllItemsAction}
                                className="w-full bg-orange-600 hover:bg-orange-700"
                                disabled={!dataDescarte}
                            >
                                Setar itens selecionados
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Alerta de Resumo */}
            <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-orange-800">Resumo do Descarte</h4>
                            <p className="text-sm text-orange-700 mt-1">
                                Total de EPIs: {getTotalItems()} | Para descarte: {getItemsToDiscard()} | 
                                Funcionários: {state.selectedEmployees.length}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Funcionários e EPIs */}
            <div className="space-y-3">
                {lotesState.map((lote) => (
                    <Card key={lote.funcionario.id}>
                        <CardHeader 
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleExpansion(lote.funcionario.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {lote.expandido ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                    <div>
                                        <CardTitle className="text-base">
                                            {lote.funcionario.nome}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Matrícula: {lote.funcionario.matricula} | 
                                            Função: {lote.funcionario.codigoFuncao} | 
                                            Seção: {lote.funcionario.codigoSecao}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                        {lote.itens.length} EPI(s)
                                    </Badge>
                                    <Badge variant="destructive">
                                        {lote.itens.filter(item => item.acao === 'descartar').length} p/ descarte
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        {lote.expandido && (
                            <CardContent className="pt-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Situação</TableHead>
                                            <TableHead>Cód. EPI</TableHead>
                                            <TableHead>Id. Lote</TableHead>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Item de EPI</TableHead>
                                            <TableHead>Detalhe</TableHead>
                                            <TableHead>Data Entrega</TableHead>
                                            <TableHead>Ação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lote.itens.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    {getSituationBadge(item.situacao)}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {item.codigoEpi}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {item.idLote}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.nome}
                                                </TableCell>
                                                <TableCell>{item.itemEpi}</TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {item.detalhe}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(item.dataEntrega).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={item.acao}
                                                        onValueChange={(value) => 
                                                            updateItemAction(
                                                                lote.funcionario.id, 
                                                                item.id, 
                                                                value as 'descartar' | 'nao_descartar'
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="descartar">Descartar</SelectItem>
                                                            <SelectItem value="nao_descartar">Não Descartar</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={prevStep}>
                    Voltar
                </Button>
                <Button 
                    onClick={handleNext}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                    Avançar
                </Button>
            </div>
        </div>
    );
}
