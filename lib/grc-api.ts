// GRC-NEXT API Integration Services
// Connects to the GRC-NEXT backend with Clerk authentication

// ============================================================================
// Types matching GRC-NEXT dashboard-actions.ts
// ============================================================================

export interface DashboardMetrics {
  totalAtividades: number;
  atividadesAtivas: number;
  atividadesEmAvaliacao: number;
  atividadesEncerradas: number;
  atividadesCompartilhamentoInternacional: number;
  atividadesPorStatus: { status: string; count: number }[];
  atividadesPorBaseLegal: { base_legal: string; count: number }[];
  totalRiscos: number;
  riscosElevados: number;
  riscosMuitoElevados: number;
  riscosPorClassificacao: { classificacao: string; count: number }[];
  riscosSemTratamento: number;
  riscosPorStatusPrincipal: { status: string; count: number }[];
  riscosPorStatusTratamento: { status: string; count: number }[];
  riscosPorRespostaRisco: { resposta: string; count: number }[];
  riscosTratamentoConcluido: number;
  riscosEmTratamento: number;
  riscosPendentes: number;
  riscosIdentificados: number;
  riscosPorLabel: { label: string; count: number }[];
  totalFornecedores: number;
  fornecedoresPorClassificacao: { classificacao: string; count: number }[];
  fornecedoresPendentesTriagem: number;
  fornecedoresAltoRisco: number;
  avaliacoesAltoRisco: number;
  avaliacoesRequerRIPD: number;
  tarefasPendentes: number;
  tarefasVencidas: number;
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
  icone: string;
  total: number;
  pendentes: number;
  concluidos: number;
  alertas: number;
  progresso: number;
}

export interface SearchResult {
  id: string;
  module: string;
  title: string;
  description: string;
  url: string;
  source?: "texto" | "embedding";
  score?: number | null;
}

export interface CallevaAIResponse {
  success: boolean;
  response?: {
    message: string;
    suggestions?: string[];
  };
  error?: string;
}

// ============================================================================
// API Base URL Configuration
// ============================================================================

const GRC_API_BASE_URL = process.env.EXPO_PUBLIC_GRC_API_URL || "https://app.calleva.com.br";

// ============================================================================
// API Client with Clerk Auth
// ============================================================================

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  getToken: () => Promise<string | null>
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${GRC_API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API call failed: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return {} as T;
  } catch (error) {
    console.error("[GRC-API] Request failed:", error);
    throw error;
  }
}

// ============================================================================
// API Service Functions
// ============================================================================

export async function fetchDashboardMetrics(
  getToken: () => Promise<string | null>
): Promise<DashboardMetrics | null> {
  try {
    const result = await apiCall<{ data: DashboardMetrics }>(
      "/api/mobile/dashboard",
      { method: "GET" },
      getToken
    );
    return result.data;
  } catch (error) {
    console.error("[GRC-API] Error fetching dashboard metrics:", error);
    return null;
  }
}

export async function fetchClienteInfo(
  getToken: () => Promise<string | null>
): Promise<ClienteInfo | null> {
  try {
    const result = await apiCall<{ data: ClienteInfo }>(
      "/api/mobile/cliente",
      { method: "GET" },
      getToken
    );
    return result.data;
  } catch (error) {
    console.error("[GRC-API] Error fetching cliente info:", error);
    return null;
  }
}

export async function fetchModulosResumo(
  getToken: () => Promise<string | null>
): Promise<ModuloResumo[]> {
  try {
    const result = await apiCall<{ data: ModuloResumo[] }>(
      "/api/mobile/modulos",
      { method: "GET" },
      getToken
    );
    return result.data || [];
  } catch (error) {
    console.error("[GRC-API] Error fetching modulos resumo:", error);
    return [];
  }
}

export async function searchGlobal(
  query: string,
  modules: string[] | undefined,
  getToken: () => Promise<string | null>
): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({ query });
    if (modules && modules.length > 0) {
      params.set("modules", modules.join(","));
    }

    const result = await apiCall<{ data: SearchResult[] }>(
      `/api/mobile/search?${params.toString()}`,
      { method: "GET" },
      getToken
    );
    return result.data || [];
  } catch (error) {
    console.error("[GRC-API] Error performing global search:", error);
    return [];
  }
}

