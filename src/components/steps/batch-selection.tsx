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
import { mockEpis } from '@/data/mock-data';

// Mock data - em produção viria de uma API
const allEpis: EpiItem[] = mockEpis;

export default function BatchSelection() {
    const { state, updateState, nextStep, prevStep } = useWizard();
    const [filteredEpis, setFilteredEpis] = useState<EpiItem[]>(allEpis);
    const [searchCodigoFiscal, setSearchCodigoFiscal] = useState(state.codigoFiscal);
    const [searchGrupoEpi, setSearchGrupoEpi] = useState(state.codigoGrupoEpi);

    useEffect(() => {
        // Filtrar EPIs baseado nos critérios
        let filtered = allEpis;

        if (searchCodigoFiscal) {
            filtered = filtered.filter(epi =>
                epi.codigoEpi.includes(searchCodigoFiscal)
            );
        }

        if (searchGrupoEpi) {
            filtered = filtered.filter(epi =>
                epi.nome.toLowerCase().includes(searchGrupoEpi.toLowerCase())
            );
        }

        setFilteredEpis(filtered);
    }, [searchCodigoFiscal, searchGrupoEpi]);

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
            alert('Selecione pelo menos um EPI para continuar.');
            return;
        }
        nextStep();
    };

    const handleApplyFilters = () => {
        updateState({
            codigoFiscal: searchCodigoFiscal,
            codigoGrupoEpi: searchGrupoEpi
        });
    };

    return (
        <div className="space-y-6">
            <div className="text-sm text-gray-600">
                Defina abaixo os lotes que serão fornecidos, com sua respectiva quantidade para cada destinatário
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Selecione os equipamentos a serem fornecidos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Opções de Filtro */}
                        <div>
                            <Label className="text-sm font-medium">Cód. Físico</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={searchCodigoFiscal}
                                    onChange={(e) => setSearchCodigoFiscal(e.target.value)}
                                    placeholder="Código físico"
                                />
                                <Button variant="outline" size="sm">...</Button>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Cód. Grupo EPI</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={searchGrupoEpi}
                                    onChange={(e) => setSearchGrupoEpi(e.target.value)}
                                    placeholder="Grupo EPI"
                                />
                                <Button variant="outline" size="sm">...</Button>
                            </div>
                        </div>
                    </div>

                    {/* Informes de detalhes do fornecimento */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Informe os detalhes do fornecimento</Label>
                        <div className="space-y-2">
                            <Label className="text-sm">Data a Considerar</Label>
                            <RadioGroup
                                value={state.dataConsideração}
                                onValueChange={(value) => updateState({ dataConsideração: value as any })}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="livre" id="livre" />
                                    <Label htmlFor="livre">Livre</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="admissao" id="admissao" />
                                    <Label htmlFor="admissao">Admissão</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ultimaMudanca" id="ultimaMudanca" />
                                    <Label htmlFor="ultimaMudanca">Última Mudança de Seção</Label>
                                </div>
                            </RadioGroup>

                            {state.dataConsideração === 'livre' && (
                                <Input
                                    type="date"
                                    value={state.dataLivre || '2025-07-14'}
                                    onChange={(e) => updateState({ dataLivre: e.target.value })}
                                    className="max-w-xs"
                                />
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="considerarTransferencia"
                                checked={state.considerarDataTransferencia}
                                onCheckedChange={(checked) =>
                                    updateState({ considerarDataTransferencia: !!checked })
                                }
                            />
                            <Label htmlFor="considerarTransferencia" className="text-sm">
                                Considerar Data de Transferência (Transf. Entre Filiais)
                            </Label>
                        </div>
                    </div>

                    {/* Atualizar Quantidade */}
                    <div className="flex items-center gap-4">
                        <Label className="text-sm">Atualizar Quantidade</Label>
                        <Label className="text-sm">Quantidade</Label>
                        <Input className="w-20" defaultValue="1" />
                        <Button variant="outline" size="sm">
                            Atualizar
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="eficaz" defaultChecked />
                        <Label htmlFor="eficaz" className="text-sm">Eficaz</Label>
                    </div>

                    <Button onClick={handleApplyFilters} className="w-full">
                        Aplicar Filtros
                    </Button>
                </CardContent>
            </Card>

            {/* Tabela de EPIs */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-2 mb-4">
                        <Button variant="outline" size="sm">➕</Button>
                        <Button variant="outline" size="sm">❌</Button>
                        <Button variant="outline" size="sm">⬆️</Button>
                        <Button variant="outline" size="sm">⬇️</Button>
                        <Button variant="outline" size="sm">🔍</Button>
                        <div className="text-sm text-gray-500 ml-auto">
                            1/1
                        </div>
                        <Button variant="outline" size="sm">📄</Button>
                    </div>

                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-12">✓</TableHead>
                                    <TableHead>Cód. EPI</TableHead>
                                    <TableHead>Id. Lote</TableHead>
                                    <TableHead>CA</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Cód. Seção</TableHead>
                                    <TableHead>Código da Filial</TableHead>
                                    <TableHead>Data de Aquisição</TableHead>
                                    <TableHead>Quantidade</TableHead>
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
                                        <TableCell>{epi.codigoEpi}</TableCell>
                                        <TableCell>{epi.idLote}</TableCell>
                                        <TableCell>{epi.ca}</TableCell>
                                        <TableCell>{epi.nome}</TableCell>
                                        <TableCell>{epi.codigoSecao}</TableCell>
                                        <TableCell>{epi.codigoFilial}</TableCell>
                                        <TableCell>{epi.dataAquisicao}</TableCell>
                                        <TableCell>
                                            {isEpiSelected(epi.id) ? (
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max={epi.quantidadeDisponivel}
                                                    value={state.selectedEpis.find(e => e.id === epi.id)?.quantidade || 1}
                                                    onChange={(e) => updateQuantidade(epi.id, parseInt(e.target.value) || 1)}
                                                    className="w-20"
                                                />
                                            ) : (
                                                epi.quantidade
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredEpis.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Nenhum EPI encontrado com os critérios de busca.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* EPIs Selecionados */}
            {state.selectedEpis.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            EPIs Selecionados ({state.selectedEpis.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {state.selectedEpis.map((epi) => (
                                <div key={epi.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                    <span className="font-medium">
                                        {epi.nome} - {epi.codigoEpi} (Qty: {epi.quantidade})
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEpiToggle(epi, false)}
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
            <div className="flex justify-between pt-6 border-t">
                <Button variant="outline">
                    Opções
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={prevStep}>
                        ← Voltar
                    </Button>
                    <Button onClick={handleNext}>
                        Avançar →
                    </Button>
                </div>
            </div>
        </div>
    );
}
