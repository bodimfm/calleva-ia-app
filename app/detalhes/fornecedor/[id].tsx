import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import { DetailScreen } from "@/components/detail-screen";
import { useColors } from "@/hooks/use-colors";

interface Fornecedor {
  id: string;
  nome: string;
  razao_social: string | null;
  cnpj: string | null;
  classificacao_risco: string | null;
  status_triagem: string | null;
  tipo_servico: string | null;
  dados_tratados: string | null;
  contrato_vigente: boolean | null;
  data_contrato: string | null;
  responsavel_interno: string | null;
  contato_fornecedor: string | null;
  email_fornecedor: string | null;
  observacoes: string | null;
}

// Dados mock para demonstração
const mockFornecedor: Fornecedor = {
  id: "1",
  nome: "TechCloud Solutions",
  razao_social: "TechCloud Solutions Ltda",
  cnpj: "12.345.678/0001-90",
  classificacao_risco: "Médio",
  status_triagem: "Concluída",
  tipo_servico: "Hospedagem em nuvem e processamento de dados",
  dados_tratados: "Dados pessoais de colaboradores e clientes",
  contrato_vigente: true,
  data_contrato: "2024-01-01",
  responsavel_interno: "Maria Santos - TI",
  contato_fornecedor: "Carlos Oliveira",
  email_fornecedor: "carlos@techcloud.com",
  observacoes: "Fornecedor certificado ISO 27001. Próxima auditoria prevista para março/2025.",
};

export default function DetalheFornecedorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { isSignedIn, user } = useUser();

  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFornecedor() {
      try {
        setIsLoading(true);
        setError(null);

        // Simular delay de rede
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Usar dados mock
        setFornecedor({ ...mockFornecedor, id: id || "1" });
      } catch (err) {
        console.error("[DetalheFornecedor] Erro:", err);
        setError("Não foi possível carregar os detalhes do fornecedor.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFornecedor();
  }, [id]);

  const getClassificacaoColor = (classificacao: string | null) => {
    switch (classificacao?.toLowerCase()) {
      case "crítico":
        return "#7F1D1D";
      case "alto":
        return colors.error;
      case "médio":
        return colors.warning;
      case "baixo":
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
      default:
        return colors.muted;
    }
  };

  const sections = fornecedor
    ? [
        {
          title: "Informações Gerais",
          fields: [
            { label: "Razão Social", value: fornecedor.razao_social },
            { label: "CNPJ", value: fornecedor.cnpj },
            {
              label: "Classificação de Risco",
              value: fornecedor.classificacao_risco,
              type: "badge" as const,
              badgeColor: getClassificacaoColor(fornecedor.classificacao_risco),
            },
            {
              label: "Status da Triagem",
              value: fornecedor.status_triagem,
              type: "status" as const,
              badgeColor: getStatusColor(fornecedor.status_triagem),
            },
          ],
        },
        {
          title: "Serviços e Dados",
          fields: [
            { label: "Tipo de Serviço", value: fornecedor.tipo_servico },
            { label: "Dados Tratados", value: fornecedor.dados_tratados },
          ],
        },
        {
          title: "Contrato",
          fields: [
            { label: "Contrato Vigente", value: fornecedor.contrato_vigente ? "Sim" : "Não" },
            { label: "Data do Contrato", value: fornecedor.data_contrato, type: "date" as const },
            { label: "Responsável Interno", value: fornecedor.responsavel_interno },
          ],
        },
        {
          title: "Contato",
          fields: [
            { label: "Contato no Fornecedor", value: fornecedor.contato_fornecedor },
            { label: "E-mail", value: fornecedor.email_fornecedor },
          ],
        },
        {
          title: "Observações",
          fields: [{ label: "Notas", value: fornecedor.observacoes }],
        },
      ]
    : [];

  return (
    <DetailScreen
      title={fornecedor?.nome || "Fornecedor"}
      subtitle={fornecedor?.cnpj || `ID: ${id}`}
      icon="🏢"
      status={
        fornecedor?.classificacao_risco
          ? {
              label: fornecedor.classificacao_risco,
              color: getClassificacaoColor(fornecedor.classificacao_risco),
            }
          : undefined
      }
      sections={sections}
      isLoading={isLoading}
      error={error}
      actions={[
        {
          label: "Consultar IA sobre este fornecedor",
          icon: "🤖",
          onPress: () => {
            router.push({
              pathname: "/(tabs)/chat",
              params: { context: `Fornecedor: ${fornecedor?.nome}` },
            });
          },
        },
      ]}
    />
  );
}
