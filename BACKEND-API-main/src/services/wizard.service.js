const SoapClient = require('../utils/soap-client');
const { soapQueries, defaultParameters, wizardActions, epistatusTypes, motivosDescarte } = require('../config/soap');

/**
 * Serviço para gerenciar ações do wizard EPI
 * Incluindo: Fornecimento, Devolução, Descarte e Cancelamento
 */
class WizardService {

    /**
     * === FORNECIMENTO/EMPRÉSTIMO DE EPIs ===
     */

    /**
     * Realiza o fornecimento/empréstimo de EPIs para um funcionário
     * @param {Object} dados - Dados do fornecimento
     * @param {string} dados.chapa - Chapa do funcionário
     * @param {Array} dados.epis - Lista de EPIs a serem fornecidos
     * @param {string} dados.observacao - Observação opcional
     * @returns {Promise<Object>} Resultado do fornecimento
     */
    static async fornecerEpis(dados) {
        try {
            console.log('🎯 Iniciando fornecimento de EPIs...');
            console.log('Dados:', JSON.stringify(dados, null, 2));

            const { chapa, epis, observacao } = dados;

            if (!chapa || !epis || !Array.isArray(epis) || epis.length === 0) {
                throw new Error('Chapa do funcionário e lista de EPIs são obrigatórios');
            }

            const resultados = [];
            let totalSucesso = 0;
            let totalErros = 0;

            // Processar cada EPI individualmente
            for (const epi of epis) {
                try {
                    const { codepi, quantidade = 1, lote } = epi;

                    if (!codepi) {
                        throw new Error('Código do EPI é obrigatório');
                    }

                    // Construir parâmetros para o SOAP
                    let parameters = defaultParameters.FORNECIMENTO_EPI
                        .replace('{CHAPA}', chapa)
                        .replace('{CODEPI}', codepi)
                        .replace('{QUANTIDADE}', quantidade);

                    if (lote) {
                        parameters += `; LOTE=${lote}`;
                    }
                    if (observacao) {
                        parameters += `; OBSERVACAO=${observacao}`;
                    }

                    console.log(`🛡️ Fornecendo EPI ${codepi} para funcionário ${chapa}`);

                    const result = await SoapClient.executeQuery(
                        soapQueries.FORNECIMENTO_EPI,
                        '0',
                        'V',
                        parameters
                    );

                    if (result.success) {
                        resultados.push({
                            codepi,
                            quantidade,
                            status: 'sucesso',
                            data: result.data
                        });
                        totalSucesso++;
                        console.log(`✅ EPI ${codepi} fornecido com sucesso`);
                    } else {
                        throw new Error(`Falha no fornecimento: ${result.error}`);
                    }

                } catch (error) {
                    console.error(`❌ Erro ao fornecer EPI ${epi.codepi}:`, error.message);
                    resultados.push({
                        codepi: epi.codepi,
                        quantidade: epi.quantidade,
                        status: 'erro',
                        erro: error.message
                    });
                    totalErros++;
                }
            }

            return {
                success: totalSucesso > 0,
                acao: wizardActions.FORNECIMENTO,
                chapa,
                totalEpis: epis.length,
                totalSucesso,
                totalErros,
                resultados,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Erro no fornecimento de EPIs:', error.message);
            throw error;
        }
    }

    /**
     * === DEVOLUÇÃO DE EPIs ===
     */

    /**
     * Realiza a devolução de EPIs de um funcionário
     * @param {Object} dados - Dados da devolução
     * @param {string} dados.chapa - Chapa do funcionário
     * @param {Array} dados.epis - Lista de EPIs a serem devolvidos
     * @param {string} dados.motivo - Motivo da devolução
     * @returns {Promise<Object>} Resultado da devolução
     */
    static async devolverEpis(dados) {
        try {
            console.log('🔄 Iniciando devolução de EPIs...');
            console.log('Dados:', JSON.stringify(dados, null, 2));

            const { chapa, epis, motivo } = dados;

            if (!chapa || !epis || !Array.isArray(epis) || epis.length === 0) {
                throw new Error('Chapa do funcionário e lista de EPIs são obrigatórios');
            }

            const resultados = [];
            let totalSucesso = 0;
            let totalErros = 0;

            // Processar cada EPI individualmente
            for (const epi of epis) {
                try {
                    const { codidentepi, observacao } = epi;

                    if (!codidentepi) {
                        throw new Error('Código de identificação do EPI é obrigatório');
                    }

                    // Construir parâmetros para o SOAP
                    let parameters = defaultParameters.DEVOLUCAO_EPI
                        .replace('{CHAPA}', chapa)
                        .replace('{CODIDENTEPI}', codidentepi);

                    if (motivo) {
                        parameters += `; MOTIVO=${motivo}`;
                    }
                    if (observacao) {
                        parameters += `; OBSERVACAO=${observacao}`;
                    }

                    console.log(`🔄 Devolvendo EPI ${codidentepi} do funcionário ${chapa}`);

                    const result = await SoapClient.executeQuery(
                        soapQueries.DEVOLUCAO_EPI,
                        '0',
                        'V',
                        parameters
                    );

                    if (result.success) {
                        resultados.push({
                            codidentepi,
                            status: 'sucesso',
                            data: result.data
                        });
                        totalSucesso++;
                        console.log(`✅ EPI ${codidentepi} devolvido com sucesso`);
                    } else {
                        throw new Error(`Falha na devolução: ${result.error}`);
                    }

                } catch (error) {
                    console.error(`❌ Erro ao devolver EPI ${epi.codidentepi}:`, error.message);
                    resultados.push({
                        codidentepi: epi.codidentepi,
                        status: 'erro',
                        erro: error.message
                    });
                    totalErros++;
                }
            }

            return {
                success: totalSucesso > 0,
                acao: wizardActions.DEVOLUCAO,
                chapa,
                motivo,
                totalEpis: epis.length,
                totalSucesso,
                totalErros,
                resultados,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Erro na devolução de EPIs:', error.message);
            throw error;
        }
    }

    /**
     * === DESCARTE DE EPIs ===
     */

    /**
     * Realiza o descarte de EPIs
     * @param {Object} dados - Dados do descarte
     * @param {string} dados.chapa - Chapa do funcionário
     * @param {Array} dados.epis - Lista de EPIs a serem descartados
     * @param {string} dados.motivo - Motivo do descarte
     * @returns {Promise<Object>} Resultado do descarte
     */
    static async descartarEpis(dados) {
        try {
            console.log('🗑️ Iniciando descarte de EPIs...');
            console.log('Dados:', JSON.stringify(dados, null, 2));

            const { chapa, epis, motivo } = dados;

            if (!chapa || !epis || !Array.isArray(epis) || epis.length === 0) {
                throw new Error('Chapa do funcionário e lista de EPIs são obrigatórios');
            }

            if (!motivo) {
                throw new Error('Motivo do descarte é obrigatório');
            }

            const resultados = [];
            let totalSucesso = 0;
            let totalErros = 0;

            // Processar cada EPI individualmente
            for (const epi of epis) {
                try {
                    const { codidentepi, observacao } = epi;

                    if (!codidentepi) {
                        throw new Error('Código de identificação do EPI é obrigatório');
                    }

                    // Construir parâmetros para o SOAP
                    let parameters = defaultParameters.DESCARTE_EPI
                        .replace('{CHAPA}', chapa)
                        .replace('{CODIDENTEPI}', codidentepi)
                        .replace('{MOTIVO}', motivo);

                    if (observacao) {
                        parameters += `; OBSERVACAO=${observacao}`;
                    }

                    console.log(`🗑️ Descartando EPI ${codidentepi} do funcionário ${chapa}`);

                    const result = await SoapClient.executeQuery(
                        soapQueries.DESCARTE_EPI,
                        '0',
                        'V',
                        parameters
                    );

                    if (result.success) {
                        resultados.push({
                            codidentepi,
                            motivo,
                            status: 'sucesso',
                            data: result.data
                        });
                        totalSucesso++;
                        console.log(`✅ EPI ${codidentepi} descartado com sucesso`);
                    } else {
                        throw new Error(`Falha no descarte: ${result.error}`);
                    }

                } catch (error) {
                    console.error(`❌ Erro ao descartar EPI ${epi.codidentepi}:`, error.message);
                    resultados.push({
                        codidentepi: epi.codidentepi,
                        motivo,
                        status: 'erro',
                        erro: error.message
                    });
                    totalErros++;
                }
            }

            return {
                success: totalSucesso > 0,
                acao: wizardActions.DESCARTE,
                chapa,
                motivo,
                totalEpis: epis.length,
                totalSucesso,
                totalErros,
                resultados,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Erro no descarte de EPIs:', error.message);
            throw error;
        }
    }

    /**
     * === CANCELAMENTO DE EPIs ===
     */

    /**
     * Realiza o cancelamento de empréstimos de EPIs
     * @param {Object} dados - Dados do cancelamento
     * @param {string} dados.chapa - Chapa do funcionário
     * @param {Array} dados.epis - Lista de EPIs a serem cancelados
     * @param {string} dados.motivo - Motivo do cancelamento
     * @returns {Promise<Object>} Resultado do cancelamento
     */
    static async cancelarEpis(dados) {
        try {
            console.log('❌ Iniciando cancelamento de EPIs...');
            console.log('Dados:', JSON.stringify(dados, null, 2));

            const { chapa, epis, motivo } = dados;

            if (!chapa || !epis || !Array.isArray(epis) || epis.length === 0) {
                throw new Error('Chapa do funcionário e lista de EPIs são obrigatórios');
            }

            const resultados = [];
            let totalSucesso = 0;
            let totalErros = 0;

            // Processar cada EPI individualmente
            for (const epi of epis) {
                try {
                    const { codidentepi, observacao } = epi;

                    if (!codidentepi) {
                        throw new Error('Código de identificação do EPI é obrigatório');
                    }

                    // Construir parâmetros para o SOAP
                    let parameters = defaultParameters.CANCELAMENTO_EPI
                        .replace('{CHAPA}', chapa)
                        .replace('{CODIDENTEPI}', codidentepi);

                    if (motivo) {
                        parameters += `; MOTIVO=${motivo}`;
                    }
                    if (observacao) {
                        parameters += `; OBSERVACAO=${observacao}`;
                    }

                    console.log(`❌ Cancelando EPI ${codidentepi} do funcionário ${chapa}`);

                    const result = await SoapClient.executeQuery(
                        soapQueries.CANCELAMENTO_EPI,
                        '0',
                        'V',
                        parameters
                    );

                    if (result.success) {
                        resultados.push({
                            codidentepi,
                            status: 'sucesso',
                            data: result.data
                        });
                        totalSucesso++;
                        console.log(`✅ EPI ${codidentepi} cancelado com sucesso`);
                    } else {
                        throw new Error(`Falha no cancelamento: ${result.error}`);
                    }

                } catch (error) {
                    console.error(`❌ Erro ao cancelar EPI ${epi.codidentepi}:`, error.message);
                    resultados.push({
                        codidentepi: epi.codidentepi,
                        status: 'erro',
                        erro: error.message
                    });
                    totalErros++;
                }
            }

            return {
                success: totalSucesso > 0,
                acao: wizardActions.CANCELAMENTO,
                chapa,
                motivo,
                totalEpis: epis.length,
                totalSucesso,
                totalErros,
                resultados,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Erro no cancelamento de EPIs:', error.message);
            throw error;
        }
    }

    /**
     * === CONSULTAS AUXILIARES ===
     */

    /**
     * Busca EPIs emprestados de um funcionário
     * @param {string} chapa - Chapa do funcionário
     * @returns {Promise<Object>} EPIs emprestados do funcionário
     */
    static async buscarEpisEmprestados(chapa) {
        try {
            console.log(`📋 Buscando EPIs emprestados do funcionário: ${chapa}`);

            const parameters = defaultParameters.EMPRESTIMOS_FUNCIONARIO
                .replace('{CHAPA}', chapa);

            const result = await SoapClient.executeQuery(
                soapQueries.EMPRESTIMOS_FUNCIONARIO,
                '0',
                'V',
                parameters
            );

            if (!result.success) {
                throw new Error('Falha ao consultar EPIs emprestados');
            }

            return {
                success: true,
                chapa,
                totalEpis: result.total,
                episEmprestados: result.data
            };

        } catch (error) {
            console.error('❌ Erro ao buscar EPIs emprestados:', error.message);
            throw error;
        }
    }

    /**
     * Busca histórico de movimentações de um EPI
     * @param {string} codepi - Código do EPI
     * @returns {Promise<Object>} Histórico do EPI
     */
    static async buscarHistoricoEpi(codepi) {
        try {
            console.log(`📚 Buscando histórico do EPI: ${codepi}`);

            const parameters = defaultParameters.HISTORICO_EPI
                .replace('{CODEPI}', codepi);

            const result = await SoapClient.executeQuery(
                soapQueries.HISTORICO_EPI,
                '0',
                'V',
                parameters
            );

            if (!result.success) {
                throw new Error('Falha ao consultar histórico do EPI');
            }

            return {
                success: true,
                codepi,
                totalMovimentacoes: result.total,
                historico: result.data
            };

        } catch (error) {
            console.error('❌ Erro ao buscar histórico do EPI:', error.message);
            throw error;
        }
    }

    /**
     * Valida disponibilidade de um EPI para empréstimo
     * @param {string} codepi - Código do EPI
     * @param {number} quantidade - Quantidade desejada
     * @returns {Promise<Object>} Status de disponibilidade
     */
    static async validarDisponibilidadeEpi(codepi, quantidade = 1) {
        try {
            console.log(`🔍 Validando disponibilidade do EPI: ${codepi}`);

            const parameters = defaultParameters.VALIDACAO_EPI
                .replace('{CODEPI}', codepi);

            const result = await SoapClient.executeQuery(
                soapQueries.VALIDACAO_EPI,
                '0',
                'V',
                parameters
            );

            if (!result.success) {
                throw new Error('Falha ao validar disponibilidade do EPI');
            }

            const epiData = result.data[0] || {};
            const disponivel = parseInt(epiData.QUANTIDADE_DISPONIVEL || 0);
            const isDisponivel = disponivel >= quantidade;

            return {
                success: true,
                codepi,
                quantidadeDesejada: quantidade,
                quantidadeDisponivel: disponivel,
                disponivel: isDisponivel,
                epi: epiData
            };

        } catch (error) {
            console.error('❌ Erro ao validar disponibilidade do EPI:', error.message);
            throw error;
        }
    }

    /**
     * Obtém motivos de descarte disponíveis
     * @returns {Object} Lista de motivos de descarte
     */
    static getMotivosDescarte() {
        return {
            success: true,
            motivos: motivosDescarte
        };
    }

    /**
     * Obtém tipos de status de EPI
     * @returns {Object} Lista de status de EPI
     */
    static getStatusTypes() {
        return {
            success: true,
            status: epistatusTypes
        };
    }

    /**
     * Obtém ações disponíveis do wizard
     * @returns {Object} Lista de ações do wizard
     */
    static getWizardActions() {
        return {
            success: true,
            actions: wizardActions
        };
    }
}

module.exports = WizardService; 