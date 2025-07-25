'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useWizard } from '@/contexts/wizard-context';
import { useNotification } from '@/contexts/notification-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { BaseStep, useStepLayout } from '@/components/base-step';
import { UI_TEXTS } from '@/constants/wizard-constants';
import { BaseStepProps, Employee } from '@/types/epi';
import { Search, Users, Plus, Minus, ChevronLeft, ChevronRight, UserCheck, AlertCircle } from 'lucide-react';
import { searchEmployeesWithLoans } from '@/data/mock-cancelamento-data';

/**
 * Componente para seleção de funcionários com EPIs emprestados para cancelamento
 * Implementa grid responsivo com filtros, busca e paginação
 */
export default function CancelamentoEmployeeSelection(props: BaseStepProps) {
    const { state, updateState } = useWizard();
    const { addNotification } = useNotification();
    const { getDefaultLayout } = useStepLayout();

    // Estados locais
    const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    /**
     * Carrega funcionários com EPIs emprestados
     */
    useEffect(() => {
        const loadEmployees = async () => {
            setLoading(true);
            try {
                const employees = await searchEmployeesWithLoans();
                setAvailableEmployees(employees);
            } catch (error) {
                addNotification({
                    type: 'error',
                    title: 'Erro ao carregar funcionários',
                    message: 'Não foi possível carregar a lista de funcionários. Tente novamente.',
                });
            } finally {
                setLoading(false);
            }
        };

        loadEmployees();
    }, [addNotification]);

    /**
     * Funcionários filtrados baseado na busca
     */
    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return availableEmployees;

        return availableEmployees.filter(employee =>
            employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.codigoFuncao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.codigoSecao.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [availableEmployees, searchTerm]);

    /**
     * Paginação
     */
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

    /**
     * Resetar página quando filtro muda
     */
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    /**
     * Adicionar funcionário à seleção
     */
    const addEmployee = (employee: Employee) => {
        const isAlreadySelected = state.selectedEmployees.some(emp => emp.id === employee.id);

        if (isAlreadySelected) {
            addNotification({
                type: 'warning',
                title: 'Funcionário já selecionado',
                message: `${employee.nome} já está na lista de selecionados.`,
            });
            return;
        }

        const updatedEmployees = [...state.selectedEmployees, employee];
        updateState({ selectedEmployees: updatedEmployees });

        addNotification({
            type: 'success',
            title: 'Funcionário adicionado',
            message: `${employee.nome} foi adicionado à seleção.`,
        });
    };

    /**
     * Remover funcionário da seleção
     */
    const removeEmployee = (employeeId: string) => {
        const employee = state.selectedEmployees.find(emp => emp.id === employeeId);
        const updatedEmployees = state.selectedEmployees.filter(emp => emp.id !== employeeId);
        updateState({ selectedEmployees: updatedEmployees });

        if (employee) {
            addNotification({
                type: 'info',
                title: 'Funcionário removido',
                message: `${employee.nome} foi removido da seleção.`,
            });
        }
    };

    /**
     * Verificar se funcionário está selecionado
     */
    const isEmployeeSelected = (employeeId: string): boolean => {
        return state.selectedEmployees.some(emp => emp.id === employeeId);
    };

    /**
     * Validação específica para seleção de funcionários
     */
    const validateEmployeeSelection = (): boolean => {
        if (state.selectedEmployees.length === 0) {
            addNotification({
                type: 'error',
                title: UI_TEXTS.status.error,
                message: 'Selecione pelo menos um funcionário para continuar.',
            });
            return false;
        }

        return true;
    };

    /**
     * Callback para avançar para definição de ações
     */
    const handleNext = () => {
        addNotification({
            type: 'success',
            title: 'Funcionários Selecionados',
            message: `${state.selectedEmployees.length} funcionário(s) selecionado(s) para cancelamento.`,
        });

        if (props.onNext) {
            props.onNext();
        }
    };

    /**
     * Configuração do layout
     */
    const stepLayout = getDefaultLayout({
        title: 'Seleção de Funcionários - Cancelamento',
        description: 'Selecione os funcionários que possuem EPIs emprestados para cancelamento',
        nextButtonLabel: 'Definir Ações →'
    });

    return (
        <BaseStep
            layout={stepLayout}
            onValidate={validateEmployeeSelection}
            onNext={handleNext}
            {...props}
        >
            <div className="space-y-6">
                {/* Informação sobre seleção */}
                <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h4 className="font-medium text-blue-800 mb-1">
                            Funcionários com EPIs Emprestados
                        </h4>
                        <p className="text-sm text-blue-700">
                            Abaixo estão listados apenas os funcionários que possuem EPIs atualmente emprestados.
                            Selecione aqueles cujos empréstimos você deseja cancelar.
                        </p>
                    </div>
                </div>

                {/* Barra de busca */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Search className="h-5 w-5 text-blue-600" />
                            Buscar Funcionários
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nome, chapa, função ou seção..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {searchTerm && (
                            <div className="mt-2 text-sm text-gray-600">
                                {filteredEmployees.length} funcionário(s) encontrado(s)
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Lista de funcionários selecionados */}
                {state.selectedEmployees.length > 0 && (
                    <Card className="bg-green-50 border-green-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-green-600" />
                                Funcionários Selecionados ({state.selectedEmployees.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-2">
                                {state.selectedEmployees.map((employee) => (
                                    <Badge
                                        key={employee.id}
                                        variant="secondary"
                                        className="flex items-center gap-2 bg-green-100 text-green-800 hover:bg-green-200"
                                    >
                                        <span>{employee.nome} ({employee.matricula})</span>
                                        <button
                                            onClick={() => removeEmployee(employee.id)}
                                            className="ml-1 hover:bg-green-300 rounded-full p-0.5"
                                            title="Remover funcionário"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Grid de funcionários */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            Funcionários Disponíveis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-gray-500">Carregando funcionários...</div>
                            </div>
                        ) : paginatedEmployees.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm ? 'Nenhum funcionário encontrado com os critérios de busca.' : 'Nenhum funcionário com EPIs emprestados.'}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {/* Cabeçalho da tabela - apenas em telas maiores */}
                                <div className="hidden md:grid md:grid-cols-5 md:gap-4 md:p-3 md:bg-gray-50 md:rounded-lg md:font-medium md:text-sm md:text-gray-700">
                                    <div>Chapa</div>
                                    <div>Nome</div>
                                    <div>Cód. Função</div>
                                    <div>Cód. Seção</div>
                                    <div>Ação</div>
                                </div>

                                {/* Linhas da tabela */}
                                {paginatedEmployees.map((employee) => {
                                    const isSelected = isEmployeeSelected(employee.id);

                                    return (
                                        <div
                                            key={employee.id}
                                            className={`p-3 border rounded-lg transition-colors ${isSelected
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'hover:bg-gray-50 border-gray-200'
                                                }`}
                                        >
                                            {/* Layout para mobile */}
                                            <div className="md:hidden space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-medium">{employee.nome}</div>
                                                        <div className="text-sm text-gray-600">
                                                            Chapa: {employee.matricula}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant={isSelected ? "secondary" : "outline"}
                                                        onClick={() => isSelected ? removeEmployee(employee.id) : addEmployee(employee)}
                                                        disabled={isSelected}
                                                    >
                                                        {isSelected ? (
                                                            <>
                                                                <UserCheck className="h-4 w-4 mr-1" />
                                                                Selecionado
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus className="h-4 w-4 mr-1" />
                                                                Adicionar
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Função: {employee.codigoFuncao} | Seção: {employee.codigoSecao}
                                                </div>
                                            </div>

                                            {/* Layout para desktop */}
                                            <div className="hidden md:grid md:grid-cols-5 md:gap-4 md:items-center">
                                                <div className="font-mono text-sm">{employee.matricula}</div>
                                                <div className="font-medium">{employee.nome}</div>
                                                <div className="text-sm">{employee.codigoFuncao}</div>
                                                <div className="text-sm">{employee.codigoSecao}</div>
                                                <div>
                                                    <Button
                                                        size="sm"
                                                        variant={isSelected ? "secondary" : "outline"}
                                                        onClick={() => isSelected ? removeEmployee(employee.id) : addEmployee(employee)}
                                                        disabled={isSelected}
                                                    >
                                                        {isSelected ? (
                                                            <>
                                                                <UserCheck className="h-4 w-4 mr-1" />
                                                                Selecionado
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus className="h-4 w-4 mr-1" />
                                                                Adicionar
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <div className="text-sm text-gray-600">
                                    Página {currentPage} de {totalPages} ({filteredEmployees.length} funcionários)
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Próxima
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </BaseStep>
    );
} 