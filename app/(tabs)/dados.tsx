import { ScrollView, Text, View, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { Image } from "expo-image";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { mockClienteInfo, mockModulosResumo, ModuloResumo } from "@/lib/mock-data";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-border">
      <Text className="text-sm text-muted">{label}</Text>
      <Text className="text-sm font-medium text-foreground">{value}</Text>
    </View>
  );
}

function ModuloCard({ modulo }: { modulo: ModuloResumo }) {
  const colors = useColors();
  const hasAlerts = modulo.alertas > 0;

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border mb-3">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-semibold text-foreground">{modulo.nome}</Text>
        {hasAlerts && (
          <View
            className="px-2 py-1 rounded-full flex-row items-center"
            style={{ backgroundColor: `${colors.warning}20` }}
          >
            <IconSymbol name="exclamationmark.triangle.fill" size={12} color={colors.warning} />
            <Text className="text-xs font-medium ml-1" style={{ color: colors.warning }}>
              {modulo.alertas}
            </Text>
          </View>
        )}
      </View>
      <View className="flex-row justify-between">
        <View className="items-center flex-1">
          <Text className="text-xl font-bold text-foreground">{modulo.total}</Text>
          <Text className="text-xs text-muted">Total</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-xl font-bold" style={{ color: colors.warning }}>
            {modulo.pendentes}
          </Text>
          <Text className="text-xs text-muted">Pendentes</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-xl font-bold" style={{ color: colors.success }}>
            {modulo.concluidos}
          </Text>
          <Text className="text-xs text-muted">Concluídos</Text>
        </View>
      </View>
      {/* Progress Bar */}
      <View className="mt-3">
        <View className="h-2 bg-border rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${(modulo.concluidos / modulo.total) * 100}%`,
              backgroundColor: colors.primary,
            }}
          />
        </View>
        <Text className="text-xs text-muted mt-1 text-right">
          {Math.round((modulo.concluidos / modulo.total) * 100)}% concluído
        </Text>
      </View>
    </View>
  );
}

export default function DadosScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);
  const cliente = mockClienteInfo;
  const modulos = mockModulosResumo;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header with CALLEVA Brand */}
        <View className="px-4 pt-2 pb-4">
          <View className="flex-row items-center mb-2">
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 32, height: 32, borderRadius: 8, marginRight: 10 }}
            />
            <Text className="text-2xl font-bold text-foreground tracking-wide">Dados do Cliente</Text>
          </View>
          <Text className="text-sm text-muted">Informações do cliente vinculado</Text>
        </View>

        {/* Client Info Card */}
        <View className="px-4 mb-4">
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center mb-4">
              <View
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-xl font-bold text-white">
                  {cliente.nome.charAt(0)}
                </Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-lg font-semibold text-foreground">{cliente.nome}</Text>
                <View
                  className="px-2 py-0.5 rounded-full self-start mt-1"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <Text className="text-xs font-medium" style={{ color: colors.primary }}>
                    {cliente.plano}
                  </Text>
                </View>
              </View>
            </View>

            <InfoRow label="CNPJ" value={cliente.cnpj} />
            <InfoRow label="Setor" value={cliente.setor} />
            <InfoRow label="Responsável" value={cliente.responsavel} />
            <InfoRow label="E-mail" value={cliente.email} />
            <InfoRow label="Telefone" value={cliente.telefone} />
            <View className="flex-row justify-between py-3">
              <Text className="text-sm text-muted">Data do Contrato</Text>
              <Text className="text-sm font-medium text-foreground">
                {formatDate(cliente.dataContrato)}
              </Text>
            </View>
          </View>
        </View>

        {/* Compliance Summary */}
        <View className="px-4 mb-4">
          <View 
            className="rounded-2xl p-4 border"
            style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
          >
            <Text className="text-base font-semibold text-white mb-3">
              Resumo de Compliance
            </Text>
            <View className="flex-row">
              <View className="flex-1 items-center py-3">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <IconSymbol name="checkmark.circle.fill" size={28} color="#FFFFFF" />
                </View>
                <Text className="text-3xl font-bold text-white">78%</Text>
                <Text className="text-xs text-white opacity-80 text-center">Conformidade Geral</Text>
              </View>
              <View className="w-px" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
              <View className="flex-1 items-center py-3">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <IconSymbol name="exclamationmark.triangle.fill" size={28} color="#FBBF24" />
                </View>
                <Text className="text-3xl font-bold text-white">12</Text>
                <Text className="text-xs text-white opacity-80 text-center">Pendências</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Modules */}
        <View className="px-4">
          <Text className="text-base font-semibold text-foreground mb-3">Módulos</Text>
          {modulos.map((modulo, index) => (
            <ModuloCard key={index} modulo={modulo} />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
