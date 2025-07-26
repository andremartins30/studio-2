const ColaboradorService = require('../services/colaborador.service');

/**
 * Controller para gerenciar endpoints de colaboradores
 */
class ColaboradorController {

    /**
     * Busca todos os colaboradores
     * GET /api/colaboradores
     */
    static async buscarTodos(req, res) {
        try {
            console.log('📥 Controller: Buscando todos os colaboradores');

            // Extrair filtros da query string
            const filters = {
                coligada: req.query.coligada
            };

            const result = await ColaboradorService.buscarColaboradores(filters);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller de colaboradores:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'colaboradores'
            });
        }
    }

    /**
     * Busca colaborador por chapa
     * GET /api/colaboradores/:chapa
     */
    static async buscarPorChapa(req, res) {
        try {
            const { chapa } = req.params;

            console.log(`📥 Controller: Buscando colaborador por chapa - ${chapa}`);

            if (!chapa) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Chapa do colaborador é obrigatória'
                });
            }

            const result = await ColaboradorService.buscarColaboradorPorChapa(chapa);

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar colaborador por chapa:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'colaborador-chapa'
            });
        }
    }

    /**
     * Valida se um colaborador existe
     * GET /api/colaboradores/:chapa/validar
     */
    static async validar(req, res) {
        try {
            const { chapa } = req.params;

            console.log(`📥 Controller: Validando colaborador - ${chapa}`);

            if (!chapa) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Chapa do colaborador é obrigatória'
                });
            }

            const isValid = await ColaboradorService.validarColaborador(chapa);

            res.status(200).json({
                success: true,
                chapa: chapa,
                valido: isValid,
                message: isValid ? 'Colaborador válido' : 'Colaborador inválido ou inativo'
            });

        } catch (error) {
            console.error('❌ Erro no controller ao validar colaborador:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'colaborador-validacao'
            });
        }
    }

    /**
     * Busca colaboradores por função
     * GET /api/colaboradores/funcao/:codFuncao
     */
    static async buscarPorFuncao(req, res) {
        try {
            const { codFuncao } = req.params;

            console.log(`📥 Controller: Buscando colaboradores por função - ${codFuncao}`);

            if (!codFuncao) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Código da função é obrigatório'
                });
            }

            const result = await ColaboradorService.buscarColaboradoresPorFuncao(codFuncao);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar colaboradores por função:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'colaboradores-funcao'
            });
        }
    }

    /**
     * Busca colaboradores por seção
     * GET /api/colaboradores/secao/:codSecao
     */
    static async buscarPorSecao(req, res) {
        try {
            const { codSecao } = req.params;

            console.log(`📥 Controller: Buscando colaboradores por seção - ${codSecao}`);

            if (!codSecao) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Código da seção é obrigatório'
                });
            }

            const result = await ColaboradorService.buscarColaboradoresPorSecao(codSecao);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar colaboradores por seção:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'colaboradores-secao'
            });
        }
    }

    /**
     * Endpoint legado mantido para compatibilidade
     * POST /colaboradores
     */
    static async buscarTodosLegacy(req, res) {
        try {
            console.log('📥 Controller: Endpoint legado - POST /colaboradores');

            // Redirecionar para o método padrão
            await ColaboradorController.buscarTodos(req, res);

        } catch (error) {
            console.error('❌ Erro no endpoint legado de colaboradores:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'colaboradores-legacy'
            });
        }
    }
}

module.exports = ColaboradorController; 