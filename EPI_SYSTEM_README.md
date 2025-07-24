# Sistema de Empréstimo de EPIs

Este sistema implementa um wizard completo para gerenciamento de empréstimo de Equipamentos de Proteção Individual (EPIs) seguindo o fluxo específico apresentado nas referências visuais.

## Funcionalidades Principais

### 🎯 Wizard em 5 Etapas

1. **Seleção de Parâmetros**
   - Configuração do tipo de operação (Fornecimento, Devolução, Descarte, Cancelamento)
   - Definição do destino (Funcionários, Qualquer Pessoa, Local de Trabalho)
   - Opção para gerar relatório final

2. **Seleção de Funcionários**
   - Interface para busca e seleção de funcionários
   - Exibição de dados como matrícula, nome, função e seção
   - Seleção múltipla com checkboxes
   - Filtros de busca por diferentes campos

3. **Seleção do Lote**
   - Filtros por código fiscal e grupo EPI
   - Configuração de datas (Livre, Admissão, Última mudança)
   - Grid com EPIs disponíveis
   - Atualização de quantidades por item
   - Opção "Eficaz" para cada EPI

4. **Definir Ação por Lote**
   - Configuração de data de devolução
   - Seleção de ação padrão
   - Listagem detalhada de funcionários e EPIs
   - Validação obrigatória das configurações

5. **Execução Concluída**
   - Confirmação de sucesso
   - Timestamps do processo
   - ID do empréstimo gerado
   - Geração/visualização de relatório
   - Log detalhado do processo

### 🔧 Características Técnicas

- **Framework**: Next.js 15 com TypeScript
- **Estado Global**: Context API para persistência entre telas
- **UI Components**: Radix UI + Tailwind CSS
- **Validação**: Hooks personalizados para validação de cada etapa
- **Navegação**: Navegação sequencial e por saltos (quando permitido)
- **Responsivo**: Interface adaptável para diferentes tamanhos de tela

### 📱 Interface

- Design limpo e profissional seguindo as referências visuais
- Barra de progresso visual
- Navegação intuitiva entre etapas
- Feedback visual para seleções e validações
- Loading states e mensagens de erro/sucesso

### 🗂️ Estrutura de Arquivos

```
src/
├── types/
│   └── epi.ts                    # Tipos TypeScript
├── contexts/
│   └── wizard-context.tsx        # Context para estado global
├── hooks/
│   └── use-wizard-validation.ts  # Hook para validações
├── components/
│   ├── epi-wizard.tsx            # Componente principal
│   ├── wizard-navigation.tsx     # Navegação entre etapas
│   └── steps/
│       ├── parameter-selection.tsx
│       ├── employee-selection.tsx
│       ├── batch-selection.tsx
│       ├── action-definition.tsx
│       └── execution-complete.tsx
└── app/
    └── epi-system/
        └── page.tsx              # Página principal
```

### 🚀 Como Usar

1. Acesse `/epi-system` no navegador
2. Siga o wizard passo a passo:
   - Configure os parâmetros iniciais
   - Selecione os funcionários
   - Escolha os EPIs do lote
   - Defina as ações específicas
   - Confirme a execução

### 🔄 Fluxo de Estados

O sistema mantém todo o estado durante a navegação, permitindo:
- Voltar a etapas anteriores sem perder dados
- Validação em tempo real
- Persistência de seleções
- Consolidação final de todas as informações

### 📊 Dados Mock

O sistema inclui dados de exemplo para demonstração:
- Funcionários com matrículas, nomes e códigos
- EPIs com códigos, lotes e quantidades
- Simulação de processamento de empréstimos

### 🎨 Design System

- **Cores**: Paleta azul para headers e elementos primários
- **Tipografia**: Inter font para melhor legibilidade
- **Componentes**: Baseados no shadcn/ui para consistência
- **Layout**: Cards para organização visual clara

## Extensibilidade

O sistema foi projetado para fácil extensão:
- Adicionar novas etapas ao wizard
- Integrar com APIs reais
- Implementar diferentes tipos de operações
- Personalizar validações específicas
- Adicionar relatórios customizados

## Integração

Para integrar com sistemas existentes:
1. Substitua os dados mock por chamadas de API
2. Implemente autenticação/autorização conforme necessário
3. Configure validações específicas do negócio
4. Personalize o layout conforme identidade visual

Este sistema oferece uma base sólida e extensível para gerenciamento de EPIs em ambientes industriais e corporativos.
