// Mock data for CALLEVA IA app demonstration
// In production, this would be fetched from the GRC-NEXT API

export interface DashboardMetrics {
  totalAtividades: number;
  atividadesAtivas: number;
  atividadesEmAvaliacao: number;
  atividadesEncerradas: number;
  totalRiscos: number;
  riscosElevados: number;
  riscosMuitoElevados: number;
  totalFornecedores: number;
  fornecedoresPendentesTriagem: number;
  fornecedoresAltoRisco: number;
  tarefasPendentes: number;
  tarefasVencidas: number;
  riscosPorClassificacao: { classificacao: string; count: number }[];
  atividadesPorStatus: { status: string; count: number }[];
}

export interface ClienteInfo {
  id: string;
  nome: string;
  cnpj: string;
  setor: string;
  responsavel: string;
  email: string;
  telefone: string;
  dataContrato: string;
  plano: string;
}

export interface ModuloResumo {
  nome: string;
  total: number;
  pendentes: number;
  concluidos: number;
  alertas: number;
}

export interface SearchResult {
  id: string;
  module: string;
  title: string;
  description: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Mock Dashboard Data
export const mockDashboardMetrics: DashboardMetrics = {
  totalAtividades: 47,
  atividadesAtivas: 32,
  atividadesEmAvaliacao: 8,
  atividadesEncerradas: 7,
  totalRiscos: 23,
  riscosElevados: 5,
  riscosMuitoElevados: 2,
  totalFornecedores: 156,
  fornecedoresPendentesTriagem: 12,
  fornecedoresAltoRisco: 3,
  tarefasPendentes: 18,
  tarefasVencidas: 4,
  riscosPorClassificacao: [
    { classificacao: "Muito Baixo", count: 6 },
    { classificacao: "Baixo", count: 8 },
    { classificacao: "Médio", count: 2 },
    { classificacao: "Elevado", count: 5 },
    { classificacao: "Muito Elevado", count: 2 },
  ],
  atividadesPorStatus: [
    { status: "Ativa", count: 32 },
    { status: "Em avaliação", count: 8 },
    { status: "Encerrada", count: 7 },
  ],
};

// Mock Cliente Info
export const mockClienteInfo: ClienteInfo = {
  id: "cli_001",
  nome: "Empresa Exemplo LTDA",
  cnpj: "12.345.678/0001-90",
  setor: "Tecnologia",
  responsavel: "João Silva",
  email: "joao.silva@exemplo.com.br",
  telefone: "(11) 99999-9999",
  dataContrato: "2024-01-15",
  plano: "Enterprise",
};

// Mock Módulos Resumo
export const mockModulosResumo: ModuloResumo[] = [
  { nome: "ROPA", total: 47, pendentes: 8, concluidos: 32, alertas: 3 },
  { nome: "Gestão de Riscos", total: 23, pendentes: 7, concluidos: 14, alertas: 7 },
  { nome: "Fornecedores", total: 156, pendentes: 12, concluidos: 141, alertas: 3 },
  { nome: "Incidentes", total: 8, pendentes: 2, concluidos: 6, alertas: 2 },
  { nome: "Tarefas", total: 45, pendentes: 18, concluidos: 23, alertas: 4 },
];

// Mock Search Results
export const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    module: "ropa",
    title: "Processamento de Dados de RH",
    description: "Atividade de tratamento para gestão de funcionários",
    url: "/ropa/1",
  },
  {
    id: "2",
    module: "grc",
    title: "Risco de Vazamento de Dados",
    description: "Risco identificado no sistema de CRM",
    url: "/grc/2",
  },
  {
    id: "3",
    module: "fornecedores",
    title: "Cloud Provider ABC",
    description: "Fornecedor de infraestrutura em nuvem",
    url: "/fornecedores/3",
  },
  {
    id: "4",
    module: "incidentes",
    title: "Incidente #2024-001",
    description: "Acesso não autorizado detectado",
    url: "/incidentes/4",
  },
];

// Initial Chat Messages
export const initialChatMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Olá! Sou a Calleva, sua assistente de GRC. Como posso ajudar você hoje? Posso responder perguntas sobre atividades de tratamento, riscos, fornecedores e muito mais.",
    timestamp: new Date(),
  },
];

// Quick Suggestions for Chat
export const chatSuggestions = [
  "Quantos riscos elevados temos?",
  "Resumo das atividades de tratamento",
  "Fornecedores pendentes de triagem",
  "Tarefas vencidas",
];

// CALLEVA Brand Color mapping for risk levels
export const riskColors = {
  "Muito Baixo": "#4A8BA8",
  "Baixo": "#5A9AB8",
  "Médio": "#F59E0B",
  "Elevado": "#EF4444",
  "Muito Elevado": "#DC2626",
};

// CALLEVA Brand Color mapping for activity status
export const statusColors = {
  "Ativa": "#1E3A4C",
  "Em avaliação": "#F59E0B",
  "Encerrada": "#5A7A8A",
};

// Module icons mapping
export const moduleIcons: Record<string, string> = {
  ropa: "📋",
  grc: "⚠️",
  fornecedores: "🏢",
  incidentes: "🚨",
  tarefas: "✅",
  politicas: "📄",
  contratos: "📝",
};