export async function askCallevaAI(
  sessionId: string,
  question: string,
  context: string | undefined,
  getToken: () => Promise<string | null>
): Promise<CallevaAIResponse> {
  try {
    const result = await apiCall<CallevaAIResponse>(
      "/api/mobile/calleva-ai",
      {
        method: "POST",
        body: JSON.stringify({ sessionId, question, context }),
      },
      getToken
    );
    return result;
  } catch (error) {
    console.error("[GRC-API] Error asking Calleva AI:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao comunicar com a IA",
    };
  }
}

// ============================================================================
// Mock Data for Development (when API is not available)
// ============================================================================

export function getMockDashboardMetrics(): DashboardMetrics {
  return {
    totalAtividades: 156,
    atividadesAtivas: 89,
    atividadesEmAvaliacao: 34,
    atividadesEncerradas: 33,
    atividadesCompartilhamentoInternacional: 12,
    atividadesPorStatus: [
      { status: "Ativa", count: 89 },
      { status: "Em avaliação", count: 34 },
      { status: "Encerrada", count: 33 },
    ],
    atividadesPorBaseLegal: [
      { base_legal: "Consentimento", count: 45 },
      { base_legal: "Legítimo Interesse", count: 38 },
      { base_legal: "Contrato", count: 32 },
      { base_legal: "Obrigação Legal", count: 41 },
    ],
    totalRiscos: 87,
    riscosElevados: 23,
    riscosMuitoElevados: 8,
    riscosPorClassificacao: [
      { classificacao: "Muito elevado", count: 8 },
      { classificacao: "Elevado", count: 23 },
      { classificacao: "Médio", count: 31 },
      { classificacao: "Baixo", count: 25 },
    ],
    riscosSemTratamento: 15,
    riscosPorStatusPrincipal: [
      { status: "Identificado", count: 20 },
      { status: "Em tratamento", count: 45 },
      { status: "Monitorado", count: 22 },
    ],
    riscosPorStatusTratamento: [
      { status: "Pendente", count: 15 },
      { status: "Em andamento", count: 45 },
      { status: "Concluído", count: 27 },
    ],
    riscosPorRespostaRisco: [
      { resposta: "Mitigar", count: 52 },
      { resposta: "Aceitar", count: 18 },
      { resposta: "Transferir", count: 12 },
      { resposta: "Evitar", count: 5 },
    ],
    riscosTratamentoConcluido: 27,
    riscosEmTratamento: 45,
    riscosPendentes: 15,
    riscosIdentificados: 20,
    riscosPorLabel: [
      { label: "ALTO RISCO", count: 31 },
      { label: "MÉDIO RISCO", count: 38 },
      { label: "BAIXO RISCO", count: 18 },
    ],
    totalFornecedores: 234,
    fornecedoresPorClassificacao: [
      { classificacao: "Crítico", count: 12 },
      { classificacao: "Alto", count: 45 },
      { classificacao: "Médio", count: 89 },
      { classificacao: "Baixo", count: 88 },
    ],
    fornecedoresPendentesTriagem: 28,
    fornecedoresAltoRisco: 57,
    avaliacoesAltoRisco: 45,
    avaliacoesRequerRIPD: 18,
    tarefasPendentes: 67,
    tarefasVencidas: 12,
  };
}

export function getMockClienteInfo(): ClienteInfo {
  return {
    id: "cliente-001",
    nome: "Empresa Exemplo LTDA",
    cnpj: "12.345.678/0001-90",
    setor: "Tecnologia",
    responsavel: "João Silva",
    email: "contato@exemplo.com.br",
    telefone: "(11) 99999-9999",
    dataContrato: "2024-01-15",
    plano: "Enterprise",
  };
}

export function getMockModulosResumo(): ModuloResumo[] {
  return [
    { nome: "ROPA", icone: "📋", total: 156, pendentes: 34, concluidos: 122, alertas: 5, progresso: 78 },
    { nome: "Riscos", icone: "⚠️", total: 87, pendentes: 15, concluidos: 72, alertas: 8, progresso: 83 },
    { nome: "Fornecedores", icone: "🏢", total: 234, pendentes: 28, concluidos: 206, alertas: 12, progresso: 88 },
    { nome: "Incidentes", icone: "🚨", total: 23, pendentes: 5, concluidos: 18, alertas: 2, progresso: 78 },
    { nome: "Tarefas", icone: "✅", total: 189, pendentes: 67, concluidos: 122, alertas: 12, progresso: 65 },
    { nome: "Políticas", icone: "📜", total: 45, pendentes: 8, concluidos: 37, alertas: 3, progresso: 82 },
  ];
}
