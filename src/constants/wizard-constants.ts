/**
 * Constantes e textos padronizados para o sistema EPI Wizard
 * Centraliza todos os textos, configurações e valores padrão
 */

// === TEXTOS DA INTERFACE ===
export const UI_TEXTS = {
    // Títulos dos wizards
    wizardTitles: {
        fornecimento: 'Assistente para Fornecimento Automático',
        devolucao: 'Assistente para Devolução de EPIs',
        descarte: 'Assistente para Descarte de EPIs',
        cancelamento: 'Assistente para Cancelamento de EPIs'
    },

    // Botões de navegação
    navigation: {
        cancel: 'Cancelar',
        back: '← Voltar',
        next: 'Avançar →',
        finish: 'Finalizar',
        previous: 'Anterior',
        continue: 'Continuar',
        save: 'Salvar',
        confirm: 'Confirmar'
    },

    // Mensagens de validação
    validation: {
        required: 'Este campo é obrigatório',
        selectAtLeastOne: 'Selecione pelo menos um item',
        invalidFormat: 'Formato inválido',
        confirmRequired: 'É obrigatório confirmar para continuar',
        success: 'Configurações válidas. Você pode prosseguir.',
        noEmployeesSelected: 'Selecione pelo menos um funcionário',
        noEpisSelected: 'Selecione pelo menos um EPI',
        noActionsConfigured: 'Configure pelo menos uma ação',
        reasonRequired: 'Motivo é obrigatório',
        reasonTooShort: 'Motivo deve ter pelo menos 10 caracteres',
        dateRequired: 'Data é obrigatória'
    },

    // Status e estados
    status: {
        pending: 'Pendente',
        inProgress: 'Em Andamento',
        completed: 'Concluído',
        cancelled: 'Cancelado',
        error: 'Erro',
        warning: 'Atenção',
        success: 'Sucesso',
        valid: 'Válido',
        invalid: 'Inválido'
    },

    // Ações e operações
    actions: {
        add: 'Adicionar',
        remove: 'Remover',
        edit: 'Editar',
        delete: 'Excluir',
        select: 'Selecionar',
        deselect: 'Desmarcar',
        selectAll: 'Selecionar Todos',
        deselectAll: 'Desmarcar Todos',
        configure: 'Configurar',
        reset: 'Resetar',
        clear: 'Limpar'
    },

    // Mensagens informativas
    info: {
        stepOf: (current: number, total: number) => `Passo ${current} de ${total}`,
        itemsSelected: (count: number) => `${count} item(ns) selecionado(s)`,
        employeesSelected: (count: number) => `${count} funcionário(s) selecionado(s)`,
        processing: 'Processando...',
        loading: 'Carregando...',
        noDataAvailable: 'Nenhum dado disponível',
        operationComplete: 'Operação concluída com sucesso',
        irreversibleAction: 'Esta ação é irreversível'
    }
} as const;

// === CONFIGURAÇÕES DE FORMULÁRIO ===
export const FORM_CONFIG = {
    // Tipos de operação
    operationTypes: [
        { value: 'fornecimento', label: 'Fornecimento', description: 'Empréstimo de EPIs' },
        { value: 'devolucao', label: 'Devolução', description: 'Retorno de EPIs emprestados' },
        { value: 'descarte', label: 'Descarte', description: 'Descarte de EPIs' },
        { value: 'cancelamento', label: 'Cancelamento', description: 'Cancelamento de empréstimos de EPIs' }
    ],

    // Destinos
    destinations: [
        { value: 'funcionarios', label: 'Apenas Funcionários', description: 'Para funcionários específicos' },
        { value: 'funcionariosComRisco', label: 'Funcionários com Exposição a Riscos', description: 'Apenas funcionários expostos a riscos' },
        { value: 'qualquerPessoa', label: 'Qualquer Pessoa', description: 'Para qualquer pessoa' },
        { value: 'localTrabalho', label: 'Local de Trabalho', description: 'Para local específico' }
    ],

    // Considerações de data
    dateConsiderations: [
        { value: 'livre', label: 'Livre', description: 'Sem restrição de data' },
        { value: 'admissao', label: 'Admissão', description: 'Baseado na data de admissão' },
        { value: 'ultimaMudanca', label: 'Última Mudança', description: 'Baseado na última mudança' }
    ],

    // Motivos de devolução padrão
    devolutionReasons: [
        'EPI com defeito',
        'EPI danificado',
        'Fim do contrato',
        'Mudança de função',
        'Troca por novo',
        'Vencimento do prazo',
        'Outro motivo'
    ],

    // Motivos de descarte padrão
    discardReasons: [
        'EPI vencido',
        'EPI danificado',
        'Desgaste normal',
        'Defeito de fabricação',
        'Contaminação',
        'Perda/Extravio',
        'Outro motivo'
    ],

    // Motivos de cancelamento padrão
    cancellationReasons: [
        'Funcionário desligado',
        'Mudança de função',
        'Transferência de setor',
        'EPI desnecessário',
        'Mudança de riscos da função',
        'Restruturação organizacional',
        'Outros'
    ]
} as const;

