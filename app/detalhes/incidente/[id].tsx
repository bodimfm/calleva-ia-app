import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import { DetailScreen } from "@/components/detail-screen";
import { useColors } from "@/hooks/use-colors";

interface Incidente {
  id: string;
  titulo: string;
  descricao: string | null;
  status: string | null;
  severidade: string | null;
  tipo_incidente: string | null;
  data_ocorrencia: string | null;
  data_deteccao: string | null;
  dados_afetados: string | null;
  titulares_afetados: number | null;
  causa_raiz: string | null;
  acoes_tomadas: string | null;
  notificacao_anpd: boolean | null;
  notificacao_titulares: boolean | null;
  responsavel: string | null;
  observacoes: string | null;
}

// Dados mock para demonstração
const mockIncidente: Incidente = {
  id: "1",
  titulo: "Acesso não autorizado ao sistema de RH",
  descricao: "Detectado acesso não autorizado ao sistema de gestão de RH através de credenciais comprometidas de um ex-colaborador.",
  status: "Em análise",
  severidade: "Alta",
  tipo_incidente: "Acesso não autorizado",
  data_ocorrencia: "2024-12-15",
  data_deteccao: "2024-12-16",
  dados_afetados: "Dados cadastrais de colaboradores (nome, CPF, endereço)",
  titulares_afetados: 150,
  causa_raiz: "Credenciais não revogadas após desligamento",
  acoes_tomadas: "Revogação imediata de acessos, reset de senhas, análise de logs",
  notificacao_anpd: false,
  notificacao_titulares: false,
  responsavel: "João Silva - DPO",
  observacoes: "Análise de impacto em andamento para determinar necessidade de notificação à ANPD",
};

export default function DetalheIncidenteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { isSignedIn, user } = useUser();

  const [incidente, setIncidente] = useState<Incidente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIncidente() {
      try {
        setIsLoading(true);
        setError(null);

        // Simular delay de rede
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Usar dados mock
        setIncidente({ ...mockIncidente, id: id || "1" });
      } catch (err) {
        console.error("[DetalheIncidente] Erro:", err);
        setError("Não foi possível carregar os detalhes do incidente.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchIncidente();
  }, [id]);

  const getSeveridadeColor = (severidade: string | null) => {
    switch (severidade?.toLowerCase()) {
      case "crítica":
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
      case "encerrado":
        return colors.success;
      case "em análise":
      case "em tratamento":
        return colors.warning;
      case "aberto":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const sections = incidente
    ? [
        {
          title: "Informações Gerais",
          fields: [
            { label: "Descrição", value: incidente.descricao },
            {
              label: "Severidade",
              value: incidente.severidade,
              type: "badge" as const,
              badgeColor: getSeveridadeColor(incidente.severidade),
            },
            {
              label: "Status",
              value: incidente.status,
              type: "status" as const,
              badgeColor: getStatusColor(incidente.status),
            },
            { label: "Tipo de Incidente", value: incidente.tipo_incidente },
          ],
        },
        {
          title: "Cronologia",
          fields: [
            { label: "Data da Ocorrência", value: incidente.data_ocorrencia, type: "date" as const },
            { label: "Data da Detecção", value: incidente.data_deteccao, type: "date" as const },
          ],
        },
        {
          title: "Impacto",
          fields: [
            { label: "Dados Afetados", value: incidente.dados_afetados },
            { label: "Titulares Afetados", value: incidente.titulares_afetados?.toString() },
            { label: "Causa Raiz", value: incidente.causa_raiz },
          ],
        },
        {
          title: "Resposta ao Incidente",
          fields: [
            { label: "Ações Tomadas", value: incidente.acoes_tomadas },
            { label: "Responsável", value: incidente.responsavel },
          ],
        },
        {
          title: "Notificações",
          fields: [
            { label: "Notificação à ANPD", value: incidente.notificacao_anpd ? "Sim" : "Não" },
            { label: "Notificação aos Titulares", value: incidente.notificacao_titulares ? "Sim" : "Não" },
          ],
        },
        {
          title: "Observações",
          fields: [{ label: "Notas", value: incidente.observacoes }],
        },
      ]
    : [];

  return (
    <DetailScreen
      title={incidente?.titulo || "Incidente"}
      subtitle={`ID: ${id}`}
      icon="🚨"
      status={
        incidente?.severidade
          ? {
              label: incidente.severidade,
              color: getSeveridadeColor(incidente.severidade),
            }
          : undefined
      }
      sections={sections}
      isLoading={isLoading}
      error={error}
      actions={[
        {
          label: "Consultar IA sobre este incidente",
          icon: "🤖",
          onPress: () => {
            router.push({
              pathname: "/(tabs)/chat",
              params: { context: `Incidente: ${incidente?.titulo}` },
            });
          },
        },
        {
          label: "Orientações LGPD para incidentes",
          icon: "📚",
          variant: "secondary",
          onPress: () => {
            router.push({
              pathname: "/(tabs)/chat",
              params: { context: "Quais são as obrigações da LGPD em caso de incidente de segurança?" },
            });
          },
        },
      ]}
    />
  );
}
