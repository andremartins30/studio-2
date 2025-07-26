const SoapClient = require('../utils/soap-client');
const { soapQueries, defaultParameters } = require('../config/soap');

/**
 * Serviço para gerenciar EPIs e grupos de EPIs
 */
class EpiService {

    /**
     * Busca todos os grupos de EPI
     * @param {Object} filters - Filtros opcionais
     * @returns {Promise<Object>} Lista de grupos EPI
     */
    static async buscarGruposEpi(filters = {}) {
        try {
            console.log('📦 Buscando grupos EPI...');

            // Construir parâmetros baseado nos filtros
            let parameters = defaultParameters.GRUPOS_EPI;

            if (filters.coligada) {
                parameters = `COLIGADA=${filters.coligada}`;
            }

            const result = await SoapClient.executeQuery(
                soapQueries.GRUPOS_EPI,
                '0',
                'V',
                parameters
            );

            if (!result.success) {
                throw new Error('Falha ao consultar grupos EPI');
            }

            return {
                success: true,
                totalGrupos: result.total,
                gruposEPI: result.data
            };

        } catch (error) {
            console.error('❌ Erro no serviço de grupos EPI:', error.message);
            throw error;
        }
    }

    /**
     * Busca um grupo EPI específico por código
     * @param {string} codGrupo - Código do grupo EPI
     * @returns {Promise<Object>} Dados do grupo EPI
     */
    static async buscarGrupoPorCodigo(codGrupo) {
        try {
            console.log(`📦 Buscando grupo EPI por código: ${codGrupo}`);

            const parameters = `COLIGADA=1; CODGRUPOEPI=${codGrupo}`;

            const result = await SoapClient.executeQuery(
                soapQueries.GRUPOS_EPI,
                '0',
                'V',
                parameters
            );

            if (!result.success || result.data.length === 0) {
                return {
                    success: false,
                    message: 'Grupo EPI não encontrado'
                };
            }

            return {
                success: true,
                grupoEPI: result.data[0]
            };

        } catch (error) {
            console.error('❌ Erro ao buscar grupo EPI por código:', error.message);
            throw error;
        }
    }

    /**
     * Busca catálogo de EPIs
     * @param {Object} filters - Filtros opcionais
     * @returns {Promise<Object>} Lista de EPIs
     */
    static async buscarCatalogoEpi(filters = {}) {
        try {
            console.log('🛡️ Buscando catálogo EPI...', filters);

            // Construir parâmetros baseado nos filtros
            let parameters = defaultParameters.CATALOGO_EPI;

            if (filters.codGrupo) {
                parameters = `COLIGADA=1; CODGRUPO=${filters.codGrupo}`;
            } else if (filters.coligada) {
                parameters = `COLIGADA=${filters.coligada}`;
            }

            // Adicionar outros filtros se necessário
            if (filters.ativo !== undefined) {
                parameters += `; ATIVO=${filters.ativo}`;
            }

            const result = await SoapClient.executeQuery(
                soapQueries.CATALOGO_EPI,
                '0',
                'V',
                parameters
            );

            if (!result.success) {
                throw new Error('Falha ao consultar catálogo EPI');
            }

            return {
                success: true,
                totalItens: result.total,
                catalogoEPI: result.data,
                filtros: filters
            };

        } catch (error) {
            console.error('❌ Erro no serviço de catálogo EPI:', error.message);
            throw error;
        }
    }

    /**
     * Busca EPIs por grupo específico
     * @param {string} codGrupo - Código do grupo EPI
     * @param {Object} additionalFilters - Filtros adicionais
     * @returns {Promise<Object>} Lista de EPIs do grupo
     */
    static async buscarEpisPorGrupo(codGrupo, additionalFilters = {}) {
        try {
            console.log(`🔍 Buscando EPIs do grupo: ${codGrupo}`);

            const filters = {
                codGrupo: codGrupo,
                ...additionalFilters
            };

            return await this.buscarCatalogoEpi(filters);

        } catch (error) {
            console.error('❌ Erro ao buscar EPIs por grupo:', error.message);
            throw error;
        }
    }

