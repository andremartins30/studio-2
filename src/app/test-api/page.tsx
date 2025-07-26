'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiService } from '@/lib/api';
import { FuncionarioService } from '@/services/funcionario-service';
import { EpiService } from '@/services/epi-service';
import GrupoEpiSelector from '@/components/GrupoEpiSelector';

export default function TestApiPage() {
    const [loading, setLoading] = useState(false);
    const [colaboradores, setColaboradores] = useState<any[]>([]);
    const [catalogoEpi, setCatalogoEpi] = useState<any[]>([]);
    const [gruposEpi, setGruposEpi] = useState<any[]>([]);
    const [episEmprestados, setEpisEmprestados] = useState<any[]>([]);
    const [resultadoWizard, setResultadoWizard] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Estados para o wizard
    const [chapaFuncionario, setChapaFuncionario] = useState('00005');
    const [codigoEpi, setCodigoEpi] = useState('999');
    const [quantidadeEpi, setQuantidadeEpi] = useState(1);
    const [observacao, setObservacao] = useState('');
    const [motivoDescarte, setMotivoDescarte] = useState('');
    const [codIdentEpi, setCodIdentEpi] = useState('');

    const testarColaboradores = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Testando API de colaboradores...');

            const response = await apiService.getColaboradores();
            console.log('Resposta colaboradores:', response);

            setColaboradores(response.colaboradores || []);
        } catch (error) {
            console.error('Erro ao testar colaboradores:', error);
            setError(`Erro colaboradores: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testarGruposEpi = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🛡️ Testando API de grupos EPI...');

            const response = await apiService.getGruposEpi();
            console.log('Resposta grupos EPI:', response);

            setGruposEpi(response.gruposEPI || []);
        } catch (error) {
            console.error('Erro ao testar grupos EPI:', error);
            setError(`Erro grupos EPI: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testarCatalogoEpi = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🛡️ Testando API de catálogo EPI...');

            const response = await apiService.getCatalogoEpi();
            console.log('Resposta catálogo EPI:', response);

            setCatalogoEpi(response.catalogoEPI || []);
        } catch (error) {
            console.error('Erro ao testar catálogo EPI:', error);
            setError(`Erro catálogo EPI: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testarFuncionarioService = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('👥 Testando FuncionarioService...');

            const funcionarios = await FuncionarioService.buscarEmployees();
            console.log('Funcionários via service:', funcionarios);

            setColaboradores(funcionarios);
        } catch (error) {
            console.error('Erro ao testar FuncionarioService:', error);
            setError(`Erro FuncionarioService: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testarEpiService = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🛡️ Testando EpiService...');

            const epis = await EpiService.buscarCatalogoEpi();
            console.log('EPIs via service:', epis);

            setCatalogoEpi(epis);
        } catch (error) {
            console.error('Erro ao testar EpiService:', error);
            setError(`Erro EpiService: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    // Novas funções para testar o wizard
    const testarFornecimento = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🎯 Testando fornecimento de EPIs...');

            const dados = {
                chapa: chapaFuncionario,
                epis: [
                    {
                        codepi: codigoEpi,
                        quantidade: quantidadeEpi
                    }
                ],
                observacao
            };

            const response = await fetch('http://localhost:3001/api/wizard/fornecimento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const result = await response.json();
            console.log('Resultado fornecimento:', result);
            setResultadoWizard(result);

        } catch (error) {
            console.error('Erro ao testar fornecimento:', error);
            setError(`Erro fornecimento: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testarDevolucao = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Testando devolução de EPIs...');

            const dados = {
                chapa: chapaFuncionario,
                epis: [
                    {
                        codidentepi: codIdentEpi,
                        observacao
                    }
                ],
                motivo: 'Teste de devolução'
            };

            const response = await fetch('http://localhost:3001/api/wizard/devolucao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const result = await response.json();
            console.log('Resultado devolução:', result);
            setResultadoWizard(result);

        } catch (error) {
            console.error('Erro ao testar devolução:', error);
            setError(`Erro devolução: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testarDescarte = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🗑️ Testando descarte de EPIs...');

            const dados = {
                chapa: chapaFuncionario,
                epis: [
                    {
                        codidentepi: codIdentEpi,
                        observacao
                    }
                ],
                motivo: motivoDescarte || 'Danificado/Desgastado'
            };

            const response = await fetch('http://localhost:3001/api/wizard/descarte', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const result = await response.json();
            console.log('Resultado descarte:', result);
            setResultadoWizard(result);

        } catch (error) {
            console.error('Erro ao testar descarte:', error);
            setError(`Erro descarte: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testarCancelamento = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('❌ Testando cancelamento de EPIs...');

            const dados = {
                chapa: chapaFuncionario,
                epis: [
                    {
                        codidentepi: codIdentEpi,
                        observacao
                    }
                ],
                motivo: 'Teste de cancelamento'
            };

            const response = await fetch('http://localhost:3001/api/wizard/cancelamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const result = await response.json();
            console.log('Resultado cancelamento:', result);
            setResultadoWizard(result);

        } catch (error) {
            console.error('Erro ao testar cancelamento:', error);
            setError(`Erro cancelamento: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testarEpisEmprestados = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('📋 Testando EPIs emprestados...');

            const response = await fetch(`http://localhost:3001/api/wizard/emprestimos/${chapaFuncionario}`);
            const result = await response.json();

            console.log('EPIs emprestados:', result);
            setEpisEmprestados(result.episEmprestados || []);

        } catch (error) {
            console.error('Erro ao testar EPIs emprestados:', error);
            setError(`Erro EPIs emprestados: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const testarValidacaoEpi = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Testando validação de EPI...');

            const response = await fetch(`http://localhost:3001/api/wizard/validar/${codigoEpi}?quantidade=${quantidadeEpi}`);
            const result = await response.json();

            console.log('Validação EPI:', result);
            setResultadoWizard(result);

        } catch (error) {
            console.error('Erro ao testar validação:', error);
            setError(`Erro validação: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Teste de Integração API SOAP & Wizard EPI</h1>

            <div className="text-sm text-gray-600">
                Esta página permite testar a integração com a API SOAP backend e as funcionalidades do wizard EPI.
                Certifique-se de que a API está rodando em http://localhost:3001
            </div>

            <Tabs defaultValue="testes-basicos" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="testes-basicos">Testes Básicos</TabsTrigger>
                    <TabsTrigger value="wizard">Wizard EPI</TabsTrigger>
                    <TabsTrigger value="grupo-epi">Seletor Grupo EPI</TabsTrigger>
                    <TabsTrigger value="resultados">Resultados</TabsTrigger>
                </TabsList>

                {/* Tab de Testes Básicos */}
                <TabsContent value="testes-basicos" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>🧪 Testes de API</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Button
                                    onClick={testarColaboradores}
                                    disabled={loading}
                                    variant="outline"
                                    className="h-20 flex-col"
                                >
                                    👥<br />
                                    {loading ? 'Testando...' : 'API Colaboradores'}
                                </Button>

                                <Button
                                    onClick={testarGruposEpi}
                                    disabled={loading}
                                    variant="outline"
                                    className="h-20 flex-col"
                                >
                                    📦<br />
                                    {loading ? 'Testando...' : 'API Grupos EPI'}
                                </Button>

                                <Button
                                    onClick={testarCatalogoEpi}
                                    disabled={loading}
                                    variant="outline"
                                    className="h-20 flex-col"
                                >
                                    🛡️<br />
                                    {loading ? 'Testando...' : 'API Catálogo EPI'}
                                </Button>

                                <Button
                                    onClick={testarFuncionarioService}
                                    disabled={loading}
                                    variant="outline"
                                    className="h-20 flex-col"
                                >
                                    👥<br />
                                    {loading ? 'Testando...' : 'FuncionarioService'}
                                </Button>

                                <Button
                                    onClick={testarEpiService}
                                    disabled={loading}
                                    variant="outline"
                                    className="h-20 flex-col"
                                >
                                    🛡️<br />
                                    {loading ? 'Testando...' : 'EpiService'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status de Loading */}
                    {loading && (
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    <span>Carregando dados da API...</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Erro */}
                    {error && (
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-600">❌ Erro</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="text-sm text-red-600 whitespace-pre-wrap">{error}</pre>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Tab do Wizard EPI */}
                <TabsContent value="wizard" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>🧙‍♂️ Teste das Ações do Wizard EPI</CardTitle>
                            <p className="text-sm text-gray-600">
                                Teste as funcionalidades de fornecimento, devolução, descarte e cancelamento de EPIs.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Campos de entrada */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="chapa">Chapa do Funcionário</Label>
                                    <Input
                                        id="chapa"
                                        value={chapaFuncionario}
                                        onChange={(e) => setChapaFuncionario(e.target.value)}
                                        placeholder="Ex: 00005"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="codepi">Código do EPI</Label>
                                    <Input
                                        id="codepi"
                                        value={codigoEpi}
                                        onChange={(e) => setCodigoEpi(e.target.value)}
                                        placeholder="Ex: 999"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="quantidade">Quantidade</Label>
                                    <Input
                                        id="quantidade"
                                        type="number"
                                        value={quantidadeEpi}
                                        onChange={(e) => setQuantidadeEpi(parseInt(e.target.value) || 1)}
                                        min={1}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="codident">Código de Identificação (para devolução/descarte/cancelamento)</Label>
                                    <Input
                                        id="codident"
                                        value={codIdentEpi}
                                        onChange={(e) => setCodIdentEpi(e.target.value)}
                                        placeholder="Ex: EPI_ID_123"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="motivo">Motivo do Descarte</Label>
                                    <Select value={motivoDescarte} onValueChange={setMotivoDescarte}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o motivo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Danificado/Desgastado">Danificado/Desgastado</SelectItem>
                                            <SelectItem value="Prazo de validade vencido">Prazo de validade vencido</SelectItem>
                                            <SelectItem value="Perdido pelo funcionário">Perdido pelo funcionário</SelectItem>
                                            <SelectItem value="Defeito de fabricação">Defeito de fabricação</SelectItem>
                                            <SelectItem value="Outros motivos">Outros motivos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="observacao">Observação</Label>
                                    <Textarea
                                        id="observacao"
                                        value={observacao}
                                        onChange={(e) => setObservacao(e.target.value)}
                                        placeholder="Observações adicionais..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Botões de ação */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <Button
                                    onClick={testarFornecimento}
                                    disabled={loading}
                                    variant="default"
                                    className="h-16 flex-col"
                                >
                                    🎯<br />
                                    Fornecimento
                                </Button>

                                <Button
                                    onClick={testarDevolucao}
                                    disabled={loading}
                                    variant="outline"
                                    className="h-16 flex-col"
                                >
                                    🔄<br />
                                    Devolução
                                </Button>

                                <Button
                                    onClick={testarDescarte}
                                    disabled={loading}
                                    variant="outline"
                                    className="h-16 flex-col"
                                >
                                    🗑️<br />
                                    Descarte
                                </Button>

                                <Button
                                    onClick={testarCancelamento}
                                    disabled={loading}
                                    variant="outline"
                                    className="h-16 flex-col"
                                >
                                    ❌<br />
                                    Cancelamento
                                </Button>

                                <Button
                                    onClick={testarEpisEmprestados}
                                    disabled={loading}
                                    variant="secondary"
                                    className="h-16 flex-col"
                                >
                                    📋<br />
                                    EPIs Emprestados
                                </Button>

                                <Button
                                    onClick={testarValidacaoEpi}
                                    disabled={loading}
                                    variant="secondary"
                                    className="h-16 flex-col"
                                >
                                    🔍<br />
                                    Validar EPI
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab do Seletor de Grupo EPI */}
                <TabsContent value="grupo-epi" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>🎯 Teste do Seletor de Grupo EPI</CardTitle>
                            <p className="text-sm text-gray-600">
                                Este componente demonstra a integração completa: buscar grupos EPI e depois buscar
                                os EPIs específicos do grupo selecionado.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <GrupoEpiSelector
                                onEpiSelected={(epis) => {
                                    console.log('EPIs selecionados via callback:', epis);
                                    setCatalogoEpi(epis);
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab de Resultados */}
                <TabsContent value="resultados" className="space-y-4">
                    {/* Resultado do Wizard */}
                    {resultadoWizard && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    🧙‍♂️ Resultado Wizard
                                    <Badge className="ml-2" variant={resultadoWizard.success ? "default" : "destructive"}>
                                        {resultadoWizard.success ? "Sucesso" : "Erro"}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto max-h-64">
                                    {JSON.stringify(resultadoWizard, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    )}

                    {/* EPIs Emprestados */}
                    {episEmprestados.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    📋 EPIs Emprestados
                                    <Badge className="ml-2">{episEmprestados.length} itens</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {episEmprestados.map((epi, index) => (
                                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                            <div className="font-medium">
                                                {epi.NOME} - {epi.CODEPI}
                                            </div>
                                            <div className="text-gray-600">
                                                Data Empréstimo: {epi.DATAEMPRESTIMO} |
                                                ID: {epi.CODIDENTEPI}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Resultado Colaboradores */}
                    {colaboradores.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    👥 Colaboradores
                                    <Badge className="ml-2">{colaboradores.length} encontrados</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {colaboradores.slice(0, 10).map((colaborador, index) => (
                                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                            <div className="font-medium">
                                                {colaborador.NOME || colaborador.nome} - {colaborador.CHAPA || colaborador.matricula}
                                            </div>
                                            <div className="text-gray-600">
                                                Função: {colaborador.CODFUNCAO || colaborador.codigoFuncao} |
                                                Seção: {colaborador.CODSECAO || colaborador.codigoSecao}
                                            </div>
                                        </div>
                                    ))}
                                    {colaboradores.length > 10 && (
                                        <div className="text-sm text-gray-500 text-center">
                                            ... e mais {colaboradores.length - 10} colaboradores
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Resultado Grupos EPI */}
                    {gruposEpi.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    📦 Grupos EPI
                                    <Badge className="ml-2">{gruposEpi.length} grupos</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {gruposEpi.map((grupo, index) => (
                                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                            <div className="font-medium">
                                                {grupo.NOME} - {grupo.CODGRUPOEPI}
                                            </div>
                                            {grupo.DESCRICAO && (
                                                <div className="text-gray-600">
                                                    {grupo.DESCRICAO}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Resultado Catálogo EPI */}
                    {catalogoEpi.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    🛡️ Catálogo EPI
                                    <Badge className="ml-2">{catalogoEpi.length} itens</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {catalogoEpi.slice(0, 10).map((epi, index) => (
                                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                            <div className="font-medium">
                                                {epi.NOME || epi.nome} - {epi.CODIGO || epi.codigoEpi}
                                            </div>
                                            <div className="text-gray-600">
                                                CA: {epi.CA || epi.ca} |
                                                Grupo: {epi.GRUPO || epi.codigoSecao} |
                                                Ativo: {String(epi.ATIVO || epi.eficaz)}
                                            </div>
                                        </div>
                                    ))}
                                    {catalogoEpi.length > 10 && (
                                        <div className="text-sm text-gray-500 text-center">
                                            ... e mais {catalogoEpi.length - 10} itens EPI
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Informações da API */}
            <Card>
                <CardHeader>
                    <CardTitle>ℹ️ Informações da API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div><strong>URL SOAP API:</strong> http://localhost:3001</div>
                    <div><strong>Endpoints Básicos:</strong></div>
                    <div className="ml-4">
                        • <code>POST /colaboradores</code> - Colaboradores (legado)<br />
                        • <code>POST /grupo-epi</code> - Grupos EPI (legado)<br />
                        • <code>POST /catalogo-epi</code> - Catálogo EPI (legado)<br />
                    </div>
                    <div><strong>Endpoints REST:</strong></div>
                    <div className="ml-4">
                        • <code>GET /api/colaboradores</code> - Lista colaboradores<br />
                        • <code>GET /api/grupos-epi</code> - Lista grupos EPI<br />
                        • <code>GET /api/catalogo-epi</code> - Lista catálogo EPI<br />
                    </div>
                    <div><strong>🆕 Endpoints Wizard EPI:</strong></div>
                    <div className="ml-4">
                        • <code>POST /api/wizard/fornecimento</code> - Fornecimento de EPIs<br />
                        • <code>POST /api/wizard/devolucao</code> - Devolução de EPIs<br />
                        • <code>POST /api/wizard/descarte</code> - Descarte de EPIs<br />
                        • <code>POST /api/wizard/cancelamento</code> - Cancelamento de EPIs<br />
                        • <code>GET /api/wizard/emprestimos/:chapa</code> - EPIs emprestados<br />
                        • <code>GET /api/wizard/validar/:codepi</code> - Validar disponibilidade<br />
                        • <code>GET /api/wizard/info</code> - Informações do wizard<br />
                    </div>
                    <div className="text-gray-600 mt-4">
                        <strong>Nota:</strong> Certifique-se de que a API backend está rodando antes de testar.
                        Execute: <code className="bg-gray-100 px-1 rounded">cd BACKEND-API-main && npm start</code>
                    </div>
                    <div className="text-blue-600 mt-2">
                        <strong>✨ Novidades v2.0:</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>API REST organizada com controllers e services</li>
                            <li>Ações completas do wizard EPI (fornecimento, devolução, descarte, cancelamento)</li>
                            <li>Consultas auxiliares (EPIs emprestados, histórico, validação)</li>
                            <li>Integração com grupos EPI para busca filtrada</li>
                            <li>Tratamento robusto de erros e logs estruturados</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 