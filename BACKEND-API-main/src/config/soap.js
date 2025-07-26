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
    GRUPOS_EPI: '00.002',
    CATALOGO_EPI: '00.003',
    COLABORADORES: '00.004',
    CONSULTA_GENERICA: '00.001'
};

/**
 * Parâmetros padrão para diferentes tipos de consulta
 */
const defaultParameters = {
    GRUPOS_EPI: 'COLIGADA=1',
    CATALOGO_EPI: 'COLIGADA=1; CODGRUPO=001',
    COLABORADORES: 'COLIGADA=1',
    CONSULTA_GENERICA: 'COLIGADA=1'
};

module.exports = {
    soapConfig,
    soapQueries,
    defaultParameters
}; 