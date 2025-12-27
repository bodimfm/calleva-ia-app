import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import { DetailScreen } from "@/components/detail-screen";
import { useColors } from "@/hooks/use-colors";

interface Risco {
  id: string;
  nome: string;
  descricao: string | null;
  classificacao_risco: string | null;
  status_principal: string | null;
  status_tratamento: string | null;
  probabilidade: string | null;
  impacto: string | null;
  resposta_risco: string | null;
  atividade_relacionada: string | null;
  controles: string | null;
  responsavel: string | null;
  data_identificacao: string | null;
  data_revisao: string | null;
  observacoes: string | null;
}

// Dados mock para demonstração
const mockRisco: Risco = {
  id: "1",
  nome: "Vazamento de dados pessoais",
  descricao: "Risco de exposição não autorizada de dados pessoais de colaboradores devido a falhas de segurança no sistema de RH.",
  classificacao_risco: "Elevado",
  status_principal: "Em tratamento",
  status_tratamento: "Em andamento",
  probabilidade: "Possível",
  impacto: "Grande",
  resposta_risco: "Mitigar",
  atividade_relacionada: "Gestão de Folha de Pagamento",
  controles: "Criptografia de dados, autenticação multifator, logs de acesso",
  responsavel: "João Silva - DPO",
  data_identificacao: "2024-06-15",
  data_revisao: "2024-12-20",
  observacoes: "Implementação de novos controles prevista para Q1 2025",
};

export default function DetalheRiscoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { isSignedIn, user } = useUser();

  const [risco, setRisco] = useState<Risco | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRisco() {
      try {
        setIsLoading(true);
        setError(null);

        // Simular delay de rede
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Usar dados mock
        setRisco({ ...mockRisco, id: id || "1" });
      } catch (err) {
        console.error("[DetalheRisco] Erro:", err);
        setError("Não foi possível carregar os detalhes do risco.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRisco();
  }, [id]);

  const getClassificacaoColor = (classificacao: string | null) => {
    switch (classificacao?.toLowerCase()) {
      case "muito elevado":
        return "#7F1D1D";
      case "elevado":
        return colors.error;
      case "médio":
        return colors.warning;
      case "baixo":
        return colors.success;
      case "muito baixo":
        return "#166534";
      default:
        return colors.muted;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "tratado":
        return colors.success;
      case "em tratamento":
      case "em andamento":
        return colors.warning;
      case "identificado":
      case "pendente":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const sections = risco
    ? [
        {
          title: "Informações Gerais",
          fields: [
            { label: "Descrição", value: risco.descricao },
            {
              label: "Classificação",
              value: risco.classificacao_risco,
              type: "badge" as const,
              badgeColor: getClassificacaoColor(risco.classificacao_risco),
            },
            {
              label: "Status",
              value: risco.status_principal,
              type: "status" as const,
              badgeColor: getStatusColor(risco.status_principal),
            },
          ],
        },
        {
          title: "Análise de Risco",
          fields: [
            { label: "Probabilidade", value: risco.probabilidade },
            { label: "Impacto", value: risco.impacto },
            { label: "Resposta ao Risco", value: risco.resposta_risco },
          ],
        },
        {
          title: "Tratamento",
          fields: [
            { label: "Status do Tratamento", value: risco.status_tratamento },
            { label: "Controles Implementados", value: risco.controles },
            { label: "Responsável", value: risco.responsavel },
          ],
        },
        {
          title: "Contexto",
          fields: [
            { label: "Atividade Relacionada", value: risco.atividade_relacionada },
            { label: "Observações", value: risco.observacoes },
          ],
        },
        {
          title: "Histórico",
          fields: [
            { label: "Data de Identificação", value: risco.data_identificacao, type: "date" as const },
            { label: "Última Revisão", value: risco.data_revisao, type: "date" as const },
          ],
        },
      ]
    : [];

  return (
    <DetailScreen
      title={risco?.nome || "Risco"}
      subtitle={`ID: ${id}`}
      icon="⚠️"
      status={
        risco?.classificacao_risco
          ? {
              label: risco.classificacao_risco,
              color: getClassificacaoColor(risco.classificacao_risco),
            }
          : undefined
      }
      sections={sections}
      isLoading={isLoading}
      error={error}
      actions={[
        {
          label: "Consultar IA sobre este risco",
          icon: "🤖",
          onPress: () => {
            router.push({
              pathname: "/(tabs)/chat",
              params: { context: `Risco: ${risco?.nome}` },
            });
          },
        },
        {
          label: "Ver atividade relacionada",
          icon: "📋",
          variant: "secondary",
          onPress: () => {
            router.push("/detalhes/ropa/1" as any);
          },
        },
      ]}
    />
  );
}
