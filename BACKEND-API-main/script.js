const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const axios = require('axios');
const https = require('https');

// Configurar para ignorar certificados SSL inválidos (apenas para desenvolvimento)
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/consulta', async (req, res) => {
    const { codSentenca, codColigada, codSistema, parameters } = req.body;

    // Debug: Log dos parâmetros recebidos
    console.log('Parâmetros recebidos:', { codSentenca, codColigada, codSistema, parameters });

    // XML baseado no WSDL oficial
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tot="http://www.totvs.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <tot:RealizarConsultaSQL>
         <tot:codSentenca>${codSentenca}</tot:codSentenca>
         <tot:codColigada>${codColigada}</tot:codColigada>
         <tot:codSistema>${codSistema}</tot:codSistema>
         <tot:parameters>${parameters}</tot:parameters>
      </tot:RealizarConsultaSQL>
   </soapenv:Body>
</soapenv:Envelope>`;

    console.log('XML SOAP enviado:', xml);
    console.log('Enviando requisição com autenticação Basic Auth (username: 4dash)');

    try {
        const response = await axios.post(
            'https://orlandohenrique182744.rm.cloudtotvs.com.br:8051/wsConsultaSQL/IwsConsultaSQL',
            xml,
            {
                headers: {
                    'Content-Type': 'text/xml; charset=UTF-8',
                    'SOAPAction': 'http://www.totvs.com/IwsConsultaSQL/RealizarConsultaSQL',
                    'Accept': 'text/xml'
                },
                auth: {
                    username: '4dash',
                    password: '4dash'
                },
                timeout: 30000,
                httpsAgent: httpsAgent
            }
        );

        console.log('Status da resposta:', response.status);
        console.log('Tamanho da resposta:', response.data ? response.data.length : 'undefined');

        // Verificar se a resposta está vazia
        if (!response.data || response.data.trim() === '') {
            console.log('Resposta vazia recebida');
            return res.status(400).json({
                error: 'Resposta vazia do servidor SOAP',
                status: response.status,
                message: 'Servidor retornou resposta vazia. Verifique os parâmetros.'
            });
        }

        // Parse da resposta XML
        xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error('Erro ao parsear resposta como XML:', err);
                return res.status(400).json({
                    error: 'Erro ao parsear XML',
                    rawResponse: response.data
                });
            }

            try {
                // Extrair RealizarConsultaSQLResult
                const soapResult = result['s:Envelope']['s:Body']['RealizarConsultaSQLResponse']['RealizarConsultaSQLResult'];

                if (soapResult) {
                    console.log('RealizarConsultaSQLResult encontrado');

                    // Parse do XML interno (NewDataSet)
                    xml2js.parseString(soapResult, { explicitArray: false }, (cdataErr, cdataResult) => {
                        if (cdataErr) {
                            console.error('Erro ao parsear XML interno:', cdataErr);
                            return res.json({ rawResult: soapResult });
                        }

                        if (cdataResult.NewDataSet && cdataResult.NewDataSet.Resultado) {
                            console.log('Dados encontrados:', cdataResult.NewDataSet.Resultado.length || 1, 'registro(s)');
                            res.json(cdataResult.NewDataSet.Resultado);
                        } else {
                            console.log('Retornando resultado parseado');
                            res.json(cdataResult);
                        }
                    });
                } else {
                    console.log('Estrutura de resposta diferente do esperado');
                    res.json(result);
                }
            } catch (parseError) {
                console.error('Erro ao extrair resultado:', parseError);
                res.json(result);
            }
        });

    } catch (error) {
        console.error('Erro na requisição SOAP:', error.message);

        if (error.response) {
            // Erro com resposta do servidor
            res.status(error.response.status).json({
                error: 'Erro na resposta do servidor SOAP',
                status: error.response.status,
                message: error.message
            });
        } else if (error.request) {
            // Erro de rede
            res.status(500).json({
                error: 'Erro de conexão com o servidor SOAP',
                message: error.message
            });
        } else {
            // Outros erros
            res.status(500).json({
                error: 'Erro ao consultar SOAP',
                message: error.message
            });
        }
    }
});

app.post('/grupo-epi', async (req, res) => {
    console.log('🛡️ Consultando grupo EPI...');

    const codSentenca = '00.002';
    const codColigada = '0';
    const codSistema = 'V';
    const parameters = 'COLIGADA=1';

    console.log('Parâmetros Grupo EPI:', { codSentenca, codColigada, codSistema, parameters });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tot="http://www.totvs.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <tot:RealizarConsultaSQL>
         <tot:codSentenca>${codSentenca}</tot:codSentenca>
         <tot:codColigada>${codColigada}</tot:codColigada>
         <tot:codSistema>${codSistema}</tot:codSistema>
         <tot:parameters>${parameters}</tot:parameters>
      </tot:RealizarConsultaSQL>
   </soapenv:Body>
</soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'https://orlandohenrique182744.rm.cloudtotvs.com.br:8051/wsConsultaSQL/IwsConsultaSQL',
            xml,
            {
                headers: {
                    'Content-Type': 'text/xml; charset=UTF-8',
                    'SOAPAction': 'http://www.totvs.com/IwsConsultaSQL/RealizarConsultaSQL',
                    'Accept': 'text/xml'
                },
                auth: {
                    username: '4dash',
                    password: '4dash'
                },
                timeout: 30000,
                httpsAgent: httpsAgent
            }
        );

        console.log('Status grupo EPI:', response.status);
        console.log('Tamanho resposta grupo EPI:', response.data ? response.data.length : 'undefined');

        // Verificar se a resposta está vazia
        if (!response.data || response.data.trim() === '') {
            console.log('Resposta vazia do grupo EPI');
            return res.status(400).json({
                error: 'Resposta vazia do servidor SOAP',
                status: response.status,
                message: 'Grupo EPI não retornou dados.'
            });
        }

        // Parse da resposta XML para grupo EPI
        xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error('Erro ao parsear XML do grupo EPI:', err);
                return res.status(400).json({
                    error: 'Erro ao parsear XML do grupo EPI',
                    rawResponse: response.data
                });
            }

            try {
                // Extrair RealizarConsultaSQLResult
                const soapResult = result['s:Envelope']['s:Body']['RealizarConsultaSQLResponse']['RealizarConsultaSQLResult'];

                if (soapResult) {
                    console.log('✅ Dados do grupo EPI encontrados');

                    // Parse do XML interno (NewDataSet)
                    xml2js.parseString(soapResult, { explicitArray: false }, (cdataErr, cdataResult) => {
                        if (cdataErr) {
                            console.error('Erro ao parsear XML interno do grupo EPI:', cdataErr);
                            return res.json({ rawResult: soapResult });
                        }

                        if (cdataResult.NewDataSet && cdataResult.NewDataSet.Resultado) {
                            const epiGroups = Array.isArray(cdataResult.NewDataSet.Resultado)
                                ? cdataResult.NewDataSet.Resultado
                                : [cdataResult.NewDataSet.Resultado];

                            console.log(`🛡️ ${epiGroups.length} grupos EPI encontrados`);

                            res.json({
                                success: true,
                                totalGrupos: epiGroups.length,
                                gruposEPI: epiGroups
                            });
                        } else {
                            console.log('Retornando resultado grupo EPI parseado');
                            res.json({
                                success: true,
                                gruposEPI: cdataResult
                            });
                        }
                    });
                } else {
                    console.log('Estrutura de resposta grupo EPI diferente do esperado');
                    res.json({
                        success: true,
                        gruposEPI: result
                    });
                }
            } catch (parseError) {
                console.error('Erro ao extrair resultado grupo EPI:', parseError);
                res.json({
                    success: false,
                    gruposEPI: result
                });
            }
        });

    } catch (error) {
        console.error('Erro na consulta do grupo EPI:', error.message);

        if (error.response) {
            res.status(error.response.status).json({
                error: 'Erro na resposta do servidor SOAP',
                status: error.response.status,
                message: error.message,
                tipo: 'grupo-epi'
            });
        } else if (error.request) {
            res.status(500).json({
                error: 'Erro de conexão com o servidor SOAP',
                message: error.message,
                tipo: 'grupo-epi'
            });
        } else {
            res.status(500).json({
                error: 'Erro ao consultar grupo EPI',
                message: error.message,
                tipo: 'grupo-epi'
            });
        }
    }

});

// Endpoint específico para consulta de catálogo EPI
app.post('/catalogo-epi', async (req, res) => {
    console.log('🛡️ Consultando catálogo EPI...');

    // Parâmetros podem vir do body da requisição ou usar valores padrão
    const { codSentenca = '00.003', codColigada = '0', codSistema = 'V', parameters } = req.body || {};

    // Se parameters não for fornecido, usar padrão. Se fornecido, usar o valor do body.
    const finalParameters = parameters || 'COLIGADA=1; CODGRUPO=001';

    console.log('Parâmetros EPI:', { codSentenca, codColigada, codSistema, parameters: finalParameters });

    // XML específico para catálogo EPI
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tot="http://www.totvs.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <tot:RealizarConsultaSQL>
         <tot:codSentenca>${codSentenca}</tot:codSentenca>
         <tot:codColigada>${codColigada}</tot:codColigada>
         <tot:codSistema>${codSistema}</tot:codSistema>
         <tot:parameters>${finalParameters}</tot:parameters>
      </tot:RealizarConsultaSQL>
   </soapenv:Body>
</soapenv:Envelope>`;

    console.log('XML EPI enviado:', xml);

    try {
        const response = await axios.post(
            'https://orlandohenrique182744.rm.cloudtotvs.com.br:8051/wsConsultaSQL/IwsConsultaSQL',
            xml,
            {
                headers: {
                    'Content-Type': 'text/xml; charset=UTF-8',
                    'SOAPAction': 'http://www.totvs.com/IwsConsultaSQL/RealizarConsultaSQL',
                    'Accept': 'text/xml'
                },
                auth: {
                    username: '4dash',
                    password: '4dash'
                },
                timeout: 30000,
                httpsAgent: httpsAgent
            }
        );

        console.log('Status catálogo EPI:', response.status);
        console.log('Tamanho resposta EPI:', response.data ? response.data.length : 'undefined');

        // Verificar se a resposta está vazia
        if (!response.data || response.data.trim() === '') {
            console.log('Resposta vazia do catálogo EPI');
            return res.status(400).json({
                error: 'Resposta vazia do servidor SOAP',
                status: response.status,
                message: 'Catálogo EPI não retornou dados.'
            });
        }

        // Parse da resposta XML para catálogo EPI
        xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error('Erro ao parsear XML do catálogo EPI:', err);
                return res.status(400).json({
                    error: 'Erro ao parsear XML do catálogo EPI',
                    rawResponse: response.data
                });
            }

            try {
                // Extrair RealizarConsultaSQLResult
                const soapResult = result['s:Envelope']['s:Body']['RealizarConsultaSQLResponse']['RealizarConsultaSQLResult'];

                if (soapResult) {
                    console.log('✅ Dados do catálogo EPI encontrados');

                    // Parse do XML interno (NewDataSet)
                    xml2js.parseString(soapResult, { explicitArray: false }, (cdataErr, cdataResult) => {
                        if (cdataErr) {
                            console.error('Erro ao parsear XML interno do EPI:', cdataErr);
                            return res.json({ rawResult: soapResult });
                        }

                        if (cdataResult.NewDataSet && cdataResult.NewDataSet.Resultado) {
                            const epiItems = Array.isArray(cdataResult.NewDataSet.Resultado)
                                ? cdataResult.NewDataSet.Resultado
                                : [cdataResult.NewDataSet.Resultado];

                            console.log(`📋 ${epiItems.length} itens EPI encontrados`);

                            res.json({
                                success: true,
                                totalItens: epiItems.length,
                                catalogoEPI: epiItems
                            });
                        } else {
                            console.log('Retornando resultado EPI parseado');
                            res.json({
                                success: true,
                                catalogoEPI: cdataResult
                            });
                        }
                    });
                } else {
                    console.log('Estrutura de resposta EPI diferente do esperado');
                    res.json({
                        success: true,
                        catalogoEPI: result
                    });
                }
            } catch (parseError) {
                console.error('Erro ao extrair resultado EPI:', parseError);
                res.json({
                    success: true,
                    catalogoEPI: result
                });
            }
        });

    } catch (error) {
        console.error('Erro na consulta do catálogo EPI:', error.message);

        if (error.response) {
            res.status(error.response.status).json({
                error: 'Erro na resposta do servidor SOAP',
                status: error.response.status,
                message: error.message,
                tipo: 'catalogo-epi'
            });
        } else if (error.request) {
            res.status(500).json({
                error: 'Erro de conexão com o servidor SOAP',
                message: error.message,
                tipo: 'catalogo-epi'
            });
        } else {
            res.status(500).json({
                error: 'Erro ao consultar catálogo EPI',
                message: error.message,
                tipo: 'catalogo-epi'
            });
        }
    }
});

