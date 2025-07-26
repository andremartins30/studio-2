const express = require('express');
const ColaboradorController = require('../controllers/colaborador.controller');

const router = express.Router();

/**
 * Rotas para colaboradores
 * Base: /api/colaboradores
 */

// GET /api/colaboradores - Busca todos os colaboradores
router.get('/', ColaboradorController.buscarTodos);

// GET /api/colaboradores/funcao/:codFuncao - Busca colaboradores por função
router.get('/funcao/:codFuncao', ColaboradorController.buscarPorFuncao);

// GET /api/colaboradores/secao/:codSecao - Busca colaboradores por seção
router.get('/secao/:codSecao', ColaboradorController.buscarPorSecao);

// GET /api/colaboradores/:chapa/validar - Valida colaborador
router.get('/:chapa/validar', ColaboradorController.validar);

// GET /api/colaboradores/:chapa - Busca colaborador por chapa
router.get('/:chapa', ColaboradorController.buscarPorChapa);

module.exports = router; 