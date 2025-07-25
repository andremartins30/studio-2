# 🔐 Credenciais de Teste - Autenticação Local

## 📋 **Credenciais Hardcoded**

Para fazer login na aplicação, use as seguintes credenciais:

### **👤 Usuário Admin**
```
Email: admin@epicontrol.com
Senha: admin123
```

## 🎯 **Dados do Usuário**
Após o login, o sistema carregará os seguintes dados:

```json
{
  "id": "1",
  "name": "André Silva",
  "email": "admin@epicontrol.com", 
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-07-15T00:00:00Z"
}
```

## ✅ **Funcionalidades Disponíveis**

### **🔑 Login**
- Email e senha validados localmente
- Simulação de delay de API (1 segundo)
- Token mock gerado automaticamente
- Dados salvos no localStorage

### **📝 Registro**
- Cria novo usuário com dados fornecidos
- Role padrão: 'user'
- Token mock gerado
- Dados salvos no localStorage

### **👤 Perfil**
- Editar nome e email
- Simulação de delay de API
- Dados atualizados no localStorage

### **🔒 Alterar Senha**
- Valida senha atual contra 'admin123'
- Simulação de alteração (apenas log)
- Delay simulado

### **🚪 Logout**
- Remove dados do localStorage
- Simulação de delay (0.5 segundos)
- Redirecionamento automático

## 🧪 **Como Testar**

1. **Acesse**: `http://localhost:3000`
2. **Login**: Use as credenciais acima
3. **Navegue**: Teste todas as páginas protegidas
4. **Perfil**: Vá em Configurações para editar dados
5. **Logout**: Use o botão na sidebar

## 🔧 **Configuração**

O sistema está configurado para trabalhar **sem API externa**:
- ✅ Autenticação local
- ✅ Dados mockados  
- ✅ Persistência no localStorage
- ✅ Simulação de delays de rede
- ✅ Validação de credenciais

## 📝 **Notas**

- **Credenciais**: Definidas em `/src/contexts/auth-context.tsx`
- **Persistência**: Dados salvos no localStorage do navegador
- **Token**: Mock gerado com timestamp
- **Validação**: Feita no lado do cliente
- **Delays**: Simulam chamadas de API reais
