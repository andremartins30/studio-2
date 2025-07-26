const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const {
    errorHandler,
    notFoundHandler,
    requestLogger,
    corsHandler,
    validateContentType
} = require('./middlewares/error.middleware');

/**
 * Configuração principal da aplicação Express
 */
const app = express();

// === MIDDLEWARES GLOBAIS ===

// CORS
app.use(corsHandler);

// Parser de JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging de requisições
app.use(requestLogger);

// Validação de Content-Type
app.use(validateContentType);

// === ROTAS ===

// Usar o roteador principal
app.use('/', routes);

// === MIDDLEWARES DE ERRO ===

// Handler para rotas não encontradas
app.use(notFoundHandler);

// Handler de erros global
app.use(errorHandler);

module.exports = app; 