const express = require('express');
const ColaboradorController = require('../controllers/colaborador.controller');
const EpiController = require('../controllers/epi.controller');
const SoapClient = require('../utils/soap-client');

const router = express.Router();

/**
 * Rotas legadas mantidas para compatibilidade
 * Base: /
 */

// POST /colaboradores - Endpoint legado para colaboradores
router.post('/colaboradores', ColaboradorController.buscarTodosLegacy);

// POST /grupo-epi - Endpoint legado para grupos EPI
router.post('/grupo-epi', EpiController.buscarGruposLegacy);

// POST /catalogo-epi - Endpoint legado para catálogo EPI  
router.post('/catalogo-epi', EpiController.buscarCatalogoLegacy);

// POST /consulta - Endpoint legado para consulta genérica
router.post('/consulta', async (req, res) => {
    try {
        console.log('📥 Controller: Endpoint legado - POST /consulta');

        const { codSentenca, codColigada, codSistema, parameters } = req.body;

        console.log('Parâmetros recebidos:', { codSentenca, codColigada, codSistema, parameters });

        // Validar parâmetros obrigatórios
        if (!codSentenca) {
            return res.status(400).json({
                success: false,
                error: 'Parâmetro obrigatório',
                message: 'codSentenca é obrigatório'
            });
        }

        // Usar o SoapClient centralizado
        const result = await SoapClient.executeQuery(
            codSentenca,
            codColigada || '0',
            codSistema || 'V',
            parameters || ''
        );

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: 'Falha na consulta SOAP',
                message: result.error || 'Erro desconhecido'
            });
        }

        // Retornar no formato esperado pelo frontend legado
        res.status(200).json(result.data);

    } catch (error) {
        console.error('❌ Erro na consulta legada:', error.message);

        if (error.response) {
            res.status(error.response.status).json({
                error: 'Erro na resposta do servidor SOAP',
                status: error.response.status,
                message: error.message
            });
        } else if (error.request) {
            res.status(500).json({
                error: 'Erro de conexão com o servidor SOAP',
                message: error.message
            });
        } else {
            res.status(500).json({
                error: 'Erro ao consultar SOAP',
                message: error.message
            });
        }
    }
});

// GET /health - Health check
router.get('/health', async (req, res) => {
    try {
        console.log('🏥 Health check solicitado');

        const soapConnected = await SoapClient.testConnection();

        res.status(200).json({
            status: 'ok',
            message: 'API funcionando corretamente',
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            services: {
                soap: soapConnected ? 'connected' : 'disconnected'
            }
        });

    } catch (error) {
        console.error('❌ Erro no health check:', error.message);

        res.status(503).json({
            status: 'error',
            message: 'Serviço indisponível',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

module.exports = router; 