# 🔐 Credenciais de Acesso ao Sistema EPI

## Dados de Login

Para acessar o **Sistema de Empréstimo de EPIs**, use as seguintes credenciais:

### 👤 **Usuário Administrador**
- **Email:** `admin@epicontrol.com`
- **Senha:** `admin123`

### 👥 **Usuário Padrão**
- **Email:** `user@epicontrol.com`  
- **Senha:** `user123`

### 🔧 **Usuário de Manutenção**
- **Email:** `manutencao@epicontrol.com`
- **Senha:** `manut123`

---

## 🌐 Como Acessar

1. **Abra o navegador** e acesse: `http://localhost:3002`
2. **Faça o login** com uma das credenciais acima
3. **Navegue para** "Sistema de Empréstimo de EPIs" no menu lateral
4. **OU acesse diretamente:** `http://localhost:3002/epi-system`

---

## 🎯 Funcionalidades por Usuário

### **Administrador** (`admin@epicontrol.com`)
- ✅ Acesso completo ao sistema de EPIs
- ✅ Todas as operações (Fornecimento, Devolução, Descarte, Cancelamento)
- ✅ Geração de relatórios
- ✅ Configurações do sistema

### **Usuário Padrão** (`user@epicontrol.com`)
- ✅ Acesso ao sistema de EPIs
- ✅ Operações básicas (Fornecimento, Devolução)
- ✅ Consulta de histórico
- ❌ Configurações avançadas

### **Manutenção** (`manutencao@epicontrol.com`)
- ✅ Acesso ao sistema de EPIs
- ✅ Operações de manutenção e descarte
- ✅ Gestão de materiais
- ❌ Cancelamentos de alto nível

---

## 🚀 Primeiro Acesso

1. **Acesse:** `http://localhost:3002`
2. **Credenciais recomendadas para teste:**
   - Email: `admin@epicontrol.com`
   - Senha: `admin123`
3. **Após login**, clique em "Sistema de Empréstimo de EPIs"
4. **Teste o wizard completo** seguindo as 5 etapas

---

## ⚙️ Configurações de Desenvolvimento

Se precisar alterar as credenciais, edite o arquivo:
- `src/app/login/actions.ts` (para autenticação simples)
- `src/contexts/auth-context.tsx` (para autenticação avançada)

---

## 🔒 Segurança

⚠️ **IMPORTANTE:** Estas são credenciais de desenvolvimento/demonstração. 

Para produção:
- Use senhas complexas
- Implemente hash de senhas
- Configure JWT tokens seguros
- Ative HTTPS
- Implemente rate limiting

---

## 📞 Suporte

Se tiver problemas de acesso:
1. Verifique se o servidor está rodando (`npm run dev`)
2. Confirme a porta correta (3002)
3. Limpe cache do navegador
4. Teste com credenciais em modo incognito
