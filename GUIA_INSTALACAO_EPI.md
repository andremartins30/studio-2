# Guia de Instalação e Uso - Sistema de Empréstimo de EPIs

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn como gerenciador de pacotes
- Next.js 15+ (já incluído no package.json)

## 🚀 Instalação

1. **Clone ou baixe o projeto**
   ```bash
   git clone <repository-url>
   cd studio-2
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse o sistema**
   - Servidor local: `http://localhost:3000`
   - Sistema de EPIs: `http://localhost:3000/epi-system`

## 🎯 Como Usar o Sistema

### Passo 1: Seleção de Parâmetros
1. Escolha o tipo de operação (Fornecimento, Devolução, Descarte, Cancelamento)
2. Defina o destino (Funcionários, Qualquer Pessoa, Local de Trabalho)
3. Marque se deseja gerar relatório
4. Clique em "Avançar"

### Passo 2: Seleção de Funcionários
1. Use a busca para filtrar funcionários por nome, matrícula, função ou seção
2. Marque os checkboxes dos funcionários desejados
3. Visualize os selecionados na seção inferior
4. Clique em "Avançar"

### Passo 3: Seleção do Lote
1. Configure filtros por código fiscal e grupo EPI
2. Defina a data de consideração (Livre, Admissão, Última mudança)
3. Selecione EPIs disponíveis na tabela
4. Ajuste quantidades conforme necessário
5. Clique em "Avançar"

### Passo 4: Definir Ação por Lote
1. Configure data de devolução padrão
2. Selecione ação padrão (Fornecer, Devolver, etc.)
3. Revise e ajuste ações individuais se necessário
4. Confirme a validação das ações
5. Clique em "Avançar"

### Passo 5: Execução Concluída
1. Visualize o status de sucesso
2. Anote o ID do empréstimo gerado
3. Gere relatório se configurado
4. Clique em "Fechar" para reiniciar

## 🔧 Funcionalidades Principais

### Navegação Inteligente
- **Navegação Sequencial**: Use os botões Voltar/Avançar
- **Navegação por Saltos**: Clique nos números das etapas (apenas para etapas já visitadas)
- **Validação Automática**: Sistema impede avanço sem dados obrigatórios

### Estado Persistente
- Todas as seleções são mantidas durante a navegação
- Possível voltar e alterar configurações sem perder dados
- Estado é limpo apenas ao finalizar ou cancelar

### Feedback Visual
- **Notificações**: Toast messages para sucesso/erro/aviso
- **Progress Bar**: Barra de progresso visual
- **Badges e Status**: Indicadores visuais de estado
- **Resumo Dinâmico**: Painel de resumo em tempo real

### Responsividade
- Interface adapta-se a diferentes tamanhos de tela
- Tabelas com scroll horizontal em mobile
- Layout flexível para dispositivos móveis

## 📊 Dados de Demonstração

O sistema inclui dados mock para demonstração:

### Funcionários
- 8 funcionários com diferentes matrículas, funções e seções
- Dados incluem: nome, matrícula, código de função, código de seção

### EPIs
- 8 tipos de EPIs diferentes (capacetes, óculos, luvas, etc.)
- Dados incluem: código, lote, CA, nome, seção, filial, data de aquisição, quantidade

### Funcionalidades Mock
- Simulação de processamento de empréstimos
- Geração de IDs únicos
- Timestamps de processo
- Log detalhado de operações

## 🎨 Personalização

### Temas e Cores
- Base em Tailwind CSS para fácil customização
- Variáveis CSS definidas em `globals.css`
- Paleta de cores configurável

### Componentes
- Baseado em shadcn/ui para consistência
- Componentes reutilizáveis e modulares
- Fácil extensão e modificação

### Validações
- Hook `useWizardValidation` para regras customizadas
- Validações por etapa configuráveis
- Mensagens de erro personalizáveis

## 🔗 Integração com APIs

Para conectar com sistemas reais:

1. **Substitua os dados mock**:
   ```typescript
   // Em vez de mockEmployees
   const employees = await fetchEmployees();
   
   // Em vez de mockEpis
   const epis = await fetchEpis();
   ```

2. **Implemente endpoints**:
   ```typescript
   // api/employees
   // api/epis
   // api/loans
   ```

3. **Configure autenticação**:
   ```typescript
   // Integre com sistema de auth existente
   // Valide permissões por operação
   ```

## 🛠️ Desenvolvimento

### Estrutura de Pastas
```
src/
├── app/epi-system/         # Página principal
├── components/
│   ├── steps/              # Componentes de cada etapa
│   ├── epi-wizard.tsx      # Wizard principal
│   ├── wizard-navigation.tsx # Navegação
│   └── wizard-summary.tsx  # Resumo
├── contexts/               # Context API (estado global)
├── hooks/                  # Hooks customizados
├── types/                  # Tipos TypeScript
└── data/                   # Dados mock
```

### Adicionando Nova Etapa
1. Crie componente em `components/steps/`
2. Adicione ao enum `WizardStep` em types
3. Inclua no switch do `epi-wizard.tsx`
4. Atualize validações em `useWizardValidation`

### Adicionando Novos Campos
1. Atualize interface `WizardState` em types
2. Adicione ao estado inicial no context
3. Implemente nos componentes relevantes
4. Atualize validações se necessário

## 🐛 Solução de Problemas

### Porta em Uso
```bash
npx next dev -p 3001  # Use porta diferente
```

### Problemas de CSS
- Verifique se Tailwind está configurado
- Confirme importação do `globals.css`

### Erros de TypeScript
- Execute `npm run typecheck`
- Verifique tipos em `src/types/epi.ts`

### Performance
- Use React.memo para componentes pesados
- Implemente lazy loading para tabelas grandes
- Considere paginação para muitos dados

## 📈 Próximas Funcionalidades

Funcionalidades planejadas para versões futuras:

- [ ] Relatórios em PDF
- [ ] Exportação para Excel
- [ ] Histórico de operações
- [ ] Dashboard analítico
- [ ] Notificações em tempo real
- [ ] Backup automático de estado
- [ ] Multi-idioma
- [ ] Temas dark/light
- [ ] API REST completa
- [ ] Testes automatizados

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte este guia primeiro
2. Verifique os logs do console
3. Teste com dados mock fornecidos
4. Documente erros com print screens

O sistema foi desenvolvido para ser intuitivo e fácil de usar, seguindo as melhores práticas de UX/UI para sistemas corporativos.
