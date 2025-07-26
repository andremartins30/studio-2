const app = require('./src/app');
const SoapClient = require('./src/utils/soap-client');

/**
 * Servidor principal da aplicação
 */

const PORT = process.env.PORT || 3001;

// Função para inicializar o servidor
async function startServer() {
    try {
        console.log('🚀 Iniciando servidor EPI System API...');

        // Testar conectividade SOAP
        console.log('🔌 Testando conectividade SOAP...');
        const soapConnected = await SoapClient.testConnection();

        if (soapConnected) {
            console.log('✅ Conectividade SOAP estabelecida');
        } else {
            console.warn('⚠️ Falha na conectividade SOAP - API funcionará com limitações');
        }

        // Iniciar servidor
        const server = app.listen(PORT, () => {
            console.log('🌟 =================================');
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log('🌟 =================================');
            console.log('📋 Endpoints disponíveis:');
            console.log('   📊 API Info: GET /api');
            console.log('   🏥 Health: GET /health');
            console.log('   👥 Colaboradores: GET /api/colaboradores');
            console.log('   📦 Grupos EPI: GET /api/grupos-epi');
            console.log('   🛡️ Catálogo EPI: GET /api/catalogo-epi');
            console.log('   🔧 Legado: POST /colaboradores, /grupo-epi, /catalogo-epi');
            console.log('🌟 =================================');
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('📴 SIGTERM recebido. Encerrando servidor graciosamente...');
            server.close(() => {
                console.log('✅ Servidor encerrado com sucesso');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('📴 SIGINT recebido. Encerrando servidor graciosamente...');
            server.close(() => {
                console.log('✅ Servidor encerrado com sucesso');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
    console.error('❌ Erro não capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise rejeitada não tratada:', reason);
    process.exit(1);
});

// Iniciar servidor
startServer(); 