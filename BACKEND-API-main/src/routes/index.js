const express = require('express');
const colaboradorRoutes = require('./colaborador.routes');
const epiRoutes = require('./epi.routes');
const legacyRoutes = require('./legacy.routes');

const router = express.Router();

/**
 * Centralizador de todas as rotas da API
 */

// Rotas da API REST organizadas
router.use('/api/colaboradores', colaboradorRoutes);
router.use('/api', epiRoutes);

// Rotas legadas para compatibilidade (sem prefixo /api)
router.use('/', legacyRoutes);

// Rota de informações da API
router.get('/api', (req, res) => {
    res.json({
        name: 'EPI System API',
        version: '2.0.0',
        description: 'API para sistema de gestão de EPIs integrado com TOTVS',
        status: 'active',
        timestamp: new Date().toISOString(),
        endpoints: {
            colaboradores: {
                base: '/api/colaboradores',
                methods: ['GET'],
                description: 'Gerenciamento de colaboradores'
            },
            grupos_epi: {
                base: '/api/grupos-epi',
                methods: ['GET'],
                description: 'Gerenciamento de grupos EPI'
            },
            catalogo_epi: {
                base: '/api/catalogo-epi',
                methods: ['GET', 'POST'],
                description: 'Gerenciamento de catálogo EPI'
            },
            legacy: {
                base: '/',
                methods: ['POST'],
                description: 'Endpoints legados para compatibilidade'
            }
        },
        documentation: {
            swagger: '/api/docs',
            postman: '/api/postman',
            readme: '/api/readme'
        }
    });
});

module.exports = router; 