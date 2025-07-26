const EpiService = require('../services/epi.service');

/**
 * Controller para gerenciar endpoints de EPIs e grupos
 */
class EpiController {

    /**
     * Busca todos os grupos EPI
     * GET /api/grupos-epi
     */
    static async buscarGrupos(req, res) {
        try {
            console.log('📥 Controller: Buscando grupos EPI');

            // Extrair filtros da query string
            const filters = {
                coligada: req.query.coligada
            };

            const result = await EpiService.buscarGruposEpi(filters);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller de grupos EPI:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'grupos-epi'
            });
        }
    }

    /**
     * Busca grupo EPI por código
     * GET /api/grupos-epi/:codGrupo
     */
    static async buscarGrupoPorCodigo(req, res) {
        try {
            const { codGrupo } = req.params;

            console.log(`📥 Controller: Buscando grupo EPI por código - ${codGrupo}`);

            if (!codGrupo) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Código do grupo EPI é obrigatório'
                });
            }

            const result = await EpiService.buscarGrupoPorCodigo(codGrupo);

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar grupo EPI por código:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'grupo-epi-codigo'
            });
        }
    }

    /**
     * Busca catálogo de EPIs
     * GET /api/catalogo-epi
     * POST /api/catalogo-epi (para compatibilidade)
     */
    static async buscarCatalogo(req, res) {
        try {
            console.log('📥 Controller: Buscando catálogo EPI');

            // Extrair filtros da query string ou body (para compatibilidade POST)
            let filters = {};

            if (req.method === 'GET') {
                filters = {
                    codGrupo: req.query.codGrupo,
                    coligada: req.query.coligada,
                    ativo: req.query.ativo
                };
            } else if (req.method === 'POST' && req.body) {
                // Para compatibilidade com endpoint legado
                const { parameters } = req.body;
                if (parameters && parameters.includes('CODGRUPO=')) {
                    const match = parameters.match(/CODGRUPO=([^;]+)/);
                    if (match) {
                        filters.codGrupo = match[1].trim();
                    }
                }
                filters.coligada = req.body.coligada;
            }

            const result = await EpiService.buscarCatalogoEpi(filters);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller de catálogo EPI:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'catalogo-epi'
            });
        }
    }

    /**
     * Busca EPIs por grupo específico
     * GET /api/catalogo-epi/grupo/:codGrupo
     */
    static async buscarEpisPorGrupo(req, res) {
        try {
            const { codGrupo } = req.params;

            console.log(`📥 Controller: Buscando EPIs do grupo - ${codGrupo}`);

            if (!codGrupo) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Código do grupo EPI é obrigatório'
                });
            }

            // Filtros adicionais da query string
            const additionalFilters = {
                ativo: req.query.ativo,
                coligada: req.query.coligada
            };

            const result = await EpiService.buscarEpisPorGrupo(codGrupo, additionalFilters);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar EPIs por grupo:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'epis-grupo'
            });
        }
    }

    /**
     * Busca EPI por código
     * GET /api/catalogo-epi/:codEpi
     */
    static async buscarEpiPorCodigo(req, res) {
        try {
            const { codEpi } = req.params;

            console.log(`📥 Controller: Buscando EPI por código - ${codEpi}`);

            if (!codEpi) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Código do EPI é obrigatório'
                });
            }

            const result = await EpiService.buscarEpiPorCodigo(codEpi);

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar EPI por código:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'epi-codigo'
            });
        }
    }

    /**
     * Busca EPIs disponíveis
     * GET /api/catalogo-epi/disponiveis
     */
    static async buscarEpisDisponiveis(req, res) {
        try {
            console.log('📥 Controller: Buscando EPIs disponíveis');

            // Extrair filtros da query string
            const filters = {
                codGrupo: req.query.codGrupo,
                coligada: req.query.coligada
            };

            const result = await EpiService.buscarEpisDisponiveis(filters);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar EPIs disponíveis:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'epis-disponiveis'
            });
        }
    }

    /**
     * Valida se um EPI existe
     * GET /api/catalogo-epi/:codEpi/validar
     */
    static async validarEpi(req, res) {
        try {
            const { codEpi } = req.params;

            console.log(`📥 Controller: Validando EPI - ${codEpi}`);

            if (!codEpi) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Código do EPI é obrigatório'
                });
            }

            const isValid = await EpiService.validarEpi(codEpi);

            res.status(200).json({
                success: true,
                codigoEpi: codEpi,
                valido: isValid,
                message: isValid ? 'EPI válido' : 'EPI inválido ou inativo'
            });

        } catch (error) {
            console.error('❌ Erro no controller ao validar EPI:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'epi-validacao'
            });
        }
    }

    /**
     * Busca EPIs por múltiplos códigos
     * POST /api/catalogo-epi/multiplos
     */
    static async buscarEpisPorCodigos(req, res) {
        try {
            const { codigos } = req.body;

            console.log(`📥 Controller: Buscando EPIs por múltiplos códigos`);

            if (!codigos || !Array.isArray(codigos) || codigos.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Array de códigos de EPI é obrigatório'
                });
            }

            const result = await EpiService.buscarEpisPorCodigos(codigos);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar EPIs por códigos:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'epis-multiplos'
            });
        }
    }

    /**
     * Endpoints legados mantidos para compatibilidade
     */

    /**
     * POST /grupo-epi (legado)
     */
    static async buscarGruposLegacy(req, res) {
        try {
            console.log('📥 Controller: Endpoint legado - POST /grupo-epi');

            // Redirecionar para o método padrão
            await EpiController.buscarGrupos(req, res);

        } catch (error) {
            console.error('❌ Erro no endpoint legado de grupos EPI:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'grupos-epi-legacy'
            });
        }
    }

    /**
     * POST /catalogo-epi (legado)
     */
    static async buscarCatalogoLegacy(req, res) {
        try {
            console.log('📥 Controller: Endpoint legado - POST /catalogo-epi');

            // Usar o método padrão que já suporta POST
            await EpiController.buscarCatalogo(req, res);

        } catch (error) {
            console.error('❌ Erro no endpoint legado de catálogo EPI:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'catalogo-epi-legacy'
            });
        }
    }
}

module.exports = EpiController; 