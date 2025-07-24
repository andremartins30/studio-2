'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { useNotification } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, UserMinus, AlertTriangle } from 'lucide-react';
import { Employee } from '@/types/epi';

// Mock data - funcionários com EPIs para descarte
const mockEmployeesWithEpis: Employee[] = [
    {
        id: '1',
        matricula: '00005',
        nome: 'LAERCI PEREIRA',
        codigoFuncao: '01263',
        codigoSecao: '1.01.01.0'
    },
    {
        id: '2',
        matricula: '00012',
        nome: 'MARIA SILVA SANTOS',
        codigoFuncao: '01264',
        codigoSecao: '1.01.02.0'
    },
    {
        id: '3',
        matricula: '00023',
        nome: 'JOÃO CARLOS OLIVEIRA',
        codigoFuncao: '01265',
        codigoSecao: '1.01.03.0'
    },
    {
        id: '4',
        matricula: '00034',
        nome: 'ANA BEATRIZ COSTA',
        codigoFuncao: '01266',
        codigoSecao: '1.01.04.0'
    },
    {
        id: '5',
        matricula: '00045',
        nome: 'PEDRO HENRIQUE LIMA',
        codigoFuncao: '01267',
        codigoSecao: '1.01.05.0'
    }
];

export default function DescarteEmployeeSelection() {
    const { state, updateState, nextStep, prevStep } = useWizard();
    const { addNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployeesWithEpis);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const filtered = mockEmployeesWithEpis.filter(employee =>
            employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.matricula.includes(searchTerm) ||
            employee.codigoFuncao.includes(searchTerm) ||
            employee.codigoSecao.includes(searchTerm)
        );
        setFilteredEmployees(filtered);
        setCurrentPage(1);
    }, [searchTerm]);

    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const isEmployeeSelected = (employee: Employee) => {
        return state.selectedEmployees.some(emp => emp.id === employee.id);
    };

    const handleEmployeeToggle = (employee: Employee) => {
        const isSelected = isEmployeeSelected(employee);
        let newSelectedEmployees;

        if (isSelected) {
            newSelectedEmployees = state.selectedEmployees.filter(emp => emp.id !== employee.id);
            addNotification({
                type: 'info',
                title: 'Funcionário Removido',
                message: `${employee.nome} foi removido da seleção`,
            });
        } else {
            newSelectedEmployees = [...state.selectedEmployees, employee];
            addNotification({
                type: 'success',
                title: 'Funcionário Adicionado',
                message: `${employee.nome} foi adicionado para descarte de EPIs`,
            });
        }

        updateState({ selectedEmployees: newSelectedEmployees });
    };

    const handleNext = () => {
        if (state.selectedEmployees.length === 0) {
            addNotification({
                type: 'error',
                title: 'Seleção Obrigatória',
                message: 'Selecione pelo menos um funcionário para continuar',
            });
            return;
        }

        addNotification({
            type: 'success',
            title: 'Funcionários Selecionados',
            message: `${state.selectedEmployees.length} funcionário(s) selecionado(s) para descarte`,
        });
        nextStep();
    };

    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
            <div className="flex items-center gap-4 sticky top-0 bg-white z-10 pb-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Buscar por nome, matrícula, função ou seção..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Badge variant="secondary" className="whitespace-nowrap">
                    {state.selectedEmployees.length} selecionado(s)
                </Badge>
            </div>

            {/* Alerta informativo */}
            <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-orange-800">Atenção - Descarte de EPIs</h4>
                            <p className="text-sm text-orange-700 mt-1">
                                Apenas funcionários com EPIs vencidos, danificados ou em situação de descarte 
                                aparecem nesta lista. O descarte é irreversível.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Funcionários Disponíveis para Descarte</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ação</TableHead>
                                <TableHead>Chapa</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Cód. Função</TableHead>
                                <TableHead>Cód. Seção</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedEmployees.map((employee) => {
                                const selected = isEmployeeSelected(employee);
                                return (
                                    <TableRow key={employee.id} className={selected ? 'bg-orange-50' : ''}>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant={selected ? "destructive" : "default"}
                                                onClick={() => handleEmployeeToggle(employee)}
                                                className="flex items-center gap-1"
                                            >
                                                {selected ? (
                                                    <>
                                                        <UserMinus className="h-3 w-3" />
                                                        Remover
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className="h-3 w-3" />
                                                        Adicionar
                                                    </>
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{employee.matricula}</TableCell>
                                        <TableCell className="font-medium">{employee.nome}</TableCell>
                                        <TableCell className="font-mono text-sm">{employee.codigoFuncao}</TableCell>
                                        <TableCell className="font-mono text-sm">{employee.codigoSecao}</TableCell>
                                        <TableCell>
                                            <Badge variant="destructive" className="text-xs">
                                                EPIs p/ Descarte
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-gray-500">
                                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                                {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} de{' '}
                                {filteredEmployees.length} funcionário(s)
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>
                                <span className="flex items-center px-3 text-sm">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Próxima
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

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
