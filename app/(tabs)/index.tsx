import { ScrollView, Text, View, RefreshControl, Pressable } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

import { ScreenContainer } from "@/components/screen-container";
import { StatCard } from "@/components/stat-card";
import { PieChart } from "@/components/pie-chart";
import { BarChart } from "@/components/bar-chart";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  mockDashboardMetrics,
  riskColors,
  statusColors,
} from "@/lib/mock-data";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState(mockDashboardMetrics);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const pieChartData = metrics.riscosPorClassificacao.map((item) => ({
    label: item.classificacao,
    value: item.count,
    color: riskColors[item.classificacao as keyof typeof riskColors] || colors.muted,
  }));

  const barChartData = metrics.atividadesPorStatus.map((item) => ({
    label: item.status,
    value: item.count,
    color: statusColors[item.status as keyof typeof statusColors] || colors.primary,
  }));

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <View className="px-4 pt-2 pb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={require("@/assets/images/icon.png")}
                style={{ width: 40, height: 40, borderRadius: 10 }}
              />
              <View className="ml-3">
                <Text className="text-xl font-bold text-foreground">CALLEVA IA</Text>
                <Text className="text-xs text-muted">Governança, Risco e Compliance</Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/busca")}
              style={({ pressed }) => [
                {
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
            </Pressable>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-4 mb-4">
          <Text className="text-base font-semibold text-foreground mb-3">Visão Geral</Text>
          <View className="flex-row flex-wrap gap-3">
            <StatCard
              title="Atividades"
              value={metrics.totalAtividades}
              icon="chart.bar.fill"
              color={colors.primary}
            />
            <StatCard
              title="Riscos Altos"
              value={metrics.riscosElevados + metrics.riscosMuitoElevados}
              icon="exclamationmark.triangle.fill"
              color={colors.error}
              trend="up"
              trendValue="+2"
            />
          </View>
          <View className="flex-row flex-wrap gap-3 mt-3">
            <StatCard
              title="Fornecedores"
              value={metrics.totalFornecedores}
              icon="person.crop.circle.fill"
              color={colors.success}
            />
            <StatCard
              title="Tarefas Vencidas"
              value={metrics.tarefasVencidas}
              icon="checkmark.circle.fill"
              color={colors.warning}
              trend="down"
              trendValue="-1"
            />
          </View>
        </View>

        {/* Charts */}
        <View className="px-4 gap-4">
          <PieChart data={pieChartData} title="Riscos por Classificação" />
          <BarChart data={barChartData} title="Atividades por Status" />
        </View>

        {/* Quick Actions */}
        <View className="px-4 mt-4">
          <Text className="text-base font-semibold text-foreground mb-3">Ações Rápidas</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.push("/(tabs)/chat")}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <IconSymbol name="message.fill" size={24} color="#FFFFFF" />
              <Text className="text-white font-semibold mt-2">Falar com Calleva</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/(tabs)/dados")}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <IconSymbol name="person.crop.circle.fill" size={24} color={colors.primary} />
              <Text className="text-foreground font-semibold mt-2">Ver Dados</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push("/(tabs)/chat")}
        style={({ pressed }) => [
          {
            position: "absolute",
            bottom: 90,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <IconSymbol name="message.fill" size={24} color="#FFFFFF" />
      </Pressable>
    </ScreenContainer>
  );
}
