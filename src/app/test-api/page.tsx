'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService } from '@/lib/api';
import { FuncionarioService } from '@/services/funcionario-service';
import { EpiService } from '@/services/epi-service';
import GrupoEpiSelector from '@/components/GrupoEpiSelector';

export default function TestApiPage() {
    const [loading, setLoading] = useState(false);
    const [colaboradores, setColaboradores] = useState<any[]>([]);
    const [catalogoEpi, setCatalogoEpi] = useState<any[]>([]);
    const [gruposEpi, setGruposEpi] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Teste de Integração API SOAP</h1>

            <div className="text-sm text-gray-600">
                Esta página permite testar a integração com a API SOAP backend.
                Certifique-se de que a API está rodando em http://localhost:3001
            </div>

            <Tabs defaultValue="testes-basicos" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="testes-basicos">Testes Básicos</TabsTrigger>
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
                    <div><strong>Endpoint Colaboradores:</strong> POST /colaboradores</div>
                    <div><strong>Endpoint Grupos EPI:</strong> POST /grupo-epi</div>
                    <div><strong>Endpoint Catálogo EPI:</strong> POST /catalogo-epi</div>
                    <div><strong>Endpoint Consulta Genérica:</strong> POST /consulta</div>
                    <div className="text-gray-600 mt-4">
                        <strong>Nota:</strong> Certifique-se de que a API backend está rodando antes de testar.
                        Execute: <code className="bg-gray-100 px-1 rounded">cd BACKEND-API-main && npm start</code>
                    </div>
                    <div className="text-blue-600 mt-2">
                        <strong>✨ Novo:</strong> Agora inclui integração com grupos EPI para busca filtrada do catálogo.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 