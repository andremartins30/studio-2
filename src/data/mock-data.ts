// Mock data para demonstração do sistema de EPIs

export const mockEmployees = [
    {
        id: '1',
        matricula: '00005',
        nome: 'LAERCI PEREIRA',
        codigoFuncao: '01235',
        codigoSecao: '1.01.01.0'
    },
    {
        id: '2',
        matricula: '00123',
        nome: 'MARIA SILVA',
        codigoFuncao: '01240',
        codigoSecao: '1.01.02.0'
    },
    {
        id: '3',
        matricula: '00456',
        nome: 'JOÃO SANTOS',
        codigoFuncao: '01250',
        codigoSecao: '1.02.01.0'
    },
    {
        id: '4',
        matricula: '00789',
        nome: 'ANA COSTA',
        codigoFuncao: '01235',
        codigoSecao: '1.01.01.0'
    },
    {
        id: '5',
        matricula: '01234',
        nome: 'CARLOS OLIVEIRA',
        codigoFuncao: '01260',
        codigoSecao: '1.03.01.0'
    },
    {
        id: '6',
        matricula: '01567',
        nome: 'LUCIA FERREIRA',
        codigoFuncao: '01270',
        codigoSecao: '1.02.02.0'
    },
    {
        id: '7',
        matricula: '01890',
        nome: 'PEDRO ALMEIDA',
        codigoFuncao: '01240',
        codigoSecao: '1.01.02.0'
    },
    {
        id: '8',
        matricula: '02345',
        nome: 'FERNANDA LIMA',
        codigoFuncao: '01280',
        codigoSecao: '1.04.01.0'
    }
];

export const mockEpis = [
    {
        id: '1',
        codigoEpi: '999',
        idLote: '1',
        ca: '123',
        nome: 'Capacete de Segurança Teste',
        codigoSecao: '1.01',
        codigoFilial: 'F001',
        dataAquisicao: '14/07/2025',
        quantidade: 1,
        quantidadeDisponivel: 15,
        eficaz: true
    },
    {
        id: '2',
        codigoEpi: '1001',
        idLote: '2',
        ca: '456',
        nome: 'Óculos de Proteção',
        codigoSecao: '1.01',
        codigoFilial: 'F001',
        dataAquisicao: '10/07/2025',
        quantidade: 1,
        quantidadeDisponivel: 25,
        eficaz: true
    },
    {
        id: '3',
        codigoEpi: '1002',
        idLote: '3',
        ca: '789',
        nome: 'Luvas de Proteção',
        codigoSecao: '1.02',
        codigoFilial: 'F001',
        dataAquisicao: '12/07/2025',
        quantidade: 1,
        quantidadeDisponivel: 50,
        eficaz: true
    },
    {
        id: '4',
        codigoEpi: '1003',
        idLote: '4',
        ca: '321',
        nome: 'Botas de Segurança',
        codigoSecao: '1.03',
        codigoFilial: 'F001',
        dataAquisicao: '08/07/2025',
        quantidade: 1,
        quantidadeDisponivel: 12,
        eficaz: true
    },
    {
        id: '5',
        codigoEpi: '1004',
        idLote: '5',
        ca: '654',
        nome: 'Colete Refletivo',
        codigoSecao: '1.01',
        codigoFilial: 'F002',
        dataAquisicao: '09/07/2025',
        quantidade: 1,
        quantidadeDisponivel: 30,
        eficaz: true
    },
    {
        id: '6',
        codigoEpi: '1005',
        idLote: '6',
        ca: '987',
        nome: 'Protetor Auricular',
        codigoSecao: '1.04',
        codigoFilial: 'F001',
        dataAquisicao: '11/07/2025',
        quantidade: 1,
        quantidadeDisponivel: 40,
        eficaz: true
    },
    {
        id: '7',
        codigoEpi: '1006',
        idLote: '7',
        ca: '147',
        nome: 'Máscara PFF2',
        codigoSecao: '1.02',
        codigoFilial: 'F002',
        dataAquisicao: '13/07/2025',
        quantidade: 1,
        quantidadeDisponivel: 100,
        eficaz: true
    },
    {
        id: '8',
        codigoEpi: '1007',
        idLote: '8',
        ca: '258',
        nome: 'Cinto de Segurança',
        codigoSecao: '1.03',
        codigoFilial: 'F001',
        dataAquisicao: '15/07/2025',
        quantidade: 1,
        quantidadeDisponivel: 8,
        eficaz: true
    }
];

export const mockActions = [
    'Fornecer',
    'Devolver',
    'Substituir',
    'Cancelar',
    'Transferir',
    'Manutenção'
];

export const mockFilials = [
    { codigo: 'F001', nome: 'Filial São Paulo' },
    { codigo: 'F002', nome: 'Filial Rio de Janeiro' },
    { codigo: 'F003', nome: 'Filial Belo Horizonte' }
];

export const mockSections = [
    { codigo: '1.01.01.0', nome: 'Produção - Linha A' },
    { codigo: '1.01.02.0', nome: 'Produção - Linha B' },
    { codigo: '1.02.01.0', nome: 'Manutenção - Elétrica' },
    { codigo: '1.02.02.0', nome: 'Manutenção - Mecânica' },
    { codigo: '1.03.01.0', nome: 'Logística - Expedição' },
    { codigo: '1.04.01.0', nome: 'Administrativo' }
];

export const mockFunctions = [
    { codigo: '01235', nome: 'Operador de Produção' },
    { codigo: '01240', nome: 'Técnico de Manutenção' },
    { codigo: '01250', nome: 'Soldador' },
    { codigo: '01260', nome: 'Operador de Empilhadeira' },
    { codigo: '01270', nome: 'Eletricista' },
    { codigo: '01280', nome: 'Assistente Administrativo' }
];
