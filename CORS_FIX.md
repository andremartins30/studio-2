# 🚨 **Erro de CORS - Como Resolver**

## **Problema**
```
Access to fetch at 'http://localhost:3001/api/v1/auth/login' from origin 'http://localhost:9002' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
The 'Access-Control-Allow-Origin' header has a value 'http://localhost:3000' that is not equal to the supplied origin.
```

## **Causa**
Sua API está configurada para aceitar apenas requests de `http://localhost:3000`, mas o Next.js estava rodando na porta `9002`.

## ✅ **Soluções Implementadas**

### **1. Mudança de Porta (Aplicada)**
- Alterado o script `dev` no `package.json` para rodar na porta `3000`
- Agora o Next.js roda em `http://localhost:3000` (mesmo que sua API espera)

### **2. Melhor Tratamento de Erros (Aplicado)**
- Adicionado método `handleFetch` para capturar erros de conectividade
- Mensagens de erro mais claras quando há problemas de CORS

## 🔧 **Configuração CORS no Backend**

Se você ainda tiver problemas ou quiser rodar em outra porta, configure o CORS no seu backend:

### **Express.js**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:9002',
    'http://localhost:3001',
    // adicione outras origens se necessário
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **FastAPI (Python)**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:9002",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Node.js Puro**
```javascript
// No seu servidor HTTP
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000,http://localhost:9002');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Credentials', 'true');
```

## 🚀 **Como Testar Agora**

1. **Pare o servidor Next.js** (Ctrl+C)
2. **Reinicie** com: `npm run dev`
3. **Acesse**: `http://localhost:3000`
4. **Teste o login** - agora deve funcionar!

## 🔍 **Verificações**

- ✅ **Porta corrigida**: Next.js agora roda na porta 3000
- ✅ **Erros melhorados**: Mensagens mais claras
- ✅ **HandleFetch**: Melhor tratamento de falhas de conectividade

## 📝 **Próximos Passos**

Se ainda houver problemas:

1. **Verifique se sua API está rodando** em `http://localhost:3001`
2. **Teste a API diretamente** com Postman/Insomnia
3. **Configure CORS no backend** se necessário
4. **Verifique os logs do backend** para outros erros

## 🎯 **Resumo**

O problema era incompatibilidade de portas. Agora que o Next.js roda na porta que sua API espera (`3000`), a autenticação deve funcionar perfeitamente!
