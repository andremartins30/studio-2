// Interface para funcionários do fluxo de cancelamento de EPI
export interface Funcionario {
    chapa: string;
    nome: string;
    codigoFuncao: string;
    codigoSecao: string;
    // Campos adicionais para futura integração
    id?: number;
    ativo?: boolean;
}
