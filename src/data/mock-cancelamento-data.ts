import { Employee, CancelamentoEpiItem, LoteCancelamentoFuncionario } from '@/types/epi';

/**
 * Dados mockados para funcionários com EPIs emprestados
 * Baseado na estrutura do XML TOTVS RM
 */
export const mockEmployeesWithLoans: Employee[] = [
    {
        id: '1',
        matricula: 'F001',
        nome: 'João Silva Santos',
        codigoFuncao: 'F001',
        codigoSecao: 'PROD01'
    },
    {
        id: '2',
        matricula: 'F002',
        nome: 'Maria Oliveira Costa',
        codigoFuncao: 'F002',
        codigoSecao: 'MANUT'
    },
    {
        id: '3',
        matricula: 'F003',
        nome: 'Carlos Eduardo Lima',
        codigoFuncao: 'F003',
        codigoSecao: 'QUIM'
    },
    {
        id: '4',
        matricula: 'F004',
        nome: 'Ana Paula Rodrigues',
        codigoFuncao: 'F001',
        codigoSecao: 'PROD02'
    },
    {
        id: '5',
        matricula: 'F005',
        nome: 'Pedro Henrique Alves',
        codigoFuncao: 'F004',
        codigoSecao: 'SOLDAS'
    },
    {
        id: '6',
        matricula: 'F006',
        nome: 'Fernanda Santos',
        codigoFuncao: 'F002',
        codigoSecao: 'MANUT'
    },
    {
        id: '7',
        matricula: 'F007',
        nome: 'Roberto Carlos Nunes',
        codigoFuncao: 'F005',
        codigoSecao: 'ALMOX'
    },
    {
        id: '8',
        matricula: 'F008',
        nome: 'Juliana Pereira',
        codigoFuncao: 'F003',
        codigoSecao: 'QUIM'
    }
];

/**
 * EPIs emprestados mockados baseados no padrão XML TOTVS
 * Estrutura similar aos XMLs de fornecimento mas para cancelamento
 */