// Endpoint específico para consulta de colaboradores
app.post('/colaboradores', async (req, res) => {
    console.log('👥 Consultando colaboradores...');

    // Parâmetros fixos para consulta de colaboradores
    const codSentenca = '00.004';
    const codColigada = '0';
    const codSistema = 'V';
    const parameters = 'COLIGADA=1';

    console.log('Parâmetros Colaboradores:', { codSentenca, codColigada, codSistema, parameters });

    // XML específico para colaboradores
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tot="http://www.totvs.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <tot:RealizarConsultaSQL>
         <tot:codSentenca>${codSentenca}</tot:codSentenca>
         <tot:codColigada>${codColigada}</tot:codColigada>
         <tot:codSistema>${codSistema}</tot:codSistema>
         <tot:parameters>${parameters}</tot:parameters>
      </tot:RealizarConsultaSQL>
   </soapenv:Body>
</soapenv:Envelope>`;

    console.log('XML Colaboradores enviado:', xml);

    try {
        const response = await axios.post(
            'https://orlandohenrique182744.rm.cloudtotvs.com.br:8051/wsConsultaSQL/IwsConsultaSQL',
            xml,
            {
                headers: {
                    'Content-Type': 'text/xml; charset=UTF-8',
                    'SOAPAction': 'http://www.totvs.com/IwsConsultaSQL/RealizarConsultaSQL',
                    'Accept': 'text/xml'
                },
                auth: {
                    username: '4dash',
                    password: '4dash'
                },
                timeout: 30000,
                httpsAgent: httpsAgent
            }
        );

        console.log('Status colaboradores:', response.status);
        console.log('Tamanho resposta colaboradores:', response.data ? response.data.length : 'undefined');

        // Verificar se a resposta está vazia
        if (!response.data || response.data.trim() === '') {
            console.log('Resposta vazia da consulta de colaboradores');
            return res.status(400).json({
                error: 'Resposta vazia do servidor SOAP',
                status: response.status,
                message: 'Consulta de colaboradores não retornou dados.'
            });
        }

        // Parse da resposta XML para colaboradores
        xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error('Erro ao parsear XML de colaboradores:', err);
                return res.status(400).json({
                    error: 'Erro ao parsear XML de colaboradores',
                    rawResponse: response.data
                });
            }

            try {
                // Extrair RealizarConsultaSQLResult
                const soapResult = result['s:Envelope']['s:Body']['RealizarConsultaSQLResponse']['RealizarConsultaSQLResult'];

                if (soapResult) {
                    console.log('✅ Dados de colaboradores encontrados');

                    // Parse do XML interno (NewDataSet)
                    xml2js.parseString(soapResult, { explicitArray: false }, (cdataErr, cdataResult) => {
                        if (cdataErr) {
                            console.error('Erro ao parsear XML interno de colaboradores:', cdataErr);
                            return res.json({ rawResult: soapResult });
                        }

                        if (cdataResult.NewDataSet && cdataResult.NewDataSet.Resultado) {
                            const colaboradores = Array.isArray(cdataResult.NewDataSet.Resultado)
                                ? cdataResult.NewDataSet.Resultado
                                : [cdataResult.NewDataSet.Resultado];

                            console.log(`👥 ${colaboradores.length} colaboradores encontrados`);

                            res.json({
                                success: true,
                                totalColaboradores: colaboradores.length,
                                colaboradores: colaboradores
                            });
                        } else {
                            console.log('Retornando resultado de colaboradores parseado');
                            res.json({
                                success: true,
                                colaboradores: cdataResult
                            });
                        }
                    });
                } else {
                    console.log('Estrutura de resposta de colaboradores diferente do esperado');
                    res.json({
                        success: true,
                        colaboradores: result
                    });
                }
            } catch (parseError) {
                console.error('Erro ao extrair resultado de colaboradores:', parseError);
                res.json({
                    success: true,
                    colaboradores: result
                });
            }
        });

    } catch (error) {
        console.error('Erro na consulta de colaboradores:', error.message);

        if (error.response) {
            res.status(error.response.status).json({
                error: 'Erro na resposta do servidor SOAP',
                status: error.response.status,
                message: error.message,
                tipo: 'colaboradores'
            });
        } else if (error.request) {
            res.status(500).json({
                error: 'Erro de conexão com o servidor SOAP',
                message: error.message,
                tipo: 'colaboradores'
            });
        } else {
            res.status(500).json({
                error: 'Erro ao consultar colaboradores',
                message: error.message,
                tipo: 'colaboradores'
            });
        }
    }
});

app.listen(3001, () => {
    console.log('API SOAP rodando em http://localhost:3001');
});