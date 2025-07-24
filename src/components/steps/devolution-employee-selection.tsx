'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { useNotification } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types/epi';

// Mock data - funcionários que possuem EPIs emprestados
const employeesWithLoanedEpis: Employee[] = [
    { id: '1', matricula: 'EMP001', nome: 'João Silva', codigoFuncao: 'SOLD001', codigoSecao: 'PROD01' },
    { id: '2', matricula: 'EMP002', nome: 'Maria Santos', codigoFuncao: 'SOLD002', codigoSecao: 'PROD01' },
    { id: '3', matricula: 'EMP003', nome: 'Carlos Oliveira', codigoFuncao: 'SOLD003', codigoSecao: 'PROD02' },
    { id: '4', matricula: 'EMP004', nome: 'Ana Costa', codigoFuncao: 'SOLD001', codigoSecao: 'PROD01' },
    { id: '5', matricula: 'EMP005', nome: 'Pedro Almeida', codigoFuncao: 'SOLD004', codigoSecao: 'PROD03' },
];

export default function DevolutionEmployeeSelection() {
    const { state, updateState, nextStep, prevStep } = useWizard();
    const { addNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employeesWithLoanedEpis);

    useEffect(() => {
        const filtered = employeesWithLoanedEpis.filter(employee =>
            employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.matricula.includes(searchTerm) ||
            employee.codigoFuncao.includes(searchTerm) ||
            employee.codigoSecao.includes(searchTerm)
        );
        setFilteredEmployees(filtered);
    }, [searchTerm]);

    const isEmployeeSelected = (employeeId: string) => {
        return state.selectedEmployees.some(emp => emp.id === employeeId);
    };

    const handleEmployeeToggle = (employee: Employee, isSelected: boolean) => {
        if (isSelected) {
            updateState({
                selectedEmployees: [...state.selectedEmployees, employee]
            });
        } else {
            updateState({
                selectedEmployees: state.selectedEmployees.filter(emp => emp.id !== employee.id)
            });
        }
    };

    const handleNext = () => {
        if (state.selectedEmployees.length === 0) {
            addNotification({
                type: 'error',
                title: 'Seleção Obrigatória',
                message: 'Selecione pelo menos um funcionário para devolução.',
            });
            return;
        }

        addNotification({
            type: 'success',
            title: 'Funcionários Selecionados',
            message: `${state.selectedEmployees.length} funcionário(s) selecionado(s) para devolução.`,
        });
        nextStep();
    };

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600">
                Selecione abaixo os funcionários que farão a devolução de EPIs.
                <Badge variant="secondary" className="ml-2">
                    Apenas funcionários com EPIs emprestados
                </Badge>
            </div>

            {/* Barra de Ferramentas */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex gap-2 mb-3">
                        <Button variant="outline" size="sm">➕</Button>
                        <Button variant="outline" size="sm">❌</Button>
                        <Button variant="outline" size="sm">⬆️</Button>
                        <Button variant="outline" size="sm">⬇️</Button>
                        <Button variant="outline" size="sm">↻</Button>
                        <div className="flex-1" />
                        <Input
                            placeholder="Buscar funcionário..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-md"
                        />
                    </div>

                    {/* Tabela de Funcionários com EPIs Emprestados */}
                    <div className="border rounded-lg max-h-64 overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white">
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-12">✓</TableHead>
                                    <TableHead>Chapa</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Cód. Função</TableHead>
                                    <TableHead>Cód. Seção</TableHead>
                                    <TableHead>EPIs</TableHead>
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
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {Math.floor(Math.random() * 5) + 1} EPIs
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
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
                                        ✕
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
