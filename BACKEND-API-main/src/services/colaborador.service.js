const SoapClient = require('../utils/soap-client');
const { soapQueries, defaultParameters } = require('../config/soap');

/**
 * Serviço para gerenciar colaboradores
 */
class ColaboradorService {

    /**
     * Busca todos os colaboradores
     * @param {Object} filters - Filtros opcionais
     * @returns {Promise<Object>} Lista de colaboradores
     */
    static async buscarColaboradores(filters = {}) {
        try {
            console.log('👥 Buscando colaboradores...');

            // Construir parâmetros baseado nos filtros
            let parameters = defaultParameters.COLABORADORES;

            if (filters.coligada) {
                parameters = `COLIGADA=${filters.coligada}`;
            }

            const result = await SoapClient.executeQuery(
                soapQueries.COLABORADORES,
                '0',
                'V',
                parameters
            );

            if (!result.success) {
                throw new Error('Falha ao consultar colaboradores');
            }

            return {
                success: true,
                totalColaboradores: result.total,
                colaboradores: result.data
            };

        } catch (error) {
            console.error('❌ Erro no serviço de colaboradores:', error.message);
            throw error;
        }
    }

    /**
     * Busca um colaborador específico por chapa
     * @param {string} chapa - Chapa do colaborador
     * @returns {Promise<Object>} Dados do colaborador
     */
    static async buscarColaboradorPorChapa(chapa) {
        try {
            console.log(`👤 Buscando colaborador por chapa: ${chapa}`);

            const parameters = `COLIGADA=1; CHAPA=${chapa}`;

            const result = await SoapClient.executeQuery(
                soapQueries.COLABORADORES,
                '0',
                'V',
                parameters
            );

            if (!result.success || result.data.length === 0) {
                return {
                    success: false,
                    message: 'Colaborador não encontrado'
                };
            }

            return {
                success: true,
                colaborador: result.data[0]
            };

        } catch (error) {
            console.error('❌ Erro ao buscar colaborador por chapa:', error.message);
            throw error;
        }
    }

    /**
     * Valida se um colaborador existe e está ativo
     * @param {string} chapa - Chapa do colaborador
     * @returns {Promise<boolean>} True se colaborador existe e está ativo
     */
    static async validarColaborador(chapa) {
        try {
            const result = await this.buscarColaboradorPorChapa(chapa);

            if (!result.success) {
                return false;
            }

            // Verificar se o colaborador está ativo (se campo existir)
            const colaborador = result.colaborador;
            if (colaborador.ATIVO !== undefined) {
                return colaborador.ATIVO === true || colaborador.ATIVO === '1' || colaborador.ATIVO === 'S';
            }

            // Se não há campo ATIVO, considerar como ativo
            return true;

        } catch (error) {
            console.error('❌ Erro ao validar colaborador:', error.message);
            return false;
        }
    }

    /**
     * Busca colaboradores por função
     * @param {string} codFuncao - Código da função
     * @returns {Promise<Object>} Lista de colaboradores da função
     */
    static async buscarColaboradoresPorFuncao(codFuncao) {
        try {
            console.log(`🔍 Buscando colaboradores da função: ${codFuncao}`);

            const parameters = `COLIGADA=1; CODFUNCAO=${codFuncao}`;

            const result = await SoapClient.executeQuery(
                soapQueries.COLABORADORES,
                '0',
                'V',
                parameters
            );

            if (!result.success) {
                throw new Error('Falha ao consultar colaboradores por função');
            }

            return {
                success: true,
                totalColaboradores: result.total,
                colaboradores: result.data,
                codigoFuncao: codFuncao
            };

        } catch (error) {
            console.error('❌ Erro ao buscar colaboradores por função:', error.message);
            throw error;
        }
    }

    /**
     * Busca colaboradores por seção
     * @param {string} codSecao - Código da seção
     * @returns {Promise<Object>} Lista de colaboradores da seção
     */
    static async buscarColaboradoresPorSecao(codSecao) {
        try {
            console.log(`🏢 Buscando colaboradores da seção: ${codSecao}`);

            const parameters = `COLIGADA=1; CODSECAO=${codSecao}`;

            const result = await SoapClient.executeQuery(
                soapQueries.COLABORADORES,
                '0',
                'V',
                parameters
            );

            if (!result.success) {
                throw new Error('Falha ao consultar colaboradores por seção');
            }

            return {
                success: true,
                totalColaboradores: result.total,
                colaboradores: result.data,
                codigoSecao: codSecao
            };

        } catch (error) {
            console.error('❌ Erro ao buscar colaboradores por seção:', error.message);
            throw error;
        }
    }
}

module.exports = ColaboradorService; 