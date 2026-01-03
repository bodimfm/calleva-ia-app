import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { DetailScreen } from "@/components/detail-screen";
import { useColors } from "@/hooks/use-colors";

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string | null;
  status: string | null;
  prioridade: string | null;
  data_criacao: string | null;
  data_vencimento: string | null;
  data_conclusao: string | null;
  responsavel: string | null;
  modulo_origem: string | null;
  item_relacionado: string | null;
  observacoes: string | null;
}

// Dados mock para demonstração
const mockTarefa: Tarefa = {
  id: "1",
  titulo: "Revisar base legal da atividade de marketing",
  descricao: "Verificar e atualizar a base legal utilizada para tratamento de dados pessoais nas campanhas de marketing direto.",
  status: "Pendente",
  prioridade: "Alta",
  data_criacao: "2024-12-01",
  data_vencimento: "2024-12-20",
  data_conclusao: null,
  responsavel: "Ana Costa - Marketing",
  modulo_origem: "ROPA",
  item_relacionado: "Campanhas de Marketing Digital",
  observacoes: "Considerar a necessidade de consentimento específico para cada canal de comunicação",
};

export default function DetalheTarefaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();

  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTarefa() {
      try {
        setIsLoading(true);
        setError(null);

        // Simular delay de rede
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Usar dados mock
        setTarefa({ ...mockTarefa, id: id || "1" });
      } catch (err) {
        console.error("[DetalheTarefa] Erro:", err);
        setError("Não foi possível carregar os detalhes da tarefa.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTarefa();
  }, [id]);

  const getPrioridadeColor = (prioridade: string | null) => {
    switch (prioridade?.toLowerCase()) {
      case "urgente":
        return "#7F1D1D";
      case "alta":
        return colors.error;
      case "média":
        return colors.warning;
      case "baixa":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "concluída":
        return colors.success;
      case "em andamento":
        return colors.warning;
      case "pendente":
        return colors.error;
      case "cancelada":
        return colors.muted;
      default:
        return colors.muted;
    }
  };

  const isVencida = (dataVencimento: string | null, status: string | null) => {
    if (!dataVencimento || status?.toLowerCase() === "concluída" || status?.toLowerCase() === "cancelada") {
      return false;
    }
    const hoje = new Date().toISOString().split("T")[0];
    return dataVencimento < hoje;
  };

  const sections = tarefa
    ? [
        {
          title: "Informações Gerais",
          fields: [
            { label: "Descrição", value: tarefa.descricao },
            {
              label: "Status",
              value: isVencida(tarefa.data_vencimento, tarefa.status) 
                ? `${tarefa.status} (VENCIDA)` 
                : tarefa.status,
              type: "status" as const,
              badgeColor: isVencida(tarefa.data_vencimento, tarefa.status) 
                ? "#7F1D1D" 
                : getStatusColor(tarefa.status),
            },
            {
              label: "Prioridade",
              value: tarefa.prioridade,
              type: "badge" as const,
              badgeColor: getPrioridadeColor(tarefa.prioridade),
            },
          ],
        },
        {
          title: "Prazos",
          fields: [
            { label: "Data de Criação", value: tarefa.data_criacao, type: "date" as const },
            { label: "Data de Vencimento", value: tarefa.data_vencimento, type: "date" as const },
            { label: "Data de Conclusão", value: tarefa.data_conclusao || "Não concluída", type: "date" as const },
          ],
        },
        {
          title: "Responsabilidade",
          fields: [
            { label: "Responsável", value: tarefa.responsavel },
          ],
        },
        {
          title: "Contexto",
          fields: [
            { label: "Módulo de Origem", value: tarefa.modulo_origem },
            { label: "Item Relacionado", value: tarefa.item_relacionado },
          ],
        },
        {
          title: "Observações",
          fields: [{ label: "Notas", value: tarefa.observacoes }],
        },
      ]
    : [];

  return (
    <DetailScreen
      title={tarefa?.titulo || "Tarefa"}
      subtitle={`ID: ${id}`}
      icon="✅"
      status={
        tarefa?.prioridade
          ? {
              label: tarefa.prioridade,
              color: getPrioridadeColor(tarefa.prioridade),
            }
          : undefined
      }
      sections={sections}
      isLoading={isLoading}
      error={error}
      actions={[
        {
          label: "Consultar IA sobre esta tarefa",
          icon: "🤖",
          onPress: () => {
            router.push({
              pathname: "/(tabs)/chat",
              params: { context: `Tarefa: ${tarefa?.titulo}` },
            });
          },
        },
        ...(tarefa?.modulo_origem === "ROPA"
          ? [
              {
                label: "Ver atividade relacionada",
                icon: "📋",
                variant: "secondary" as const,
                onPress: () => {
                  router.push("/detalhes/ropa/1" as any);
                },
              },
            ]
          : []),
      ]}
    />
  );
}
