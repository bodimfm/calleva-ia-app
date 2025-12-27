import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useAuth } from "@clerk/clerk-expo";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { moduleIcons } from "@/lib/mock-data";
import { SearchResult, searchGlobal } from "@/lib/grc-api";

type ModuleFilter = "all" | "ropa" | "grc" | "fornecedores" | "incidentes" | "tarefas";

const moduleLabels: Record<ModuleFilter, string> = {
  all: "Todos",
  ropa: "ROPA",
  grc: "Riscos",
  fornecedores: "Fornecedores",
  incidentes: "Incidentes",
  tarefas: "Tarefas",
};

// Local search data for fallback
const localSearchData: SearchResult[] = [
  {
    id: "1",
    module: "ropa",
    title: "Cadastro de Clientes",
    description: "Atividade de tratamento para cadastro e gestão de clientes",
    url: "/ropa/1",
  },
  {
    id: "2",
    module: "grc",
    title: "Risco de Vazamento de Dados",
    description: "Risco elevado relacionado a possível vazamento de dados pessoais",
    url: "/grc/2",
  },
  {
    id: "3",
    module: "fornecedores",
    title: "Cloud Provider ABC",
    description: "Fornecedor de serviços de cloud computing - Alto risco",
    url: "/fornecedores/3",
  },
  {
    id: "4",
    module: "incidentes",
    title: "Incidente #2024-001",
    description: "Acesso não autorizado a sistema interno",
    url: "/incidentes/4",
  },
  {
    id: "5",
    module: "ropa",
    title: "Coleta de Dados para Marketing",
    description: "Atividade de tratamento para campanhas de marketing digital",
    url: "/ropa/5",
  },
  {
    id: "6",
    module: "grc",
    title: "Risco de Não Conformidade LGPD",
    description: "Risco relacionado ao prazo de adequação à LGPD",
    url: "/grc/6",
  },
  {
    id: "7",
    module: "fornecedores",
    title: "Empresa de Segurança XYZ",
    description: "Fornecedor de serviços de segurança da informação",
    url: "/fornecedores/7",
  },
  {
    id: "8",
    module: "tarefas",
    title: "Revisar Política de Privacidade",
    description: "Tarefa pendente - Vencimento: 30/12/2024",
    url: "/tarefas/8",
  },
  {
    id: "9",
    module: "ropa",
    title: "Processamento de Dados Financeiros",
    description: "Atividade de tratamento para gestão financeira",
    url: "/ropa/9",
  },
  {
    id: "10",
    module: "incidentes",
    title: "Incidente #2024-002",
    description: "Perda de dispositivo com dados pessoais",
    url: "/incidentes/10",
  },
  {
    id: "11",
    module: "tarefas",
    title: "Atualizar RIPD",
    description: "Tarefa para atualização do Relatório de Impacto",
    url: "/tarefas/11",
  },
  {
    id: "12",
    module: "grc",
    title: "Risco de Acesso Indevido",
    description: "Risco médio relacionado a controles de acesso",
    url: "/grc/12",
  },
];