// === CONFIGURAÇÕES DE TEMA ===
export const THEME_CONFIG = {
    colors: {
        primary: 'hsl(202, 46%, 12%)', // Azul escuro
        secondary: 'hsl(27, 79%, 54%)', // Laranja
        success: 'hsl(142, 76%, 36%)', // Verde
        warning: 'hsl(38, 92%, 50%)', // Amarelo
        error: 'hsl(0, 84%, 60%)', // Vermelho
        info: 'hsl(221, 83%, 53%)' // Azul
    },

    spacing: {
        stepPadding: 'p-4',
        cardPadding: 'p-6',
        sectionSpacing: 'space-y-4',
        buttonSpacing: 'gap-2'
    },

    borderRadius: {
        card: 'rounded-lg',
        button: 'rounded-md',
        input: 'rounded-md'
    }
} as const;

// === CONFIGURAÇÕES DE COMPORTAMENTO ===
export const BEHAVIOR_CONFIG = {
    // Animações
    animations: {
        transitionDuration: 300,
        fadeInDuration: 200,
        slideInDuration: 250
    },

    // Limites
    limits: {
        maxEmployeesPerPage: 50,
        maxEpisPerPage: 20,
        minReasonLength: 10,
        maxReasonLength: 500,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        debounceDelay: 300
    },

    // Comportamentos padrão
    defaults: {
        generateReport: false,
        confirmValidation: false,
        considerTransferDate: false,
        autoAdvance: false,
        showValidationErrors: true,
        enableKeyboardNavigation: true
    }
} as const;

// === CONFIGURAÇÕES DE API ===
export const API_CONFIG = {
    endpoints: {
        employees: '/api/funcionarios',
        epis: '/api/epis',
        loans: '/api/emprestimos',
        devolutions: '/api/devolucoes',
        discards: '/api/descartes',
        reports: '/api/relatorios'
    },

    timeouts: {
        default: 30000, // 30 segundos
        upload: 60000, // 60 segundos
        report: 120000 // 2 minutos
    },

    retries: {
        maxAttempts: 3,
        backoffDelay: 1000
    }
} as const;

// === CONFIGURAÇÕES DE VALIDAÇÃO ===
export const VALIDATION_CONFIG = {
    patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        matricula: /^[A-Z0-9]+$/,
        codigoEpi: /^[A-Z0-9-]+$/
    },

    lengths: {
        minReasonLength: 10,
        maxReasonLength: 500,
        maxNameLength: 100,
        maxDescriptionLength: 255
    },

    required: {
        parameters: ['tipoOperacao', 'destino'],
        employees: ['selectedEmployees'],
        epis: ['selectedEpis'],
        actions: ['loanActions'],
        devolution: ['motivoDevolucao'],
        discard: ['motivoDescarte', 'dataDescarte']
    }
} as const;

// === MENSAGENS DE NOTIFICAÇÃO ===
export const NOTIFICATION_MESSAGES = {
    success: {
        parametersConfigured: 'Parâmetros configurados com sucesso',
        employeesSelected: 'Funcionários selecionados com sucesso',
        episSelected: 'EPIs selecionados com sucesso',
        actionsConfigured: 'Ações configuradas com sucesso',
        operationCompleted: 'Operação concluída com sucesso',
        reportGenerated: 'Relatório gerado com sucesso'
    },

    error: {
        invalidParameters: 'Parâmetros inválidos',
        noEmployeesSelected: 'Nenhum funcionário selecionado',
        noEpisSelected: 'Nenhum EPI selecionado',
        noActionsConfigured: 'Nenhuma ação configurada',
        validationRequired: 'Validação obrigatória',
        operationFailed: 'Falha na operação',
        networkError: 'Erro de conexão',
        serverError: 'Erro no servidor'
    },

    warning: {
        unsavedChanges: 'Existem alterações não salvas',
        irreversibleAction: 'Esta ação não pode ser desfeita',
        dataWillBeLost: 'Os dados serão perdidos',
        confirmBeforeProceeding: 'Confirme antes de prosseguir'
    },

    info: {
        loadingData: 'Carregando dados...',
        processingRequest: 'Processando solicitação...',
        savingChanges: 'Salvando alterações...',
        generatingReport: 'Gerando relatório...'
    }
} as const;

// === CONFIGURAÇÕES DE ACESSIBILIDADE ===
export const ACCESSIBILITY_CONFIG = {
    ariaLabels: {
        wizardNavigation: 'Navegação do assistente',
        stepProgress: 'Progresso do passo',
        employeeList: 'Lista de funcionários',
        epiList: 'Lista de EPIs',
        actionsList: 'Lista de ações',
        validationErrors: 'Erros de validação',
        navigationButtons: 'Botões de navegação'
    },

    keyboardShortcuts: {
        nextStep: 'Alt+Right',
        prevStep: 'Alt+Left',
        save: 'Ctrl+S',
        cancel: 'Escape',
        selectAll: 'Ctrl+A'
    }
} as const;

// === FUNÇÕES UTILITÁRIAS ===
export const UTILS = {
    formatters: {
        stepTitle: (step: number, total: number) => `Passo ${step} de ${total}`,
        itemCount: (count: number, singular: string, plural: string) =>
            `${count} ${count === 1 ? singular : plural}`,
        percentage: (value: number, total: number) =>
            `${Math.round((value / total) * 100)}%`,
        date: (date: Date | string) =>
            new Date(date).toLocaleDateString('pt-BR')
    },

    validators: {
        isEmpty: (value: any) => !value || value.length === 0,
        isValidEmail: (email: string) => VALIDATION_CONFIG.patterns.email.test(email),
        isValidCpf: (cpf: string) => VALIDATION_CONFIG.patterns.cpf.test(cpf),
        hasMinLength: (value: string, min: number) => value.length >= min
    }
} as const; 