# EPI System API v2.0

API reestruturada para sistema de gestão de EPIs integrado com TOTVS via SOAP.

## 🏗️ Arquitetura

```
BACKEND-API-main/
├── src/
│   ├── config/
│   │   └── soap.js                 # Configurações SOAP
│   ├── controllers/
│   │   ├── colaborador.controller.js
│   │   └── epi.controller.js
│   ├── services/
│   │   ├── colaborador.service.js
│   │   └── epi.service.js
│   ├── routes/
│   │   ├── colaborador.routes.js
│   │   ├── epi.routes.js
│   │   ├── legacy.routes.js
│   │   └── index.js
│   ├── middlewares/
│   │   └── error.middleware.js
│   ├── utils/
│   │   └── soap-client.js
│   └── app.js
├── server.js                      # Ponto de entrada
├── script.js                      # Arquivo legado (mantido)
└── package.json
```

## 🚀 Como Executar

### Instalação

```bash
npm install
```

### Execução

```bash
# Versão nova (recomendada)
npm start

# Versão de desenvolvimento (com nodemon)
npm run dev

# Versão legada (compatibilidade)
npm run start:legacy
```

A API será executada em: `http://localhost:3001`

## 📋 Endpoints

### API REST (Nova Estrutura)

#### Colaboradores
- `GET /api/colaboradores` - Lista todos os colaboradores
- `GET /api/colaboradores/:chapa` - Busca colaborador por chapa
- `GET /api/colaboradores/:chapa/validar` - Valida colaborador
- `GET /api/colaboradores/funcao/:codFuncao` - Colaboradores por função
- `GET /api/colaboradores/secao/:codSecao` - Colaboradores por seção

#### Grupos EPI
- `GET /api/grupos-epi` - Lista todos os grupos EPI
- `GET /api/grupos-epi/:codGrupo` - Busca grupo por código

#### Catálogo EPI
- `GET /api/catalogo-epi` - Lista catálogo completo
- `GET /api/catalogo-epi?codGrupo=001` - Filtra por grupo
- `GET /api/catalogo-epi/disponiveis` - Apenas EPIs disponíveis
- `GET /api/catalogo-epi/grupo/:codGrupo` - EPIs de um grupo específico
- `GET /api/catalogo-epi/:codEpi` - Busca EPI por código
- `GET /api/catalogo-epi/:codEpi/validar` - Valida EPI
- `POST /api/catalogo-epi/multiplos` - Busca múltiplos EPIs

#### Utilitários
- `GET /api` - Informações da API
- `GET /health` - Health check

### Endpoints Legados (Compatibilidade)

- `POST /colaboradores` - Lista colaboradores (legado)
- `POST /grupo-epi` - Lista grupos EPI (legado)
- `POST /catalogo-epi` - Lista catálogo EPI (legado)
- `POST /consulta` - Consulta SOAP genérica (legado)

## 🔧 Estrutura Técnica

### Services (Lógica de Negócio)

#### ColaboradorService
```javascript
// Buscar todos os colaboradores
await ColaboradorService.buscarColaboradores(filters);

// Buscar por chapa
await ColaboradorService.buscarColaboradorPorChapa('00005');

// Validar colaborador
await ColaboradorService.validarColaborador('00005');

// Buscar por função/seção
await ColaboradorService.buscarColaboradoresPorFuncao('01235');
await ColaboradorService.buscarColaboradoresPorSecao('1.01.01.0');
```

#### EpiService
```javascript
// Buscar grupos EPI
await EpiService.buscarGruposEpi(filters);

// Buscar catálogo EPI
await EpiService.buscarCatalogoEpi({ codGrupo: '001' });

// Buscar EPIs por grupo
await EpiService.buscarEpisPorGrupo('001');

// Validar EPI
await EpiService.validarEpi('999');

// Buscar EPIs disponíveis
await EpiService.buscarEpisDisponiveis();
```

### Controllers (Camada de Apresentação)

Os controllers gerenciam requisições HTTP, validações de entrada e formatação de respostas.

### Middlewares

- **Error Handler**: Tratamento centralizado de erros
- **Request Logger**: Log de todas as requisições
- **CORS Handler**: Configuração de CORS
- **Content-Type Validator**: Validação de content-type

