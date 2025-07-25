# 📋 Estruturação e Padronização do Projeto EPI System

## 🎯 Objetivo

Este documento descreve a reestruturação completa do sistema EPI para torná-lo mais **organizado**, **manutenível** e **padronizado**. A refatoração implementou padrões consistentes, validação centralizada e componentes reutilizáveis.

---

## 🏗️ Arquitetura Implementada

### 📁 Estrutura de Pastas

```
src/
├── components/
│   ├── base-step.tsx              # ✨ Componente base para todos os steps
│   ├── epi-wizard.tsx             # 🧙 Componente principal do wizard
│   ├── wizard-navigation.tsx      # 🧭 Navegação entre steps
│   ├── wizard-summary.tsx         # 📊 Resumo do wizard
│   └── steps/
│       ├── parameter-selection.tsx         # Step 1: Parâmetros
│       ├── parameter-selection-new.tsx     # ✨ Exemplo refatorado
│       ├── employee-selection.tsx          # Step 2: Funcionários
│       ├── batch-selection.tsx             # Step 3: Lotes
│       ├── action-definition.tsx           # Step 4: Ações
│       ├── execution-complete.tsx          # Step 5: Execução
│       └── [outros steps específicos]
├── config/
│   └── wizard-flows.ts            # ⚙️ Configuração centralizada
├── constants/
│   └── wizard-constants.ts        # 📝 Constantes e textos
├── contexts/
│   └── wizard-context.tsx         # 🔄 Contexto global do wizard
├── hooks/
│   └── use-wizard-validation.ts   # ✅ Hook de validação
└── types/
    └── epi.ts                     # 📋 Interfaces TypeScript
```

---

## 🔧 Componentes Principais

### 1. **BaseStep** - Componente Base Padronizado

**Localização:** `src/components/base-step.tsx`

Fornece estrutura consistente para todos os steps:

```typescript
interface BaseStepProps {
    onNext?: () => void;
    onPrev?: () => void;
    onValidationChange?: (isValid: boolean) => void;
}

interface StepLayoutConfig {
    title?: string;
    description?: string;
    showCard?: boolean;
    showNavigation?: boolean;
    backButtonLabel?: string;
    nextButtonLabel?: string;
    customButtons?: React.ReactNode;
}
```

**Funcionalidades:**
- ✅ Validação automática
- 🎨 Layout padronizado
- 🧭 Navegação consistente
- 🚨 Alertas de erro/sucesso
- 🎯 Callbacks personalizáveis

### 2. **Configuração Centralizada**

**Localização:** `src/config/wizard-flows.ts`

Centraliza toda a lógica de flows e validação:

```typescript
// Títulos e descrições padronizadas
export const STEP_TITLES = {
    fornecimento: { /* ... */ },
    devolucao: { /* ... */ },
    descarte: { /* ... */ }
};

// Validadores por step
export const stepValidators = {
    validateParameterSelection: (state) => ({ /* ... */ }),
    validateEmployeeSelection: (state) => ({ /* ... */ }),
    // ...
};
```

### 3. **Hook de Validação**

**Localização:** `src/hooks/use-wizard-validation.ts`

Centraliza toda a lógica de validação:

```typescript
export function useWizardValidation() {
    return {
        currentStepValidation,
        isCurrentStepValid,
        currentStepErrors,
        canNavigateNext,
        canNavigatePrev,
        canNavigateTo,
        progress,
        // ...
    };
}
```

### 4. **Constantes e Textos**

**Localização:** `src/constants/wizard-constants.ts`

Centraliza todos os textos e configurações:

```typescript
export const UI_TEXTS = {
    navigation: { cancel: 'Cancelar', next: 'Avançar →' },
    validation: { required: 'Este campo é obrigatório' },
    // ...
};

export const FORM_CONFIG = {
    operationTypes: [/* ... */],
    destinations: [/* ... */],
    // ...
};
```

---

## 🎨 Padrões de Desenvolvimento

### ✅ Como Criar um Novo Step

1. **Importe as dependências padrão:**
```typescript
import { BaseStep, useStepLayout } from '@/components/base-step';
import { UI_TEXTS, FORM_CONFIG } from '@/constants/wizard-constants';
import { BaseStepProps } from '@/types/epi';
```

2. **Implemente a interface BaseStepProps:**
```typescript
export default function MeuStep(props: BaseStepProps) {
    const { getDefaultLayout } = useStepLayout();
    
    const stepLayout = getDefaultLayout({
        title: 'Título do Step',
        description: 'Descrição do step',
        nextButtonLabel: 'Próximo →'
    });
    
    return (
        <BaseStep layout={stepLayout} {...props}>
            {/* Conteúdo do step */}
        </BaseStep>
    );
}
```

3. **Adicione validação personalizada:**
```typescript
const validateStep = (): boolean => {
    // Lógica de validação
    return true;
};

<BaseStep 
    layout={stepLayout} 
    onValidate={validateStep}
    {...props}
>
```

