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
import { mockEmployees } from '@/data/mock-data';

// Mock data - em produção viria de uma API
const allEmployees: Employee[] = mockEmployees;

export default function EmployeeSelection() {
    const { state, updateState, nextStep, prevStep } = useWizard();
    const { addNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(allEmployees);

    useEffect(() => {
        const filtered = allEmployees.filter(employee =>
            employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.matricula.includes(searchTerm) ||
            employee.codigoFuncao.includes(searchTerm) ||
            employee.codigoSecao.includes(searchTerm)
        );
        setFilteredEmployees(filtered);
    }, [searchTerm]);

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
                            1/1
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
                        />
                    </div>

                    {/* Tabela de Funcionários */}
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

                    {filteredEmployees.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Nenhum funcionário encontrado com os critérios de busca.
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
                    <Button onClick={handleNext} size="sm">
                        Avançar →
                    </Button>
                </div>
            </div>
        </div>
    );
}
