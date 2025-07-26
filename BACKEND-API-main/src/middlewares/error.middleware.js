/**
 * Middleware para tratamento centralizado de erros
 */

/**
 * Middleware de tratamento de erros
 */
const errorHandler = (err, req, res, next) => {
    console.error('❌ Erro capturado pelo middleware:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Erro de validação
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Erro de validação',
            message: err.message,
            details: err.details || null
        });
    }

    // Erro de timeout
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        return res.status(408).json({
            success: false,
            error: 'Timeout',
            message: 'Tempo limite excedido na conexão com o servidor SOAP'
        });
    }

    // Erro de conexão SOAP
    if (err.message.includes('SOAP') || err.message.includes('XML')) {
        return res.status(502).json({
            success: false,
            error: 'Erro de comunicação SOAP',
            message: 'Falha na comunicação com o servidor TOTVS'
        });
    }

    // Erro de não encontrado
    if (err.status === 404) {
        return res.status(404).json({
            success: false,
            error: 'Recurso não encontrado',
            message: err.message || 'O recurso solicitado não foi encontrado'
        });
    }

    // Erro padrão
    res.status(err.status || 500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'production'
            ? 'Ocorreu um erro interno. Tente novamente mais tarde.'
            : err.message,
        timestamp: new Date().toISOString()
    });
};

/**
 * Middleware para capturar rotas não encontradas
 */
const notFoundHandler = (req, res, next) => {
    console.warn(`⚠️ Rota não encontrada: ${req.method} ${req.url}`);

    res.status(404).json({
        success: false,
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.url} não existe`,
        availableRoutes: {
            colaboradores: '/api/colaboradores',
            grupos_epi: '/api/grupos-epi',
            catalogo_epi: '/api/catalogo-epi',
            health: '/health',
            api_info: '/api'
        }
    });
};

/**
 * Middleware para logging de requisições
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log da requisição
    console.log(`📥 ${req.method} ${req.url} - ${new Date().toISOString()}`);

    // Log do body se for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    }

    // Interceptar a resposta para log
    const originalSend = res.send;
    res.send = function (body) {
        const duration = Date.now() - start;
        console.log(`📤 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);

        originalSend.call(this, body);
    };

    next();
};

/**
 * Middleware para CORS
 */
const corsHandler = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Responder a requisições OPTIONS
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
};

/**
 * Middleware para validação de content-type em POST/PUT
 */
const validateContentType = (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.get('Content-Type');

        if (!contentType || !contentType.includes('application/json')) {
            return res.status(400).json({
                success: false,
                error: 'Content-Type inválido',
                message: 'Content-Type deve ser application/json'
            });
        }
    }

    next();
};

module.exports = {
    errorHandler,
    notFoundHandler,
    requestLogger,
    corsHandler,
    validateContentType
}; 