### SOAP Client

Cliente centralizado para comunicação com TOTVS:

```javascript
const SoapClient = require('./src/utils/soap-client');

// Executar consulta SOAP
const result = await SoapClient.executeQuery(
    '00.004',  // codSentenca
    '0',       // codColigada  
    'V',       // codSistema
    'COLIGADA=1' // parameters
);

// Testar conectividade
const isConnected = await SoapClient.testConnection();
```

## 📊 Logs e Monitoramento

A API gera logs detalhados:

```
🚀 Iniciando servidor EPI System API...
🔌 Testando conectividade SOAP...
✅ Conectividade SOAP estabelecida
📥 GET /api/colaboradores - 2025-01-XX...
📤 GET /api/colaboradores - 200 - 152ms
```

### Tipos de Log

- `🚀` Inicialização
- `🔌` Conectividade SOAP  
- `📥` Requisições recebidas
- `📤` Respostas enviadas
- `✅` Operações bem-sucedidas
- `❌` Erros
- `⚠️` Avisos
- `🏥` Health checks

## 🛡️ Tratamento de Erros

### Tipos de Erro

- **400 Bad Request**: Parâmetros inválidos
- **404 Not Found**: Recurso não encontrado
- **408 Timeout**: Timeout na conexão SOAP
- **500 Internal Server Error**: Erro interno
- **502 Bad Gateway**: Falha na comunicação SOAP
- **503 Service Unavailable**: Serviço indisponível

### Formato de Resposta de Erro

```json
{
  "success": false,
  "error": "Tipo do erro",
  "message": "Descrição detalhada",
  "timestamp": "2025-01-XX..."
}
```

## 🔄 Migração

### De v1.0 para v2.0

1. **Endpoints legados**: Mantidos para compatibilidade
2. **Novos endpoints**: Seguem padrão REST
3. **Configuração**: Mesmas variáveis de ambiente
4. **Dados**: Mesmo formato de resposta

### Estratégia de Migração

1. **Fase 1**: Deploy da v2.0 com endpoints legados ativos
2. **Fase 2**: Atualizar frontend para usar novos endpoints
3. **Fase 3**: Deprecar endpoints legados (futuro)

## 🚨 Troubleshooting

### Problemas Comuns

1. **Módulo não encontrado**
   ```bash
   npm install
   ```

2. **Erro de conexão SOAP**
   - Verificar conectividade de rede
   - Verificar credenciais em `src/config/soap.js`

3. **Porta em uso**
   ```bash
   PORT=3002 npm start
   ```

4. **Erro de CORS**
   - Middleware CORS já configurado
   - Verificar logs para detalhes

### Debug

1. **Verificar logs**: Console mostra todos os requests/responses
2. **Health check**: `GET /health` para status da API
3. **API info**: `GET /api` para informações dos endpoints
4. **Conectividade SOAP**: Testada automaticamente no startup

## 📈 Performance

### Melhorias v2.0

- **Estrutura modular**: Facilita manutenção
- **Cliente SOAP centralizado**: Reutilização de conexões
- **Tratamento de erros**: Mais robusto e informativo
- **Logs estruturados**: Melhor monitoramento
- **Middlewares**: Funcionalidades transversais organizadas

### Próximas Melhorias

- Cache de consultas SOAP
- Rate limiting
- Autenticação/autorização
- Documentação Swagger
- Testes automatizados

## 🤝 Contribuição

### Adicionando Novas Funcionalidades

1. **Service**: Criar lógica de negócio em `src/services/`
2. **Controller**: Criar endpoint em `src/controllers/`
3. **Route**: Adicionar rota em `src/routes/`
4. **Teste**: Testar via health check e logs

### Estrutura de Commit

```
feat: adiciona endpoint de relatórios
fix: corrige timeout em consultas SOAP
docs: atualiza documentação da API
refactor: reorganiza estrutura de pastas
```

---

**Versão**: 2.0.0  
**Status**: ✅ Produção  
**Compatibilidade**: ✅ Mantém endpoints legados  
**Arquitetura**: 🏗️ Modular e escalável 