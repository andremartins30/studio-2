const express = require('express');
const EpiController = require('../controllers/epi.controller');

const router = express.Router();

/**
 * Rotas para grupos EPI e catálogo
 * Base: /api
 */

// === ROTAS PARA GRUPOS EPI ===

// GET /api/grupos-epi - Busca todos os grupos EPI
router.get('/grupos-epi', EpiController.buscarGrupos);

// GET /api/grupos-epi/:codGrupo - Busca grupo EPI por código
router.get('/grupos-epi/:codGrupo', EpiController.buscarGrupoPorCodigo);

// === ROTAS PARA CATÁLOGO EPI ===

// GET /api/catalogo-epi/disponiveis - Busca EPIs disponíveis
router.get('/catalogo-epi/disponiveis', EpiController.buscarEpisDisponiveis);

// GET /api/catalogo-epi/grupo/:codGrupo - Busca EPIs por grupo
router.get('/catalogo-epi/grupo/:codGrupo', EpiController.buscarEpisPorGrupo);

// POST /api/catalogo-epi/multiplos - Busca EPIs por múltiplos códigos
router.post('/catalogo-epi/multiplos', EpiController.buscarEpisPorCodigos);

// GET /api/catalogo-epi/:codEpi/validar - Valida EPI
router.get('/catalogo-epi/:codEpi/validar', EpiController.validarEpi);

// GET /api/catalogo-epi/:codEpi - Busca EPI por código
router.get('/catalogo-epi/:codEpi', EpiController.buscarEpiPorCodigo);

// GET /api/catalogo-epi - Busca catálogo de EPIs
router.get('/catalogo-epi', EpiController.buscarCatalogo);

// POST /api/catalogo-epi - Busca catálogo de EPIs (compatibilidade)
router.post('/catalogo-epi', EpiController.buscarCatalogo);

module.exports = router; 