# CALLEVA IA - Design do Aplicativo Móvel

## Visão Geral

O CALLEVA IA é um aplicativo móvel de GRC (Governança, Risco e Compliance) que permite aos gestores interagir rapidamente com uma IA assistente e visualizar dados críticos do cliente vinculado. O design segue as diretrizes Apple Human Interface Guidelines para uma experiência nativa iOS.

---

## Telas do Aplicativo

### 1. Home (Dashboard)
**Propósito:** Visão geral rápida das métricas de GRC do cliente

**Conteúdo:**
- Header com logo CALLEVA IA e barra de busca global
- Cards de estatísticas rápidas:
  - Total de Atividades de Tratamento
  - Riscos Elevados/Muito Elevados
  - Fornecedores Pendentes
  - Tarefas Vencidas
- Gráfico de pizza: Riscos por Classificação
- Gráfico de barras: Atividades por Status
- Botão flutuante de acesso rápido ao Chat IA

### 2. Chat IA (Calleva)
**Propósito:** Conversa inteligente com a IA Calleva para consultas rápidas

**Conteúdo:**
- Header com avatar da Calleva e indicador de status
- Área de mensagens com bolhas de chat
- Campo de entrada de texto com botão enviar
- Sugestões rápidas de perguntas (chips)
- Indicador de digitação da IA

### 3. Dados do Cliente
**Propósito:** Visualização detalhada dos dados do cliente vinculado

**Conteúdo:**
- Informações do cliente (nome, CNPJ, setor)
- Resumo de compliance
- Lista de módulos com contadores:
  - ROPA (Atividades de Tratamento)
  - Gestão de Riscos
  - Fornecedores
  - Incidentes
  - Tarefas
- Indicadores de saúde por área

### 4. Busca Global
**Propósito:** Pesquisa unificada em todos os módulos

**Conteúdo:**
- Campo de busca com ícone
- Filtros por módulo (chips selecionáveis)
- Lista de resultados agrupados por tipo
- Preview de cada resultado com título e descrição
- Navegação para detalhes

---

## Fluxos de Usuário Principais

### Fluxo 1: Consulta Rápida à IA
1. Usuário toca no botão flutuante de Chat ou na aba Chat
2. Tela de chat abre com saudação da Calleva
3. Usuário digita pergunta ou seleciona sugestão
4. IA responde com informações contextualizadas
5. Usuário pode continuar a conversa ou voltar

### Fluxo 2: Verificar Estatísticas
1. Usuário abre o app na Home
2. Visualiza cards de métricas rápidas
3. Toca em um card para ver detalhes
4. Gráficos mostram distribuição visual
5. Pode deslizar para atualizar dados

### Fluxo 3: Busca de Informações
1. Usuário toca na barra de busca (Home ou aba Busca)
2. Digita termo de pesquisa
3. Resultados aparecem em tempo real
4. Filtra por módulo se necessário
5. Toca em resultado para ver detalhes

---

## Paleta de Cores

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| **primary** | #6366F1 | #818CF8 | Botões, links, destaques |
| **background** | #F8FAFC | #0F172A | Fundo das telas |
| **surface** | #FFFFFF | #1E293B | Cards e superfícies |
| **foreground** | #0F172A | #F1F5F9 | Texto principal |
| **muted** | #64748B | #94A3B8 | Texto secundário |
| **border** | #E2E8F0 | #334155 | Bordas e divisores |
| **success** | #10B981 | #34D399 | Status positivo |
| **warning** | #F59E0B | #FBBF24 | Alertas |
| **error** | #EF4444 | #F87171 | Erros e riscos altos |

---

## Componentes Principais

### Cards de Estatística
- Ícone à esquerda com cor de destaque
- Valor numérico grande e bold
- Label descritivo em muted
- Indicador de tendência (opcional)

### Gráficos
- Gráfico de pizza para distribuições
- Gráfico de barras horizontais para comparações
- Cores consistentes com paleta
- Legendas claras e compactas

### Chat Bubbles
- Mensagens do usuário: alinhadas à direita, cor primary
- Mensagens da IA: alinhadas à esquerda, cor surface
- Avatar da Calleva nas mensagens da IA
- Timestamps discretos

### Barra de Busca
- Campo com ícone de lupa
- Placeholder contextual
- Botão de limpar quando há texto
- Feedback visual ao focar

---

## Navegação

**Tab Bar (4 abas):**
1. **Home** - Dashboard com estatísticas
2. **Chat** - Conversa com Calleva IA
3. **Dados** - Informações do cliente
4. **Busca** - Pesquisa global

**Ícones:**
- Home: house.fill
- Chat: message.fill
- Dados: person.crop.circle.fill
- Busca: magnifyingglass

---

## Responsividade

- Layout otimizado para portrait (9:16)
- Uso de uma mão considerado
- Botões e áreas de toque mínimo 44pt
- Scroll suave em listas longas
- Pull-to-refresh onde aplicável
