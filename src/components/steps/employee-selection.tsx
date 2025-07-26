'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { useNotification } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Employee } from '@/types/epi';
import { FuncionarioService } from '@/services/funcionario-service';

export default function EmployeeSelection() {
    const { state, updateState, nextStep, prevStep } = useWizard();
    const { addNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    // Carregar funcionários da API
    useEffect(() => {
        const carregarFuncionarios = async () => {
            try {
                setLoading(true);
                console.log('🔍 Carregando funcionários da API SOAP...');

                const funcionarios = await FuncionarioService.buscarEmployees();
                setAllEmployees(funcionarios);
                setFilteredEmployees(funcionarios);

                console.log(`✅ ${funcionarios.length} funcionários carregados com sucesso`);

                if (funcionarios.length === 0) {
                    addNotification({
                        type: 'warning',
                        title: 'Atenção',
                        message: 'Nenhum funcionário encontrado na base de dados.',
                    });
                }
            } catch (error) {
                console.error('❌ Erro ao carregar funcionários:', error);
                addNotification({
                    type: 'error',
                    title: 'Erro ao Carregar Funcionários',
                    message: 'Erro de conexão com o servidor. Usando dados de fallback.',
                });
            } finally {
                setLoading(false);
            }
        };

        carregarFuncionarios();
    }, [addNotification]);

    // Filtrar funcionários baseado no termo de busca
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredEmployees(allEmployees);
            return;
        }

        const termo = searchTerm.toLowerCase();
        const filtered = allEmployees.filter(employee =>
            employee.nome.toLowerCase().includes(termo) ||
            employee.matricula.toLowerCase().includes(termo) ||
            employee.codigoFuncao.toLowerCase().includes(termo) ||
            employee.codigoSecao.toLowerCase().includes(termo)
        );

        setFilteredEmployees(filtered);
    }, [searchTerm, allEmployees]);

    const handleEmployeeToggle = (employee: Employee, checked: boolean) => {
        if (checked) {
            updateState({
                selectedEmployees: [...state.selectedEmployees, employee]
            });
        } else {
            updateState({
                selectedEmployees: state.selectedEmployees.filter(e => e.id !== employee.id)
            });
        }
    };

    const isEmployeeSelected = (employeeId: string) => {
        return state.selectedEmployees.some(e => e.id === employeeId);
    };

    const handleNext = () => {
        if (state.selectedEmployees.length === 0) {
            addNotification({
                type: 'error',
                title: 'Seleção Obrigatória',
                message: 'Selecione pelo menos um funcionário para continuar.',
            });
            return;
        }

        addNotification({
            type: 'success',
            title: 'Funcionários Selecionados',
            message: `${state.selectedEmployees.length} funcionário(s) selecionado(s)`,
        });

        nextStep();
    };

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600">
                Selecione abaixo os funcionários que receberão o fornecimento
            </div>

            {/* Barra de Ferramentas */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex gap-2 mb-3">
                        <Button variant="outline" size="sm">➕</Button>
                        <Button variant="outline" size="sm">❌</Button>
                        <Button variant="outline" size="sm">⬆️</Button>
                        <Button variant="outline" size="sm">⬇️</Button>
                        <Button variant="outline" size="sm">🔍</Button>
                        <div className="text-sm text-gray-500 ml-auto">
                            {filteredEmployees.length}/{allEmployees.length}
                        </div>
                        <Button variant="outline" size="sm">📄</Button>
                    </div>

                    {/* Campo de Busca */}
                    <div className="mb-4">
                        <Input
                            placeholder="Buscar por nome, matrícula, função ou seção..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-md"
                            disabled={loading}
                        />
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <div className="text-gray-500">Carregando funcionários...</div>
                        </div>
                    )}

                    {/* Tabela de Funcionários */}
                    {!loading && (
                        <div className="border rounded-lg max-h-64 overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white">
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="w-12">✓</TableHead>
                                        <TableHead>Chapa</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Cód. Função</TableHead>
                                        <TableHead>Cód. Seção</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEmployees.map((employee) => (
                                        <TableRow
                                            key={employee.id}
                                            className={isEmployeeSelected(employee.id) ? 'bg-blue-50' : ''}
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={isEmployeeSelected(employee.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleEmployeeToggle(employee, !!checked)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{employee.matricula}</TableCell>
                                            <TableCell>{employee.nome}</TableCell>
                                            <TableCell>{employee.codigoFuncao}</TableCell>
                                            <TableCell>{employee.codigoSecao}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {!loading && filteredEmployees.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            {allEmployees.length === 0
                                ? 'Nenhum funcionário disponível na base de dados.'
                                : 'Nenhum funcionário encontrado com os critérios de busca.'
                            }
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Funcionários Selecionados */}
            {state.selectedEmployees.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            Funcionários Selecionados ({state.selectedEmployees.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {state.selectedEmployees.map((employee) => (
                                <div key={employee.id} className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
                                    <span className="font-medium">{employee.nome} - {employee.matricula}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEmployeeToggle(employee, false)}
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
