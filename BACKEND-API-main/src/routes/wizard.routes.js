const express = require('express');
const WizardController = require('../controllers/wizard.controller');

const router = express.Router();

/**
 * Rotas para ações do wizard EPI
 * Base: /api/wizard
 */

// === AÇÕES PRINCIPAIS ===

// POST /api/wizard/fornecimento - Fornecimento/Empréstimo de EPIs
router.post('/fornecimento', WizardController.fornecerEpis);

// POST /api/wizard/devolucao - Devolução de EPIs
router.post('/devolucao', WizardController.devolverEpis);

// POST /api/wizard/descarte - Descarte de EPIs
router.post('/descarte', WizardController.descartarEpis);

// POST /api/wizard/cancelamento - Cancelamento de EPIs
router.post('/cancelamento', WizardController.cancelarEpis);

// === CONSULTAS AUXILIARES ===

// GET /api/wizard/emprestimos/:chapa - EPIs emprestados por funcionário
router.get('/emprestimos/:chapa', WizardController.buscarEpisEmprestados);

// GET /api/wizard/historico/:codepi - Histórico de movimentações de EPI
router.get('/historico/:codepi', WizardController.buscarHistoricoEpi);

// GET /api/wizard/validar/:codepi - Validar disponibilidade de EPI
router.get('/validar/:codepi', WizardController.validarDisponibilidadeEpi);

// === CONFIGURAÇÕES E INFORMAÇÕES ===

// GET /api/wizard/motivos-descarte - Motivos de descarte disponíveis
router.get('/motivos-descarte', WizardController.getMotivosDescarte);

// GET /api/wizard/status-types - Tipos de status EPI
router.get('/status-types', WizardController.getStatusTypes);

// GET /api/wizard/actions - Ações disponíveis do wizard
router.get('/actions', WizardController.getWizardActions);

// GET /api/wizard/info - Informações gerais do wizard
router.get('/info', WizardController.getWizardInfo);

// GET /api/wizard - Endpoint principal (redireciona para info)
router.get('/', WizardController.getWizardInfo);

module.exports = router; 