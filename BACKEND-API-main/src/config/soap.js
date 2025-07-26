const https = require('https');

/**
 * Configurações para conexão SOAP
 */
const soapConfig = {
    // URL do servidor SOAP TOTVS
    url: 'https://orlandohenrique182744.rm.cloudtotvs.com.br:8051/wsConsultaSQL/IwsConsultaSQL',

    // Credenciais de autenticação
    auth: {
        username: '4dash',
        password: '4dash'
    },

    // Headers padrão para requisições SOAP
    headers: {
        'Content-Type': 'text/xml; charset=UTF-8',
        'SOAPAction': 'http://www.totvs.com/IwsConsultaSQL/RealizarConsultaSQL',
        'Accept': 'text/xml'
    },

    // Timeout das requisições (30 segundos)
    timeout: 30000,

    // Agente HTTPS para ignorar certificados SSL inválidos (apenas desenvolvimento)
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
};

/**
 * Códigos de sentença SQL predefinidos
 */
const soapQueries = {
    // Consultas básicas
    GRUPOS_EPI: '00.002',
    CATALOGO_EPI: '00.003',
    COLABORADORES: '00.004',
    CONSULTA_GENERICA: '00.001',

    // Ações do wizard EPI
    FORNECIMENTO_EPI: '00.005',      // Fornecimento/Empréstimo de EPIs
    DEVOLUCAO_EPI: '00.006',         // Devolução de EPIs
    DESCARTE_EPI: '00.007',          // Descarte de EPIs
    CANCELAMENTO_EPI: '00.008',      // Cancelamento de EPIs

    // Consultas auxiliares
    EMPRESTIMOS_FUNCIONARIO: '00.009', // EPIs emprestados por funcionário
    HISTORICO_EPI: '00.010',           // Histórico de movimentações de EPI
    VALIDACAO_EPI: '00.011'            // Validação de disponibilidade de EPI
};

/**
 * Parâmetros padrão para diferentes tipos de consulta
 */
const defaultParameters = {
    GRUPOS_EPI: 'COLIGADA=1',
    CATALOGO_EPI: 'COLIGADA=1; CODGRUPO=001',
    COLABORADORES: 'COLIGADA=1',
    CONSULTA_GENERICA: 'COLIGADA=1',

    // Parâmetros para ações do wizard
    FORNECIMENTO_EPI: 'COLIGADA=1; CHAPA={CHAPA}; CODEPI={CODEPI}; QUANTIDADE={QUANTIDADE}',
    DEVOLUCAO_EPI: 'COLIGADA=1; CHAPA={CHAPA}; CODIDENTEPI={CODIDENTEPI}',
    DESCARTE_EPI: 'COLIGADA=1; CHAPA={CHAPA}; CODIDENTEPI={CODIDENTEPI}; MOTIVO={MOTIVO}',
    CANCELAMENTO_EPI: 'COLIGADA=1; CHAPA={CHAPA}; CODIDENTEPI={CODIDENTEPI}',

    // Parâmetros para consultas auxiliares
    EMPRESTIMOS_FUNCIONARIO: 'COLIGADA=1; CHAPA={CHAPA}',
    HISTORICO_EPI: 'COLIGADA=1; CODEPI={CODEPI}',
    VALIDACAO_EPI: 'COLIGADA=1; CODEPI={CODEPI}'
};

/**
 * Tipos de ação do wizard EPI
 */
const wizardActions = {
    FORNECIMENTO: 'fornecimento',
    DEVOLUCAO: 'devolucao',
    DESCARTE: 'descarte',
    CANCELAMENTO: 'cancelamento'
};

/**
 * Status de empréstimo EPI
 */
const epistatusTypes = {
    EMPRESTADO: 1,
    DEVOLVIDO: 2,
    DESCARTADO: 3,
    CANCELADO: 4
};

/**
 * Motivos de descarte padrão
 */
const motivosDescarte = {
    DANIFICADO: 'Danificado/Desgastado',
    VENCIDO: 'Prazo de validade vencido',
    PERDIDO: 'Perdido pelo funcionário',
    DEFEITO: 'Defeito de fabricação',
    OUTROS: 'Outros motivos'
};

module.exports = {
    soapConfig,
    soapQueries,
    defaultParameters,
    wizardActions,
    epistatusTypes,
    motivosDescarte
}; 