### 🎯 Padrões de Validação

```typescript
// ✅ BOM: Usar validadores centralizados
const validation = validateStep(currentStep, state);

// ❌ RUIM: Validação inline
if (!state.selectedEmployees.length) { /* ... */ }
```

### 📝 Padrões de Texto

```typescript
// ✅ BOM: Usar constantes
title: UI_TEXTS.wizardTitles.fornecimento

// ❌ RUIM: Strings hardcoded
title: 'Assistente para Fornecimento Automático'
```

---

## 🔄 Fluxos Suportados

### 1. **Fornecimento** (`fornecimento`)
1. Seleção de Parâmetros
2. Seleção de Funcionários  
3. Seleção do Lote
4. Definir Ação por Lote
5. Execução Concluída

### 2. **Devolução** (`devolucao`)
1. Seleção de Parâmetros
2. Seleção de Funcionários
3. Definir Ação por Lote
4. Motivo da Devolução
5. Execução Concluída

### 3. **Descarte** (`descarte`)
1. Seleção de Parâmetros
2. Seleção de Funcionários
3. Definir Ação por Lote
4. Motivo do Descarte
5. Execução Concluída

---

## 🚀 Benefícios da Reestruturação

### 🎯 **Consistência**
- ✅ Layout padronizado em todos os steps
- ✅ Navegação uniforme
- ✅ Validação centralizada
- ✅ Mensagens de erro consistentes

### 🔧 **Manutenibilidade**
- ✅ Código reutilizável (BaseStep)
- ✅ Configuração centralizada
- ✅ Separação de responsabilidades
- ✅ TypeScript com interfaces bem definidas

### 📈 **Escalabilidade**
- ✅ Fácil adição de novos flows
- ✅ Novos steps seguem padrão automático
- ✅ Validação extensível
- ✅ Temas e estilos centralizados

### 🧪 **Testabilidade**
- ✅ Componentes isolados
- ✅ Hooks testáveis independentemente
- ✅ Validação separada da UI
- ✅ Mocks mais simples

---

## 📋 Checklist de Migração

### ✅ **Implementado**
- [x] Interfaces padronizadas (`BaseStepProps`, `StepValidation`)
- [x] Hook de validação customizado (`useWizardValidation`)
- [x] Configuração centralizada (`wizard-flows.ts`)
- [x] Componente base (`BaseStep`)
- [x] Constantes e textos (`wizard-constants.ts`)
- [x] Contexto atualizado com validação
- [x] Navigation refatorado
- [x] Exemplo de step refatorado (`parameter-selection-new.tsx`)

### 🔄 **Em Andamento**
- [ ] Migrar todos os steps existentes para BaseStep
- [ ] Implementar testes unitários
- [ ] Documentação de APIs
- [ ] Guia de estilo visual

### 📋 **Próximos Passos**
- [ ] Migrar `employee-selection.tsx`
- [ ] Migrar `batch-selection.tsx`
- [ ] Migrar `action-definition.tsx`
- [ ] Migrar `execution-complete.tsx`
- [ ] Implementar novos flows se necessário

---

## 📚 Exemplos de Uso

### 🎯 **Step Simples**
```typescript
export default function MeuStep(props: BaseStepProps) {
    const { getDefaultLayout } = useStepLayout();
    
    return (
        <BaseStep layout={getDefaultLayout()} {...props}>
            <div>Conteúdo do step</div>
        </BaseStep>
    );
}
```

### 🔧 **Step com Validação Custom**
```typescript
export default function StepComValidacao(props: BaseStepProps) {
    const { state } = useWizard();
    const { getDefaultLayout } = useStepLayout();
    
    const validateCustom = () => {
        return state.selectedEmployees.length > 0;
    };
    
    return (
        <BaseStep 
            layout={getDefaultLayout()} 
            onValidate={validateCustom}
            {...props}
        >
            <div>Conteúdo com validação</div>
        </BaseStep>
    );
}
```

### 🎨 **Step com Layout Personalizado**
```typescript
export default function StepPersonalizado(props: BaseStepProps) {
    const { getDefaultLayout } = useStepLayout();
    
    const customLayout = getDefaultLayout({
        title: 'Título Personalizado',
        nextButtonLabel: 'Finalizar Processo',
        nextButtonVariant: 'destructive',
        showCard: false
    });
    
    return (
        <BaseStep layout={customLayout} {...props}>
            <div>Conteúdo personalizado</div>
        </BaseStep>
    );
}
```

---

## 🎯 **Conclusão**

A reestruturação implementou:

1. **Padrões consistentes** em toda a aplicação
2. **Validação centralizada** e reutilizável  
3. **Componentes base** que facilitam desenvolvimento
4. **Configuração centralizada** para fácil manutenção
5. **TypeScript robusto** com interfaces bem definidas
6. **Documentação completa** para facilitar onboarding

O projeto agora segue **boas práticas** de desenvolvimento React/TypeScript e está preparado para **crescimento sustentável**. 🚀 