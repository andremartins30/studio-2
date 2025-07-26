const WizardService = require('../services/wizard.service');

/**
 * Controller para gerenciar endpoints das ações do wizard EPI
 */
class WizardController {

    /**
     * === FORNECIMENTO/EMPRÉSTIMO ===
     */

    /**
     * Realiza fornecimento de EPIs
     * POST /api/wizard/fornecimento
     */
    static async fornecerEpis(req, res) {
        try {
            console.log('📥 Controller: Fornecimento de EPIs');

            const { chapa, epis, observacao } = req.body;

            // Validar dados obrigatórios
            if (!chapa) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Chapa do funcionário é obrigatória'
                });
            }

            if (!epis || !Array.isArray(epis) || epis.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Lista de EPIs é obrigatória e deve conter pelo menos um item'
                });
            }

            const result = await WizardService.fornecerEpis({
                chapa,
                epis,
                observacao
            });

            const statusCode = result.success ? 200 : 207; // 207 Multi-Status para erros parciais
            res.status(statusCode).json(result);

        } catch (error) {
            console.error('❌ Erro no controller de fornecimento:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                acao: 'fornecimento'
            });
        }
    }

    /**
     * === DEVOLUÇÃO ===
     */

    /**
     * Realiza devolução de EPIs
     * POST /api/wizard/devolucao
     */
    static async devolverEpis(req, res) {
        try {
            console.log('📥 Controller: Devolução de EPIs');

            const { chapa, epis, motivo } = req.body;

            // Validar dados obrigatórios
            if (!chapa) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Chapa do funcionário é obrigatória'
                });
            }

            if (!epis || !Array.isArray(epis) || epis.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Lista de EPIs é obrigatória e deve conter pelo menos um item'
                });
            }

            const result = await WizardService.devolverEpis({
                chapa,
                epis,
                motivo
            });

            const statusCode = result.success ? 200 : 207; // 207 Multi-Status para erros parciais
            res.status(statusCode).json(result);

        } catch (error) {
            console.error('❌ Erro no controller de devolução:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                acao: 'devolucao'
            });
        }
    }

    /**
     * === DESCARTE ===
     */

    /**
     * Realiza descarte de EPIs
     * POST /api/wizard/descarte
     */
    static async descartarEpis(req, res) {
        try {
            console.log('📥 Controller: Descarte de EPIs');

            const { chapa, epis, motivo } = req.body;

            // Validar dados obrigatórios
            if (!chapa) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Chapa do funcionário é obrigatória'
                });
            }

            if (!epis || !Array.isArray(epis) || epis.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Lista de EPIs é obrigatória e deve conter pelo menos um item'
                });
            }

            if (!motivo) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Motivo do descarte é obrigatório'
                });
            }

            const result = await WizardService.descartarEpis({
                chapa,
                epis,
                motivo
            });

            const statusCode = result.success ? 200 : 207; // 207 Multi-Status para erros parciais
            res.status(statusCode).json(result);

        } catch (error) {
            console.error('❌ Erro no controller de descarte:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                acao: 'descarte'
            });
        }
    }

    /**
     * === CANCELAMENTO ===
     */

    /**
     * Realiza cancelamento de EPIs
     * POST /api/wizard/cancelamento
     */
    static async cancelarEpis(req, res) {
        try {
            console.log('📥 Controller: Cancelamento de EPIs');

            const { chapa, epis, motivo } = req.body;

            // Validar dados obrigatórios
            if (!chapa) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Chapa do funcionário é obrigatória'
                });
            }

            if (!epis || !Array.isArray(epis) || epis.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Lista de EPIs é obrigatória e deve conter pelo menos um item'
                });
            }

            const result = await WizardService.cancelarEpis({
                chapa,
                epis,
                motivo
            });

            const statusCode = result.success ? 200 : 207; // 207 Multi-Status para erros parciais
            res.status(statusCode).json(result);

        } catch (error) {
            console.error('❌ Erro no controller de cancelamento:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                acao: 'cancelamento'
            });
        }
    }

    /**
     * === CONSULTAS AUXILIARES ===
     */

    /**
     * Busca EPIs emprestados de um funcionário
     * GET /api/wizard/emprestimos/:chapa
     */
    static async buscarEpisEmprestados(req, res) {
        try {
            const { chapa } = req.params;

            console.log(`📥 Controller: Buscando EPIs emprestados - ${chapa}`);

            if (!chapa) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Chapa do funcionário é obrigatória'
                });
            }

            const result = await WizardService.buscarEpisEmprestados(chapa);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar EPIs emprestados:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'emprestimos-funcionario'
            });
        }
    }

    /**
     * Busca histórico de um EPI
     * GET /api/wizard/historico/:codepi
     */
    static async buscarHistoricoEpi(req, res) {
        try {
            const { codepi } = req.params;

            console.log(`📥 Controller: Buscando histórico do EPI - ${codepi}`);

            if (!codepi) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Código do EPI é obrigatório'
                });
            }

            const result = await WizardService.buscarHistoricoEpi(codepi);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar histórico do EPI:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'historico-epi'
            });
        }
    }

    /**
     * Valida disponibilidade de um EPI
     * GET /api/wizard/validar/:codepi?quantidade=1
     */
    static async validarDisponibilidadeEpi(req, res) {
        try {
            const { codepi } = req.params;
            const quantidade = parseInt(req.query.quantidade) || 1;

            console.log(`📥 Controller: Validando disponibilidade do EPI - ${codepi}`);

            if (!codepi) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro obrigatório',
                    message: 'Código do EPI é obrigatório'
                });
            }

            if (quantidade <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetro inválido',
                    message: 'Quantidade deve ser maior que zero'
                });
            }

            const result = await WizardService.validarDisponibilidadeEpi(codepi, quantidade);

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao validar disponibilidade:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'validacao-disponibilidade'
            });
        }
    }

    /**
     * === ENDPOINTS DE CONFIGURAÇÃO ===
     */

    /**
     * Obtém motivos de descarte
     * GET /api/wizard/motivos-descarte
     */
    static async getMotivosDescarte(req, res) {
        try {
            console.log('📥 Controller: Buscando motivos de descarte');

            const result = WizardService.getMotivosDescarte();

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar motivos de descarte:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'motivos-descarte'
            });
        }
    }

    /**
     * Obtém tipos de status
     * GET /api/wizard/status-types
     */
    static async getStatusTypes(req, res) {
        try {
            console.log('📥 Controller: Buscando tipos de status');

            const result = WizardService.getStatusTypes();

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar tipos de status:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'status-types'
            });
        }
    }

    /**
     * Obtém ações do wizard
     * GET /api/wizard/actions
     */
    static async getWizardActions(req, res) {
        try {
            console.log('📥 Controller: Buscando ações do wizard');

            const result = WizardService.getWizardActions();

            res.status(200).json(result);

        } catch (error) {
            console.error('❌ Erro no controller ao buscar ações do wizard:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'wizard-actions'
            });
        }
    }

    /**
     * Obtém informações gerais do wizard
     * GET /api/wizard/info
     */
    static async getWizardInfo(req, res) {
        try {
            console.log('📥 Controller: Buscando informações do wizard');

            const actions = WizardService.getWizardActions();
            const status = WizardService.getStatusTypes();
            const motivos = WizardService.getMotivosDescarte();

            res.status(200).json({
                success: true,
                wizard: {
                    version: '2.0.0',
                    description: 'Sistema de gestão de EPIs - Ações do Wizard',
                    actions: actions.actions,
                    statusTypes: status.status,
                    motivosDescarte: motivos.motivos
                },
                endpoints: {
                    fornecimento: 'POST /api/wizard/fornecimento',
                    devolucao: 'POST /api/wizard/devolucao',
                    descarte: 'POST /api/wizard/descarte',
                    cancelamento: 'POST /api/wizard/cancelamento',
                    emprestimos: 'GET /api/wizard/emprestimos/:chapa',
                    historico: 'GET /api/wizard/historico/:codepi',
                    validacao: 'GET /api/wizard/validar/:codepi'
                }
            });

        } catch (error) {
            console.error('❌ Erro no controller ao buscar informações do wizard:', error.message);

            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: error.message,
                tipo: 'wizard-info'
            });
        }
    }
}

module.exports = WizardController; 