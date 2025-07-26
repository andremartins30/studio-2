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

// === TIPOS PARA INTEGRAÇÃO COM API SOAP ===

// Tipos que correspondem aos dados retornados pela API SOAP
export interface ColaboradorSOAP {
    CHAPA: string;
    NOME: string;
    CODFUNCAO: string;
    CODSECAO: string;
    NOMEFUNCAO?: string;
    NOMESECAO?: string;
    ATIVO?: string | boolean;
}

export interface EpiItemSOAP {
    CODIGO: string;
    NOME: string;
    CA?: string;
    GRUPO?: string;
    TIPO?: string;
    ATIVO?: string | boolean;
    DESCRICAO?: string;
}

// === FUNÇÕES DE CONVERSÃO ===

/**
 * Converte colaborador da API SOAP para o formato usado no frontend
 */
export function convertColaboradorSOAP(colaboradorSOAP: ColaboradorSOAP): Employee {
    return {
        id: colaboradorSOAP.CHAPA, // Usando CHAPA como ID único
        matricula: colaboradorSOAP.CHAPA,
        nome: colaboradorSOAP.NOME,
        codigoFuncao: colaboradorSOAP.CODFUNCAO,
        codigoSecao: colaboradorSOAP.CODSECAO
    };
}

/**
 * Converte item EPI da API SOAP para o formato usado no frontend
 */
export function convertEpiItemSOAP(epiSOAP: EpiItemSOAP): EpiItem {
    return {
        id: epiSOAP.CODIGO, // Usando CODIGO como ID único
        codigoEpi: epiSOAP.CODIGO,
        idLote: '1', // Valor padrão - ajustar conforme necessário
        ca: epiSOAP.CA || '',
        nome: epiSOAP.NOME,
        codigoSecao: epiSOAP.GRUPO || '',
        codigoFilial: 'F001', // Valor padrão - ajustar conforme necessário
        dataAquisicao: new Date().toLocaleDateString('pt-BR'),
        quantidade: 1,
        quantidadeDisponivel: 1, // Valor padrão - ajustar conforme necessário
        eficaz: epiSOAP.ATIVO === true || epiSOAP.ATIVO === 'true' || epiSOAP.ATIVO === '1'
    };
}

// === INTERFACES EXISTENTES ===

export interface LoanAction {
    id: string;
    employeeId: string;
    employeeName: string;
    epiId: string;
    epiName: string;
    action: string;
    quantity: number;
    date: string;
    observations?: string;
}

export interface LoteFuncionario {
    funcionario: Employee;
    itens: DescarteEpiItem[];
    expandido: boolean;
}

export interface DescarteEpiItem {
    codigoEpi: string;
    nomeEpi: string;
    ca: string;
    dataEmprestimo: string;
    numeroLote: string;
    quantidade: number;
    selecionado?: boolean;
}

export interface LoteCancelamentoFuncionario {
    funcionario: Employee;
    itens: CancelamentoEpiItem[];
    expandido: boolean;
}

export interface CancelamentoEpiItem {
    codigoEpi: string;
    nomeEpi: string;
    ca: string;
    dataEmprestimo: string;
    numeroLote: string;
    quantidade: number;
    selecionado?: boolean;
    motivo?: string;
}

export interface DevolutionEpiItem {
    codigoEpi: string;
    nomeEpi: string;
    ca: string;
    dataEmprestimo: string;
    numeroLote: string;
    quantidade: number;
    selecionado?: boolean;
    motivoDevolucao?: string;
    condicaoItem?: 'bom' | 'danificado' | 'perdido';
}

export interface LoteDevolucaoFuncionario {
    funcionario: Employee;
    itens: DevolutionEpiItem[];
    expandido: boolean;
}

// === NOVAS INTERFACES PARA PADRONIZAÇÃO ===

/**
 * Interface base para todos os componentes de step
 */
export interface BaseStepProps {
    onNext?: () => void;
    onPrev?: () => void;
    onValidationChange?: (isValid: boolean) => void;
}

/**
 * Interface para validação de steps
 */
export interface StepValidation {
    isValid: boolean;
    errors?: string[];
    warnings?: string[];
}

/**
 * Interface para configuração de um step
 */
export interface StepConfig {
    id: WizardStep;
    title: string;
    description: string;
    component: React.ComponentType<BaseStepProps>;
    validate?: (state: WizardState) => StepValidation;
    canNavigateBack?: boolean;
    canNavigateForward?: (state: WizardState) => boolean;
}

/**
 * Interface para configuração de um flow completo
 */
export interface FlowConfig {
    id: WizardFlow;
    title: string;
    description: string;
    steps: StepConfig[];
    initialState?: Partial<WizardState>;
}

/**
 * Interface para configuração de botão de navegação
 */
export interface NavigationButtonConfig {
    label: string;
    variant: 'default' | 'outline' | 'secondary' | 'destructive';
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
}

/**
 * Interface para configuração da navegação de um step
 */
export interface StepNavigationConfig {
    showProgress?: boolean;
    showStepIndicator?: boolean;
    backButton?: NavigationButtonConfig;
    nextButton?: NavigationButtonConfig;
    customButtons?: NavigationButtonConfig[];
}

// === EXISTING INTERFACES ===

export interface WizardState {
    // Tela 1 - Parâmetros
    tipoOperacao: 'fornecimento' | 'devolucao' | 'descarte' | 'cancelamento';
    destino: 'funcionarios' | 'qualquerPessoa' | 'localTrabalho' | 'funcionariosComRisco';
    gerarRelatorio: boolean;

    // Específico para cancelamento
    aceitoSugestaoAcao?: boolean;

    // Específico para devolução

    // Específico para descarte
    aceitoSugestaoDescarte?: boolean;
    dataDescarte?: string;
    lotesPorFuncionario?: LoteFuncionario[];
    motivoDescarte?: string;

    // Específico para cancelamento
    lotesCancelamentoPorFuncionario?: LoteCancelamentoFuncionario[];
    motivoCancelamento?: string;
    dataCancelamento?: string;

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
    cancelamentoId?: string;
    processStarted?: string;
    processFinished?: string;
    success?: boolean;
    houveCancelamento?: boolean;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5;
export type WizardFlow = 'fornecimento' | 'devolucao' | 'descarte' | 'cancelamento';

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
    // Novas funções para validação
    validateCurrentStep: () => StepValidation;
    canNavigateToStep: (step: WizardStep) => boolean;
}
