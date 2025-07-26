const axios = require('axios');
const xml2js = require('xml2js');
const { soapConfig } = require('../config/soap');

/**
 * Cliente SOAP para comunicação com o sistema TOTVS
 */
class SoapClient {

    /**
     * Constrói o XML SOAP para uma consulta
     * @param {string} codSentenca - Código da sentença SQL
     * @param {string} codColigada - Código da coligada
     * @param {string} codSistema - Código do sistema
     * @param {string} parameters - Parâmetros da consulta
     * @returns {string} XML SOAP formatado
     */
    static buildSoapXml(codSentenca, codColigada = '0', codSistema = 'V', parameters = '') {
        return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tot="http://www.totvs.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <tot:RealizarConsultaSQL>
         <tot:codSentenca>${codSentenca}</tot:codSentenca>
         <tot:codColigada>${codColigada}</tot:codColigada>
         <tot:codSistema>${codSistema}</tot:codSistema>
         <tot:parameters>${parameters}</tot:parameters>
      </tot:RealizarConsultaSQL>
   </soapenv:Body>
</soapenv:Envelope>`;
    }

    /**
     * Executa uma consulta SOAP
     * @param {string} codSentenca - Código da sentença SQL
     * @param {string} codColigada - Código da coligada
     * @param {string} codSistema - Código do sistema
     * @param {string} parameters - Parâmetros da consulta
     * @returns {Promise<Object>} Resultado da consulta
     */
    static async executeQuery(codSentenca, codColigada = '0', codSistema = 'V', parameters = '') {
        const xml = this.buildSoapXml(codSentenca, codColigada, codSistema, parameters);

        console.log(`🔍 Executando consulta SOAP - Sentença: ${codSentenca}, Parâmetros: ${parameters}`);

        try {
            const response = await axios.post(soapConfig.url, xml, {
                headers: soapConfig.headers,
                auth: soapConfig.auth,
                timeout: soapConfig.timeout,
                httpsAgent: soapConfig.httpsAgent
            });

            console.log(`✅ Consulta executada com sucesso - Status: ${response.status}`);

            // Verificar se a resposta está vazia
            if (!response.data || response.data.trim() === '') {
                throw new Error('Resposta vazia do servidor SOAP');
            }

            return await this.parseResponse(response.data);

        } catch (error) {
            console.error(`❌ Erro na consulta SOAP:`, error.message);
            throw error;
        }
    }

    /**
     * Faz o parse da resposta XML do SOAP
     * @param {string} xmlData - Dados XML da resposta
     * @returns {Promise<Object>} Dados parseados
     */
    static async parseResponse(xmlData) {
        return new Promise((resolve, reject) => {
            xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
                if (err) {
                    console.error('❌ Erro ao parsear XML da resposta:', err);
                    reject(new Error('Erro ao parsear resposta XML'));
                    return;
                }

                try {
                    // Extrair RealizarConsultaSQLResult
                    const soapResult = result['s:Envelope']['s:Body']['RealizarConsultaSQLResponse']['RealizarConsultaSQLResult'];

                    if (!soapResult) {
                        console.warn('⚠️ Estrutura de resposta SOAP inesperada');
                        resolve({ success: false, data: result });
                        return;
                    }

                    // Parse do XML interno (NewDataSet)
                    xml2js.parseString(soapResult, { explicitArray: false }, (cdataErr, cdataResult) => {
                        if (cdataErr) {
                            console.error('❌ Erro ao parsear XML interno:', cdataErr);
                            resolve({ success: false, rawResult: soapResult });
                            return;
                        }

                        if (cdataResult.NewDataSet && cdataResult.NewDataSet.Resultado) {
                            // Garantir que o resultado seja sempre um array
                            const data = Array.isArray(cdataResult.NewDataSet.Resultado)
                                ? cdataResult.NewDataSet.Resultado
                                : [cdataResult.NewDataSet.Resultado];

                            console.log(`📋 ${data.length} registro(s) encontrado(s)`);

                            resolve({
                                success: true,
                                data: data,
                                total: data.length
                            });
                        } else {
                            console.log('📝 Retornando resultado parseado sem NewDataSet');
                            resolve({
                                success: true,
                                data: cdataResult,
                                total: 1
                            });
                        }
                    });

                } catch (parseError) {
                    console.error('❌ Erro ao extrair resultado:', parseError);
                    resolve({
                        success: false,
                        data: result,
                        error: parseError.message
                    });
                }
            });
        });
    }

    /**
     * Testa a conectividade com o servidor SOAP
     * @returns {Promise<boolean>} True se conectividade OK
     */
    static async testConnection() {
        try {
            console.log('🔌 Testando conectividade SOAP...');

            // Usar uma consulta simples para testar
            const result = await this.executeQuery('00.001', '0', 'V', 'COLIGADA=1');

            console.log('✅ Conectividade SOAP OK');
            return true;

        } catch (error) {
            console.error('❌ Falha na conectividade SOAP:', error.message);
            return false;
        }
    }
}

module.exports = SoapClient; 