    /**
     * Busca um EPI específico por código
     * @param {string} codEpi - Código do EPI
     * @returns {Promise<Object>} Dados do EPI
     */
    static async buscarEpiPorCodigo(codEpi) {
        try {
            console.log(`🛡️ Buscando EPI por código: ${codEpi}`);

            const parameters = `COLIGADA=1; CODIGO=${codEpi}`;

            const result = await SoapClient.executeQuery(
                soapQueries.CATALOGO_EPI,
                '0',
                'V',
                parameters
            );

            if (!result.success || result.data.length === 0) {
                return {
                    success: false,
                    message: 'EPI não encontrado'
                };
            }

            return {
                success: true,
                epi: result.data[0]
            };

        } catch (error) {
            console.error('❌ Erro ao buscar EPI por código:', error.message);
            throw error;
        }
    }

    /**
     * Busca EPIs disponíveis (ativos e com estoque)
     * @param {Object} filters - Filtros opcionais
     * @returns {Promise<Object>} Lista de EPIs disponíveis
     */
    static async buscarEpisDisponiveis(filters = {}) {
        try {
            console.log('✅ Buscando EPIs disponíveis...');

            // Garantir que busque apenas EPIs ativos
            const filtersComAtivo = {
                ...filters,
                ativo: true
            };

            const result = await this.buscarCatalogoEpi(filtersComAtivo);

            if (!result.success) {
                return result;
            }

            // Filtrar EPIs que têm estoque disponível (se campo existir)
            const episDisponiveis = result.catalogoEPI.filter(epi => {
                // Se há campo de quantidade, verificar se > 0
                if (epi.QUANTIDADE !== undefined) {
                    return parseInt(epi.QUANTIDADE) > 0;
                }

                // Se há campo de estoque, verificar se > 0
                if (epi.ESTOQUE !== undefined) {
                    return parseInt(epi.ESTOQUE) > 0;
                }

                // Se não há campos de quantidade, considerar disponível
                return true;
            });

            return {
                success: true,
                totalItens: episDisponiveis.length,
                catalogoEPI: episDisponiveis,
                filtros: filtersComAtivo
            };

        } catch (error) {
            console.error('❌ Erro ao buscar EPIs disponíveis:', error.message);
            throw error;
        }
    }

    /**
     * Valida se um EPI existe e está ativo
     * @param {string} codEpi - Código do EPI
     * @returns {Promise<boolean>} True se EPI existe e está ativo
     */
    static async validarEpi(codEpi) {
        try {
            const result = await this.buscarEpiPorCodigo(codEpi);

            if (!result.success) {
                return false;
            }

            // Verificar se o EPI está ativo
            const epi = result.epi;
            if (epi.ATIVO !== undefined) {
                return epi.ATIVO === true || epi.ATIVO === '1' || epi.ATIVO === 'S';
            }

            // Se não há campo ATIVO, considerar como ativo
            return true;

        } catch (error) {
            console.error('❌ Erro ao validar EPI:', error.message);
            return false;
        }
    }

    /**
     * Busca EPIs por múltiplos códigos
     * @param {Array<string>} codigos - Array de códigos de EPI
     * @returns {Promise<Object>} Lista de EPIs encontrados
     */
    static async buscarEpisPorCodigos(codigos) {
        try {
            console.log(`🔍 Buscando EPIs por códigos: ${codigos.join(', ')}`);

            const resultados = [];

            // Buscar cada EPI individualmente
            for (const codigo of codigos) {
                try {
                    const result = await this.buscarEpiPorCodigo(codigo);
                    if (result.success) {
                        resultados.push(result.epi);
                    }
                } catch (error) {
                    console.warn(`⚠️ Erro ao buscar EPI ${codigo}:`, error.message);
                }
            }

            return {
                success: true,
                totalItens: resultados.length,
                catalogoEPI: resultados,
                codigosBuscados: codigos
            };

        } catch (error) {
            console.error('❌ Erro ao buscar EPIs por códigos:', error.message);
            throw error;
        }
    }
}

module.exports = EpiService; 