export const mockLoanedEpisForCancellation: CancelamentoEpiItem[] = [
    // EPIs do João Silva Santos (F001)
    {
        id: 'emp_001',
        codigoEpi: 'EPI-001',
        idLote: 'LT001',
        nome: 'Capacete de Segurança',
        itemEpi: 'Capacete MSA branco com jugular',
        detalhe: 'CA 31469 - Capacete classe A e B',
        dataEmprestimo: '2024-01-15',
        situacao: 'emprestado',
        employeeId: '1',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_002',
        codigoEpi: 'EPI-002',
        idLote: 'LT002',
        nome: 'Botina de Segurança',
        itemEpi: 'Botina Marluvas bico de aço',
        detalhe: 'CA 38839 - Solado PU bidensidade',
        dataEmprestimo: '2024-01-15',
        situacao: 'emprestado',
        employeeId: '1',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_003',
        codigoEpi: 'EPI-003',
        idLote: 'LT003',
        nome: 'Luvas de Vaqueta',
        itemEpi: 'Luvas Danny vaqueta raspada',
        detalhe: 'CA 11077 - Proteção das mãos',
        dataEmprestimo: '2024-02-01',
        situacao: 'emprestado',
        employeeId: '1',
        acao: 'nao_cancelar'
    },

    // EPIs da Maria Oliveira Costa (F002)
    {
        id: 'emp_004',
        codigoEpi: 'EPI-001',
        idLote: 'LT001',
        nome: 'Capacete de Segurança',
        itemEpi: 'Capacete MSA branco com jugular',
        detalhe: 'CA 31469 - Capacete classe A e B',
        dataEmprestimo: '2024-01-20',
        situacao: 'emprestado',
        employeeId: '2',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_005',
        codigoEpi: 'EPI-004',
        idLote: 'LT004',
        nome: 'Óculos de Proteção',
        itemEpi: 'Óculos Kalipso incolor',
        detalhe: 'CA 11268 - Proteção contra impactos',
        dataEmprestimo: '2024-01-20',
        situacao: 'emprestado',
        employeeId: '2',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_006',
        codigoEpi: 'EPI-005',
        idLote: 'LT005',
        nome: 'Protetor Auricular',
        itemEpi: 'Protetor 3M inserção',
        detalhe: 'CA 5674 - Atenuação 25dB',
        dataEmprestimo: '2024-02-05',
        situacao: 'emprestado',
        employeeId: '2',
        acao: 'nao_cancelar'
    },

    // EPIs do Carlos Eduardo Lima (F003)
    {
        id: 'emp_007',
        codigoEpi: 'EPI-006',
        idLote: 'LT006',
        nome: 'Máscara Química',
        itemEpi: 'Respirador MSA químico',
        detalhe: 'CA 13237 - Proteção respiratória',
        dataEmprestimo: '2024-01-10',
        situacao: 'emprestado',
        employeeId: '3',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_008',
        codigoEpi: 'EPI-007',
        idLote: 'LT007',
        nome: 'Avental de PVC',
        itemEpi: 'Avental Danny impermeável',
        detalhe: 'CA 28237 - Proteção do tronco',
        dataEmprestimo: '2024-01-10',
        situacao: 'emprestado',
        employeeId: '3',
        acao: 'nao_cancelar'
    },

    // EPIs da Ana Paula Rodrigues (F004)
    {
        id: 'emp_009',
        codigoEpi: 'EPI-001',
        idLote: 'LT001',
        nome: 'Capacete de Segurança',
        itemEpi: 'Capacete MSA branco com jugular',
        detalhe: 'CA 31469 - Capacete classe A e B',
        dataEmprestimo: '2024-02-01',
        situacao: 'emprestado',
        employeeId: '4',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_010',
        codigoEpi: 'EPI-002',
        idLote: 'LT002',
        nome: 'Botina de Segurança',
        itemEpi: 'Botina Marluvas bico de aço',
        detalhe: 'CA 38839 - Solado PU bidensidade',
        dataEmprestimo: '2024-02-01',
        situacao: 'emprestado',
        employeeId: '4',
        acao: 'nao_cancelar'
    },

    // EPIs do Pedro Henrique Alves (F005)
    {
        id: 'emp_011',
        codigoEpi: 'EPI-008',
        idLote: 'LT008',
        nome: 'Máscara de Solda',
        itemEpi: 'Máscara ESAB automática',
        detalhe: 'CA 19725 - Escurecimento automático',
        dataEmprestimo: '2024-01-25',
        situacao: 'emprestado',
        employeeId: '5',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_012',
        codigoEpi: 'EPI-009',
        idLote: 'LT009',
        nome: 'Avental de Couro',
        itemEpi: 'Avental Ledan couro raspa',
        detalhe: 'CA 11075 - Proteção contra calor',
        dataEmprestimo: '2024-01-25',
        situacao: 'emprestado',
        employeeId: '5',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_013',
        codigoEpi: 'EPI-010',
        idLote: 'LT010',
        nome: 'Mangote de Couro',
        itemEpi: 'Mangote Ledan 40cm',
        detalhe: 'CA 25896 - Proteção dos braços',
        dataEmprestimo: '2024-02-10',
        situacao: 'emprestado',
        employeeId: '5',
        acao: 'nao_cancelar'
    },

    // EPIs da Fernanda Santos (F006)
    {
        id: 'emp_014',
        codigoEpi: 'EPI-004',
        idLote: 'LT004',
        nome: 'Óculos de Proteção',
        itemEpi: 'Óculos Kalipso incolor',
        detalhe: 'CA 11268 - Proteção contra impactos',
        dataEmprestimo: '2024-02-05',
        situacao: 'emprestado',
        employeeId: '6',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_015',
        codigoEpi: 'EPI-003',
        idLote: 'LT003',
        nome: 'Luvas de Vaqueta',
        itemEpi: 'Luvas Danny vaqueta raspada',
        detalhe: 'CA 11077 - Proteção das mãos',
        dataEmprestimo: '2024-02-05',
        situacao: 'emprestado',
        employeeId: '6',
        acao: 'nao_cancelar'
    },

    // EPIs do Roberto Carlos Nunes (F007)
    {
        id: 'emp_016',
        codigoEpi: 'EPI-001',
        idLote: 'LT001',
        nome: 'Capacete de Segurança',
        itemEpi: 'Capacete MSA branco com jugular',
        detalhe: 'CA 31469 - Capacete classe A e B',
        dataEmprestimo: '2024-01-30',
        situacao: 'emprestado',
        employeeId: '7',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_017',
        codigoEpi: 'EPI-011',
        idLote: 'LT011',
        nome: 'Colete Refletivo',
        itemEpi: 'Colete Plastcor laranja',
        detalhe: 'CA 31126 - Alta visibilidade',
        dataEmprestimo: '2024-01-30',
        situacao: 'emprestado',
        employeeId: '7',
        acao: 'nao_cancelar'
    },

    // EPIs da Juliana Pereira (F008)
    {
        id: 'emp_018',
        codigoEpi: 'EPI-006',
        idLote: 'LT006',
        nome: 'Máscara Química',
        itemEpi: 'Respirador MSA químico',
        detalhe: 'CA 13237 - Proteção respiratória',
        dataEmprestimo: '2024-02-08',
        situacao: 'emprestado',
        employeeId: '8',
        acao: 'nao_cancelar'
    },
    {
        id: 'emp_019',
        codigoEpi: 'EPI-012',
        idLote: 'LT012',
        nome: 'Luvas Nitrílicas',
        itemEpi: 'Luvas Supermax descartáveis',
        detalhe: 'CA 11123 - Proteção química',
        dataEmprestimo: '2024-02-08',
        situacao: 'emprestado',
        employeeId: '8',
        acao: 'nao_cancelar'
    }
];