export default function BuscaScreen() {
  const colors = useColors();
  const { isSignedIn, getToken } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ModuleFilter>("all");
  const [results, setResults] = useState<SearchResult[]>(localSearchData);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Local search function
  const performLocalSearch = useCallback((query: string, filter: ModuleFilter): SearchResult[] => {
    let filtered = localSearchData;

    // Filter by module
    if (filter !== "all") {
      filtered = filtered.filter((item) => item.module === filter);
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, []);

  // API search function
  const performApiSearch = useCallback(async (query: string, filter: ModuleFilter) => {
    if (!isSignedIn) {
      return performLocalSearch(query, filter);
    }

    try {
      const modules = filter === "all" ? undefined : [filter];
      const apiResults = await searchGlobal(query, modules, getToken);
      
      if (apiResults && apiResults.length > 0) {
        return apiResults;
      }
      
      // Fallback to local search if API returns empty
      return performLocalSearch(query, filter);
    } catch (error) {
      console.error("[Busca] API search error:", error);
      return performLocalSearch(query, filter);
    }
  }, [isSignedIn, getToken, performLocalSearch]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      // Show all results for current filter when no query
      setResults(performLocalSearch("", activeFilter));
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      const searchResults = await performApiSearch(searchQuery, activeFilter);
      setResults(searchResults);
      setIsSearching(false);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, activeFilter, performApiSearch, performLocalSearch]);

  const handleFilterPress = useCallback((filter: ModuleFilter) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveFilter(filter);
  }, []);

  const handleResultPress = useCallback((item: SearchResult) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // In production, this would navigate to the detail screen
    console.log("Navigate to:", item.url);
  }, []);

  const renderFilterChip = (filter: ModuleFilter) => {
    const isActive = activeFilter === filter;
    return (
      <Pressable
        key={filter}
        onPress={() => handleFilterPress(filter)}
        style={({ pressed }) => [
          {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 8,
            backgroundColor: isActive ? colors.primary : colors.surface,
            borderWidth: 1,
            borderColor: isActive ? colors.primary : colors.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text
          className="text-sm font-medium"
          style={{ color: isActive ? "#FFFFFF" : colors.foreground }}
        >
          {moduleLabels[filter]}
        </Text>
      </Pressable>
    );
  };

  const renderResult = ({ item }: { item: SearchResult }) => {
    const icon = moduleIcons[item.module] || "📄";

    return (
      <Pressable
        onPress={() => handleResultPress(item)}
        style={({ pressed }) => [
          {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View className="flex-row items-start">
          <Text className="text-2xl mr-3">{icon}</Text>
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text
                className="text-xs font-medium px-2 py-0.5 rounded-full mr-2"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                }}
              >
                {moduleLabels[item.module as ModuleFilter] || item.module.toUpperCase()}
              </Text>
              {item.source === "embedding" && (
                <Text
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${colors.success}20`,
                    color: colors.success,
                  }}
                >
                  IA
                </Text>
              )}
            </View>
            <Text className="text-base font-semibold text-foreground mb-1">
              {item.title}
            </Text>
            <Text className="text-sm text-muted" numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color={colors.muted} />
        </View>
      </Pressable>
    );
  };

  const filters: ModuleFilter[] = ["all", "ropa", "grc", "fornecedores", "incidentes", "tarefas"];

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header with CALLEVA Brand */}
        <View className="px-4 pt-2 pb-4">
          <View className="flex-row items-center mb-2">
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 32, height: 32, borderRadius: 8, marginRight: 10 }}
            />
            <Text className="text-2xl font-bold text-foreground tracking-wide">Busca</Text>
          </View>
          <Text className="text-sm text-muted">
            {isSignedIn ? "Pesquise em todos os módulos" : "Pesquisa em modo demonstração"}
          </Text>
        </View>

        {/* Search Input */}
        <View className="px-4 mb-4">
          <View
            className="flex-row items-center rounded-2xl px-4 py-3"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <IconSymbol name="magnifyingglass" size={20} color={colors.primary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar atividades, riscos, fornecedores..."
              placeholderTextColor={colors.muted}
              className="flex-1 ml-3"
              style={{
                color: colors.foreground,
                fontSize: 15,
              }}
              returnKeyType="search"
            />
            {isSearching && (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
            {searchQuery.length > 0 && !isSearching && (
              <Pressable
                onPress={() => setSearchQuery("")}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.muted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <View className="mb-4">
          <FlatList
            horizontal
            data={filters}
            renderItem={({ item }) => renderFilterChip(item)}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>

        {/* Results */}
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <IconSymbol name="magnifyingglass" size={48} color={colors.muted} />
              <Text className="text-muted text-center mt-4">
                {searchQuery
                  ? "Nenhum resultado encontrado"
                  : "Digite para buscar"}
              </Text>
            </View>
          }
          ListHeaderComponent={
            results.length > 0 ? (
              <Text className="text-sm text-muted mb-3">
                {results.length} resultado{results.length !== 1 ? "s" : ""}{" "}
                {searchQuery ? `para "${searchQuery}"` : ""}
              </Text>
            ) : null
          }
        />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
