'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EpiItem } from '@/types/epi';
import { EpiService } from '@/services/epi-service';
import { useNotification } from '@/contexts/notification-context';

export default function BatchSelection() {
    const { state, updateState, nextStep, prevStep } = useWizard();
    const { addNotification } = useNotification();
    const [filteredEpis, setFilteredEpis] = useState<EpiItem[]>([]);
    const [allEpis, setAllEpis] = useState<EpiItem[]>([]);
    const [searchCodigoFiscal, setSearchCodigoFiscal] = useState(state.codigoFiscal);
    const [searchGrupoEpi, setSearchGrupoEpi] = useState(state.codigoGrupoEpi);
    const [loading, setLoading] = useState(true);

    // Carregar catálogo EPI da API
    useEffect(() => {
        const carregarCatalogoEpi = async () => {
            try {
                setLoading(true);
                console.log('🛡️ Carregando catálogo EPI da API SOAP...');

                const catalogoEpi = await EpiService.buscarCatalogoEpi();
                setAllEpis(catalogoEpi);
                setFilteredEpis(catalogoEpi);

                console.log(`✅ ${catalogoEpi.length} itens EPI carregados com sucesso`);

                if (catalogoEpi.length === 0) {
                    addNotification({
                        type: 'warning',
                        title: 'Atenção',
                        message: 'Nenhum item EPI encontrado na base de dados.',
                    });
                }
            } catch (error) {
                console.error('❌ Erro ao carregar catálogo EPI:', error);
                addNotification({
                    type: 'error',
                    title: 'Erro ao Carregar Catálogo EPI',
                    message: 'Erro de conexão com o servidor. Usando dados de fallback.',
                });
            } finally {
                setLoading(false);
            }
        };

        carregarCatalogoEpi();
    }, [addNotification]);

    // Filtrar EPIs baseado nos critérios
    useEffect(() => {
        let filtered = allEpis;

        if (searchCodigoFiscal) {
            filtered = filtered.filter(epi =>
                epi.codigoEpi.toLowerCase().includes(searchCodigoFiscal.toLowerCase())
            );
        }

        if (searchGrupoEpi) {
            filtered = filtered.filter(epi =>
                epi.nome.toLowerCase().includes(searchGrupoEpi.toLowerCase()) ||
                epi.codigoSecao.toLowerCase().includes(searchGrupoEpi.toLowerCase())
            );
        }

        setFilteredEpis(filtered);
    }, [searchCodigoFiscal, searchGrupoEpi, allEpis]);

    const handleEpiToggle = (epi: EpiItem, checked: boolean) => {
        if (checked) {
            updateState({
                selectedEpis: [...state.selectedEpis, epi]
            });
        } else {
            updateState({
                selectedEpis: state.selectedEpis.filter(e => e.id !== epi.id)
            });
        }
    };

    const isEpiSelected = (epiId: string) => {
        return state.selectedEpis.some(e => e.id === epiId);
    };

    const updateQuantidade = (epiId: string, quantidade: number) => {
        const updatedEpis = state.selectedEpis.map(epi =>
            epi.id === epiId ? { ...epi, quantidade } : epi
        );
        updateState({ selectedEpis: updatedEpis });
    };

    const handleNext = () => {
        if (state.selectedEpis.length === 0) {
            addNotification({
                type: 'error',
                title: 'Seleção Obrigatória',
                message: 'Selecione pelo menos um item EPI para continuar.',
            });
            return;
        }

        // Atualizar estado com os valores dos campos de busca
        updateState({
            codigoFiscal: searchCodigoFiscal,
            codigoGrupoEpi: searchGrupoEpi,
        });

        addNotification({
            type: 'success',
            title: 'EPIs Selecionados',
            message: `${state.selectedEpis.length} item(s) EPI selecionado(s)`,
        });

        nextStep();
    };

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600">
                Selecione os EPIs que serão fornecidos aos funcionários
            </div>

            {/* Filtros de Busca */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Critérios de Seleção</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="codigoFiscal">Código Fiscal</Label>
                            <Input
                                id="codigoFiscal"
                                placeholder="Ex: 999"
                                value={searchCodigoFiscal}
                                onChange={(e) => setSearchCodigoFiscal(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="grupoEpi">Grupo EPI</Label>
                            <Input
                                id="grupoEpi"
                                placeholder="Ex: Capacete, Luvas..."
                                value={searchGrupoEpi}
                                onChange={(e) => setSearchGrupoEpi(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Data de Consideração</Label>
                        <RadioGroup
                            value={state.dataConsideração}
                            onValueChange={(value: 'livre' | 'admissao' | 'ultimaMudanca') =>
                                updateState({ dataConsideração: value })
                            }
                            className="mt-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="livre" id="livre" />
                                <Label htmlFor="livre">Data livre</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="admissao" id="admissao" />
                                <Label htmlFor="admissao">Data de admissão</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ultimaMudanca" id="ultimaMudanca" />
                                <Label htmlFor="ultimaMudanca">Data da última mudança</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {state.dataConsideração === 'livre' && (
                        <div>
                            <Label htmlFor="dataLivre">Data Livre</Label>
                            <Input
                                id="dataLivre"
                                type="date"
                                value={state.dataLivre || ''}
                                onChange={(e) => updateState({ dataLivre: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="considerarTransferencia"
                            checked={state.considerarDataTransferencia}
                            onCheckedChange={(checked) =>
                                updateState({ considerarDataTransferencia: !!checked })
                            }
                        />
                        <Label htmlFor="considerarTransferencia">
                            Considerar data de transferência
                        </Label>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de EPIs */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Catálogo de EPIs
                        {!loading && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                ({filteredEpis.length}/{allEpis.length} itens)
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <div className="text-gray-500">Carregando catálogo EPI...</div>
                        </div>
                    )}

                    {/* Tabela de EPIs */}
                    {!loading && (
                        <div className="border rounded-lg max-h-80 overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white">
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="w-12">✓</TableHead>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>CA</TableHead>
                                        <TableHead>Seção</TableHead>
                                        <TableHead>Disponível</TableHead>
                                        <TableHead className="w-20">Qtd</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEpis.map((epi) => (
                                        <TableRow
                                            key={epi.id}
                                            className={isEpiSelected(epi.id) ? 'bg-blue-50' : ''}
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={isEpiSelected(epi.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleEpiToggle(epi, !!checked)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{epi.codigoEpi}</TableCell>
                                            <TableCell>{epi.nome}</TableCell>
                                            <TableCell>{epi.ca}</TableCell>
                                            <TableCell>{epi.codigoSecao}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-xs ${epi.quantidadeDisponivel > 0
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {epi.quantidadeDisponivel}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max={epi.quantidadeDisponivel}
                                                    value={epi.quantidade}
                                                    onChange={(e) =>
                                                        updateQuantidade(epi.id, parseInt(e.target.value) || 1)
                                                    }
                                                    disabled={!isEpiSelected(epi.id)}
                                                    className="w-16 h-8"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {!loading && filteredEpis.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            {allEpis.length === 0
                                ? 'Nenhum item EPI disponível na base de dados.'
                                : 'Nenhum item EPI encontrado com os critérios de busca.'
                            }
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* EPIs Selecionados */}
            {state.selectedEpis.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            EPIs Selecionados ({state.selectedEpis.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {state.selectedEpis.map((epi) => (
                                <div key={epi.id} className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
                                    <span className="font-medium">
                                        {epi.nome} ({epi.codigoEpi}) - Qtd: {epi.quantidade}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEpiToggle(epi, false)}
                                        className="h-6 w-6 p-0"
                                    >
                                        ❌
                                    </Button>
                                </div>
                            ))}
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
                    <Button onClick={handleNext} size="sm" disabled={loading}>
                        Avançar →
                    </Button>
                </div>
            </div>
        </div>
    );
}