/**
 * Lotes organizados por funcionário para cancelamento
 * Estrutura similar ao padrão usado no XML TOTVS
 */
export const mockLotesCancelamentoPorFuncionario: LoteCancelamentoFuncionario[] = [
    {
        funcionario: mockEmployeesWithLoans[0], // João Silva Santos
        itens: mockLoanedEpisForCancellation.filter(item => item.employeeId === '1'),
        expandido: false
    },
    {
        funcionario: mockEmployeesWithLoans[1], // Maria Oliveira Costa
        itens: mockLoanedEpisForCancellation.filter(item => item.employeeId === '2'),
        expandido: false
    },
    {
        funcionario: mockEmployeesWithLoans[2], // Carlos Eduardo Lima
        itens: mockLoanedEpisForCancellation.filter(item => item.employeeId === '3'),
        expandido: false
    },
    {
        funcionario: mockEmployeesWithLoans[3], // Ana Paula Rodrigues
        itens: mockLoanedEpisForCancellation.filter(item => item.employeeId === '4'),
        expandido: false
    },
    {
        funcionario: mockEmployeesWithLoans[4], // Pedro Henrique Alves
        itens: mockLoanedEpisForCancellation.filter(item => item.employeeId === '5'),
        expandido: false
    },
    {
        funcionario: mockEmployeesWithLoans[5], // Fernanda Santos
        itens: mockLoanedEpisForCancellation.filter(item => item.employeeId === '6'),
        expandido: false
    },
    {
        funcionario: mockEmployeesWithLoans[6], // Roberto Carlos Nunes
        itens: mockLoanedEpisForCancellation.filter(item => item.employeeId === '7'),
        expandido: false
    },
    {
        funcionario: mockEmployeesWithLoans[7], // Juliana Pereira
        itens: mockLoanedEpisForCancellation.filter(item => item.employeeId === '8'),
        expandido: false
    }
];

/**
 * Função para simular busca de funcionários com EPIs emprestados
 * Simula a API que se conectaria ao SOAP do TOTVS RM
 */
export const searchEmployeesWithLoans = async (searchTerm: string = ''): Promise<Employee[]> => {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!searchTerm) {
        return mockEmployeesWithLoans;
    }

    return mockEmployeesWithLoans.filter(employee =>
        employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.codigoFuncao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.codigoSecao.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

/**
 * Função para buscar EPIs emprestados por funcionário
 * Simula consulta ao XML de empréstimos do TOTVS RM
 */
export const getLoanedEpisByEmployee = async (employeeId: string): Promise<CancelamentoEpiItem[]> => {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 300));

    return mockLoanedEpisForCancellation.filter(item => item.employeeId === employeeId);
};

/**
 * Função para simular processamento do cancelamento
 * Simula chamada para API que se conecta ao SOAP do TOTVS RM
 */
export const processCancellation = async (data: {
    employees: Employee[];
    actions: CancelamentoEpiItem[];
    reason: string;
    acceptSuggestion: boolean;
    generateReport: boolean;
}): Promise<{
    success: boolean;
    cancelamentoId: string;
    processStarted: string;
    processFinished: string;
    houveCancelamento: boolean;
}> => {
    // Simula delay do processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const processStarted = new Date().toISOString();
    const processFinished = new Date(Date.now() + 2000).toISOString();

    // Simula 95% de sucesso
    const success = Math.random() > 0.05;

    if (!success) {
        throw new Error('Erro no processamento do cancelamento. Tente novamente.');
    }

    return {
        success: true,
        cancelamentoId: `CANC-${Date.now()}`,
        processStarted,
        processFinished,
        houveCancelamento: data.actions.some(action => action.acao === 'cancelar')
    };
}; 