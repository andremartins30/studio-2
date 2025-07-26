'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, Package } from 'lucide-react';
import { apiService, GrupoEpiSOAP, EpiItemSOAP } from '@/lib/api';

interface GrupoEpiSelectorProps {
    onEpiSelected?: (epis: EpiItemSOAP[]) => void;
    className?: string;
}

export default function GrupoEpiSelector({ onEpiSelected, className }: GrupoEpiSelectorProps) {
    // Estados para grupos EPI
    const [grupos, setGrupos] = useState<GrupoEpiSOAP[]>([]);
    const [grupoSelecionado, setGrupoSelecionado] = useState<string>('');
    const [loadingGrupos, setLoadingGrupos] = useState(true);
    const [errorGrupos, setErrorGrupos] = useState<string | null>(null);

    // Estados para catálogo EPI
    const [epis, setEpis] = useState<EpiItemSOAP[]>([]);
    const [loadingEpis, setLoadingEpis] = useState(false);
    const [errorEpis, setErrorEpis] = useState<string | null>(null);

    // Carregar grupos EPI ao montar o componente
    useEffect(() => {
        const carregarGrupos = async () => {
            try {
                setLoadingGrupos(true);
                setErrorGrupos(null);
                console.log('🛡️ Carregando grupos EPI...');

                const response = await apiService.getGruposEpi();

                if (response.success && response.gruposEPI) {
                    const gruposArray = Array.isArray(response.gruposEPI)
                        ? response.gruposEPI
                        : [response.gruposEPI];

                    setGrupos(gruposArray);
                    console.log(`✅ ${gruposArray.length} grupos EPI carregados`);
                } else {
                    throw new Error('Resposta inválida da API de grupos EPI');
                }

            } catch (error) {
                console.error('❌ Erro ao carregar grupos EPI:', error);
                setErrorGrupos(`Erro ao carregar grupos EPI: ${error}`);

                // Fallback para dados mock
                setGrupos([
                    { CODGRUPOEPI: '001', NOME: 'CABEÇA', DESCRICAO: 'Equipamentos de proteção para cabeça' },
                    { CODGRUPOEPI: '002', NOME: 'MÃOS', DESCRICAO: 'Equipamentos de proteção para mãos' },
                    { CODGRUPOEPI: '003', NOME: 'PÉS', DESCRICAO: 'Equipamentos de proteção para pés' }
                ]);
            } finally {
                setLoadingGrupos(false);
            }
        };

        carregarGrupos();
    }, []);

    // Buscar EPIs do grupo selecionado
    const buscarEpisPorGrupo = async () => {
        if (!grupoSelecionado) {
            setErrorEpis('Selecione um grupo EPI primeiro');
            return;
        }

        try {
            setLoadingEpis(true);
            setErrorEpis(null);
            setEpis([]);

            console.log('🔍 Buscando EPIs do grupo:', grupoSelecionado);

            const response = await apiService.getCatalogoEpi(grupoSelecionado);

            if (response.success && response.catalogoEPI) {
                const episArray = Array.isArray(response.catalogoEPI)
                    ? response.catalogoEPI
                    : [response.catalogoEPI];

                setEpis(episArray);
                console.log(`✅ ${episArray.length} EPIs encontrados para o grupo ${grupoSelecionado}`);

                // Callback para componente pai
                if (onEpiSelected) {
                    onEpiSelected(episArray);
                }
            } else {
                throw new Error('Resposta inválida da API de catálogo EPI');
            }

        } catch (error) {
            console.error('❌ Erro ao buscar EPIs do grupo:', error);
            setErrorEpis(`Erro ao buscar EPIs: ${error}`);

            // Fallback para dados mock baseado no grupo
            const mockEpis = [
                { CODIGO: `${grupoSelecionado}001`, NOME: `EPI Teste ${grupoSelecionado}`, CA: '12345', GRUPO: grupoSelecionado, ATIVO: true },
                { CODIGO: `${grupoSelecionado}002`, NOME: `EPI Exemplo ${grupoSelecionado}`, CA: '67890', GRUPO: grupoSelecionado, ATIVO: true }
            ];
            setEpis(mockEpis);
        } finally {
            setLoadingEpis(false);
        }
    };

    // Handler para mudança de grupo
    const handleGrupoChange = (codigoGrupo: string) => {
        setGrupoSelecionado(codigoGrupo);
        setEpis([]); // Limpar EPIs anteriores
        setErrorEpis(null);
    };

    // Buscar nome do grupo selecionado
    const getNomeGrupoSelecionado = () => {
        const grupo = grupos.find(g => g.CODGRUPOEPI === grupoSelecionado);
        return grupo ? grupo.NOME : '';
    };

    return (
        <div className={className}>
            {/* Seleção de Grupo EPI */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Seleção de Grupo EPI
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Loading de grupos */}
                    {loadingGrupos && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando grupos EPI...
                        </div>
                    )}

                    {/* Erro ao carregar grupos */}
                    {errorGrupos && (
                        <Alert variant="destructive">
                            <AlertDescription>{errorGrupos}</AlertDescription>
                        </Alert>
                    )}

                    {/* Seletor de grupo */}
                    {!loadingGrupos && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Grupo EPI:</label>
                            <Select
                                value={grupoSelecionado}
                                onValueChange={handleGrupoChange}
                                disabled={grupos.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="-- Selecione um grupo --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {grupos.map((grupo) => (
                                        <SelectItem key={grupo.CODGRUPOEPI} value={grupo.CODGRUPOEPI}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{grupo.NOME}</span>
                                                <span className="text-xs text-gray-500">
                                                    Código: {grupo.CODGRUPOEPI}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Botão para buscar EPIs */}
                    <Button
                        onClick={buscarEpisPorGrupo}
                        disabled={!grupoSelecionado || loadingEpis}
                        className="w-full"
                    >
                        {loadingEpis ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Buscando EPIs...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Buscar EPIs do Grupo
                            </>
                        )}
                    </Button>

                    {/* Informações do grupo selecionado */}
                    {grupoSelecionado && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm">
                                <strong>Grupo Selecionado:</strong> {getNomeGrupoSelecionado()}
                            </div>
                            <div className="text-xs text-gray-600">
                                Código: {grupoSelecionado}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resultado dos EPIs */}
            {(epis.length > 0 || errorEpis) && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🛡️ EPIs do Grupo {getNomeGrupoSelecionado()}
                            {epis.length > 0 && (
                                <Badge variant="secondary">{epis.length} itens</Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Erro ao buscar EPIs */}
                        {errorEpis && (
                            <Alert variant="destructive">
                                <AlertDescription>{errorEpis}</AlertDescription>
                            </Alert>
                        )}

                        {/* Lista de EPIs */}
                        {epis.length > 0 && (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {epis.map((epi, index) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="font-medium text-sm">
                                            {epi.NOME}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">
                                            <span className="mr-4"><strong>Código:</strong> {epi.CODIGO}</span>
                                            {epi.CA && (
                                                <span className="mr-4"><strong>CA:</strong> {epi.CA}</span>
                                            )}
                                            {epi.ATIVO !== undefined && (
                                                <span>
                                                    <strong>Status:</strong>
                                                    <Badge
                                                        className="ml-1"
                                                        variant={epi.ATIVO ? "default" : "secondary"}
                                                    >
                                                        {epi.ATIVO ? 'Ativo' : 'Inativo'}
                                                    </Badge>
                                                </span>
                                            )}
                                        </div>
                                        {epi.DESCRICAO && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {epi.DESCRICAO}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {epis.length === 0 && !errorEpis && !loadingEpis && grupoSelecionado && (
                            <div className="text-center py-4 text-gray-500">
                                Nenhum EPI encontrado para este grupo.
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 