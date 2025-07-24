// Tipos para o sistema de empréstimo de EPIs

export interface Employee {
    id: string;
    matricula: string;
    nome: string;
    codigoFuncao: string;
    codigoSecao: string;
}

export interface EpiItem {
    id: string;
    codigoEpi: string;
    idLote: string;
    ca: string;
    nome: string;
    codigoSecao: string;
    codigoFilial: string;
    dataAquisicao: string;
    quantidade: number;
    quantidadeDisponivel: number;
    eficaz: boolean;
}

export interface EmprestadoEpiItem {
    id: string;
    codigoEpi: string;
    idLote: string;
    nome: string;
    itemEpi: string;
    detalhe: string;
    dataEmprestimo: string;
    dataDevolucao?: string;
    situacao: 'emprestado' | 'vencido' | 'danificado';
    employeeId: string;
    acao: 'devolver' | 'naoDevolver';
}

export interface DescarteEpiItem {
    id: string;
    situacao: 'ok' | 'com_defeito' | 'vencido';
    codigoEpi: string;
    idLote: number;
    nome: string;
    itemEpi: string;
    detalhe: string;
    dataEntrega: string;
    acao: 'descartar' | 'nao_descartar';
    dataDescarte?: string;
    employeeId: string;
}

export interface LoteFuncionario {
    funcionario: Employee;
    itens: DescarteEpiItem[];
    expandido: boolean;
}

export interface LoanAction {
    employeeId: string;
    epiId: string;
    quantidade: number;
    dataEmprestimo: string;
    dataDevolucao?: string;
    acao: string;
}

export interface WizardState {
    // Tela 1 - Parâmetros
    tipoOperacao: 'fornecimento' | 'devolucao' | 'descarte' | 'cancelamento';
    destino: 'funcionarios' | 'qualquerPessoa' | 'localTrabalho';
    gerarRelatorio: boolean;

    // Específico para devolução
    aceitoSugestaoAcao?: boolean;

    // Específico para descarte
    aceitoSugestaoDescarte?: boolean;
    dataDescarte?: string;
    lotesPorFuncionario?: LoteFuncionario[];
    motivoDescarte?: string;

    // Tela 2 - Funcionários
    selectedEmployees: Employee[];

    // Tela 3 - Lote (Fornecimento) / Ação por Lote (Devolução)
    codigoFiscal: string;
    codigoGrupoEpi: string;
    dataConsideração: 'livre' | 'admissao' | 'ultimaMudanca';
    dataLivre?: string;
    selectedEpis: EpiItem[];
    considerarDataTransferencia: boolean;

    // Tela 4 - Ações (Fornecimento) / Motivo da Devolução (Devolução)
    dataDevolucao?: string;
    acaoPadrao: string;
    loanActions: LoanAction[];
    confirmarValidacao: boolean;

    // Específico para devolução
    motivoDevolucao?: string;

    // Tela 5 - Execução
    loanId?: string;
    devolutionId?: string;
    descarteId?: string;
    processStarted?: string;
    processFinished?: string;
    success?: boolean;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5;
export type WizardFlow = 'fornecimento' | 'devolucao' | 'descarte';

export interface WizardContextType {
    currentStep: WizardStep;
    currentFlow: WizardFlow;
    state: WizardState;
    updateState: (updates: Partial<WizardState>) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: WizardStep) => void;
    resetWizard: () => void;
    switchFlow: (flow: WizardFlow) => void;
}
