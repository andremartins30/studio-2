# Studio EPI Control Center - Integração com API

Este projeto foi integrado com uma API personalizada para autenticação e gerenciamento de usuários.

## 🚀 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 2. API Endpoints

A aplicação está configurada para usar os seguintes endpoints:

#### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário  
- `GET /auth/profile` - Obter perfil do usuário
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Renovar token

#### Usuários
- `PUT /users/profile` - Atualizar perfil
- `PUT /users/password` - Alterar senha
- `DELETE /users/deactivate` - Desativar conta

### 3. Estrutura da API Response

#### Login/Register Response
```json
{
  "message": "string",
  "accessToken": "string",
  "user": {
    "id": "string",
    "name": "string", 
    "email": "string",
    "role": "user" | "admin",
    "isActive": boolean,
    "lastLogin": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## 🔧 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com email/senha
- [x] Registro de novos usuários
- [x] Logout completo
- [x] Proteção de rotas 
- [x] Gerenciamento de token no localStorage
- [x] Validação automática de token

### ✅ Interface
- [x] Formulário de login integrado
- [x] Formulário de registro integrado
- [x] Sidebar com informações do usuário logado
- [x] Botão de logout funcional
- [x] Redirecionamentos automáticos

### ✅ Páginas Protegidas
- [x] Dashboard
- [x] Cadastro Biométrico  
- [x] Verificação de Identidade
- [x] Gestão de Materiais
- [x] Histórico de Transações
- [x] Configurações (com edição de perfil)
- [x] Ajuda & Suporte

### ✅ Gerenciamento de Estado
- [x] Context API para autenticação
- [x] Hook personalizado `useAuth`
- [x] Proteção de componentes com `ProtectedPage`
- [x] Loading states e error handling

## 🎯 Como Usar

### 1. Instalação
```bash
npm install
# ou
yarn install
```

### 2. Configurar API URL
Configure a URL da sua API no arquivo `.env.local`

### 3. Executar
```bash
npm run dev
# ou  
yarn dev
```

### 4. Acessar
- Aplicação: http://localhost:3000
- Login: será redirecionado automaticamente para `/login`
- Após login: redirecionado para `/dashboard`

## 📁 Estrutura de Arquivos Importantes

```
src/
├── contexts/auth-context.tsx     # Context de autenticação
├── lib/api.ts                    # Serviço da API
├── components/
│   ├── protected-page.tsx        # Wrapper para páginas protegidas
│   ├── app-layout.tsx           # Layout principal com sidebar
│   └── settings-form.tsx        # Formulário de configurações
├── app/
│   ├── login/                   # Página de login
│   ├── register/                # Página de registro
│   └── [outras-paginas]/        # Páginas protegidas
└── middleware.ts                # Middleware simplificado
```

## 🔐 Fluxo de Autenticação

1. **Acesso inicial**: Usuário é redirecionado para `/login`
2. **Login**: Credenciais são enviadas para API
3. **Token**: Token JWT é armazenado no localStorage 
4. **Validação**: Token é validado ao carregar a página
5. **Acesso**: Usuário acessa páginas protegidas
6. **Logout**: Token é removido e usuário volta ao login

## 🛡️ Segurança

- Tokens são armazenados no localStorage
- Todas as páginas protegidas verificam autenticação
- Logout limpa completamente o estado de autenticação
- Headers de autorização são enviados automaticamente

## 🧪 Teste da Integração

Para testar se a integração está funcionando:

1. Certifique-se que sua API está rodando
2. Configure a URL correta no `.env.local`
3. Acesse a aplicação e tente fazer login
4. Verifique se os dados do usuário aparecem na sidebar
5. Teste as funcionalidades de perfil nas configurações

## 📝 Próximos Passos

- [ ] Implementar refresh automático de token
- [ ] Adicionar interceptors para erro 401
- [ ] Implementar funcionalidades de admin  
- [ ] Adicionar validação de formulários mais robusta
- [ ] Implementar upload de avatar
- [ ] Adicionar logs de auditoria
