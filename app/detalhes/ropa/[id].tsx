import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import { DetailScreen } from "@/components/detail-screen";
import { useColors } from "@/hooks/use-colors";
// API base URL seria importada aqui para produção
// import { GRC_API_BASE_URL } from "@/lib/grc-api";

interface AtividadeRopa {
  id: string;
  name: string;
  descricao: string | null;
  finalidade_tratamento: string | null;
  status: string | null;
  base_legal: string | null;
  dados_pessoais: string | null;
  dados_sensiveis: string | null;
  titular: string | null;
  area_responsavel: string | null;
  operador: string | null;
  compartilhamento: string | null;
  transferencia_internacional: boolean | null;
  prazo_retencao: string | null;
  medidas_seguranca: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Dados mock para demonstração
const mockAtividade: AtividadeRopa = {
  id: "1",
  name: "Gestão de Folha de Pagamento",
  descricao: "Processamento de dados pessoais dos colaboradores para fins de cálculo e pagamento de salários, benefícios e obrigações trabalhistas.",
  finalidade_tratamento: "Cumprir obrigações legais e contratuais relacionadas ao vínculo empregatício",
  status: "Ativa",
  base_legal: "Execução de contrato",
  dados_pessoais: "Nome, CPF, RG, endereço, dados bancários, dependentes",
  dados_sensiveis: "Dados de saúde (atestados médicos)",
  titular: "Colaboradores",
  area_responsavel: "Recursos Humanos",
  operador: "Sistema de Folha XYZ",
  compartilhamento: "Bancos, INSS, Receita Federal",
  transferencia_internacional: false,
  prazo_retencao: "5 anos após término do contrato",
  medidas_seguranca: "Criptografia, controle de acesso, backup",
  created_at: "2024-01-15",
  updated_at: "2024-12-20",
};

export default function DetalheRopaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { isSignedIn, user } = useUser();

  const [atividade, setAtividade] = useState<AtividadeRopa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAtividade() {
      try {
        setIsLoading(true);
        setError(null);

        // Em produção, buscar da API real
        // const response = await fetch(`${GRC_API_BASE_URL}/api/mobile/ropa/${id}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });

        // Simular delay de rede
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Usar dados mock
        setAtividade({ ...mockAtividade, id: id || "1" });
      } catch (err) {
        console.error("[DetalheRopa] Erro:", err);
        setError("Não foi possível carregar os detalhes da atividade.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAtividade();
  }, [id]);

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "ativa":
        return colors.success;
      case "em avaliação":
        return colors.warning;
      case "encerrada":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const sections = atividade
    ? [
        {
          title: "Informações Gerais",
          fields: [
            { label: "Descrição", value: atividade.descricao },
            { label: "Finalidade do Tratamento", value: atividade.finalidade_tratamento },
            { label: "Base Legal", value: atividade.base_legal },
            { label: "Área Responsável", value: atividade.area_responsavel },
          ],
        },
        {
          title: "Dados Tratados",
          fields: [
            { label: "Dados Pessoais", value: atividade.dados_pessoais },
            { label: "Dados Sensíveis", value: atividade.dados_sensiveis },
            { label: "Titular dos Dados", value: atividade.titular },
          ],
        },
        {
          title: "Compartilhamento",
          fields: [
            { label: "Operador", value: atividade.operador },
            { label: "Compartilhamento", value: atividade.compartilhamento },
            {
              label: "Transferência Internacional",
              value: atividade.transferencia_internacional ? "Sim" : "Não",
            },
          ],
        },
        {
          title: "Segurança e Retenção",
          fields: [
            { label: "Prazo de Retenção", value: atividade.prazo_retencao },
            { label: "Medidas de Segurança", value: atividade.medidas_seguranca },
          ],
        },
        {
          title: "Histórico",
          fields: [
            { label: "Criado em", value: atividade.created_at, type: "date" as const },
            { label: "Última atualização", value: atividade.updated_at, type: "date" as const },
          ],
        },
      ]
    : [];

  return (
    <DetailScreen
      title={atividade?.name || "Atividade ROPA"}
      subtitle={`ID: ${id}`}
      icon="📋"
      status={
        atividade?.status
          ? {
              label: atividade.status,
              color: getStatusColor(atividade.status),
            }
          : undefined
      }
      sections={sections}
      isLoading={isLoading}
      error={error}
      actions={[
        {
          label: "Consultar IA sobre esta atividade",
          icon: "🤖",
          onPress: () => {
            router.push({
              pathname: "/(tabs)/chat",
              params: { context: `Atividade ROPA: ${atividade?.name}` },
            });
          },
        },
      ]}
    />
  );
}
