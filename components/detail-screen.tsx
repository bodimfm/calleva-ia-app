import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface DetailField {
  label: string;
  value: string | number | null | undefined;
  type?: "text" | "status" | "date" | "badge";
  badgeColor?: string;
}

interface DetailSection {
  title: string;
  fields: DetailField[];
}

interface DetailScreenProps {
  title: string;
  subtitle?: string;
  icon?: string;
  status?: {
    label: string;
    color: string;
  };
  sections: DetailSection[];
  isLoading?: boolean;
  error?: string | null;
  actions?: {
    label: string;
    icon?: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "danger";
  }[];
}

export function DetailScreen({
  title,
  subtitle,
  icon,
  status,
  sections,
  isLoading,
  error,
  actions,
}: DetailScreenProps) {
  const colors = useColors();
  const router = useRouter();

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-muted mt-4">Carregando...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <IconSymbol name="xmark.circle.fill" size={48} color={colors.error} />
          <Text className="text-foreground text-lg font-semibold mt-4 text-center">
            Erro ao carregar
          </Text>
          <Text className="text-muted text-center mt-2">{error}</Text>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              {
                marginTop: 24,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-white font-semibold">Voltar</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* Header */}
      <View
        className="px-4 py-3 flex-row items-center border-b border-border"
        style={{ backgroundColor: colors.primary }}
      >
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            {
              padding: 8,
              borderRadius: 8,
              marginRight: 8,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-lg font-bold text-white" numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-xs text-white opacity-80" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {status && (
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: status.color }}
          >
            <Text className="text-white text-xs font-medium">{status.label}</Text>
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Section */}
        <View className="px-4 py-6 items-center" style={{ backgroundColor: `${colors.primary}10` }}>
          {icon && <Text className="text-5xl mb-3">{icon}</Text>}
          <Text className="text-xl font-bold text-foreground text-center">{title}</Text>
          {subtitle && (
            <Text className="text-sm text-muted text-center mt-1">{subtitle}</Text>
          )}
        </View>

        {/* Sections */}
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="px-4 py-4">
            <Text className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
              {section.title}
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
            >
              {section.fields.map((field, fieldIndex) => (
                <View
                  key={fieldIndex}
                  className={`px-4 py-3 ${fieldIndex < section.fields.length - 1 ? "border-b" : ""}`}
                  style={{ borderColor: colors.border }}
                >
                  <Text className="text-xs text-muted mb-1">{field.label}</Text>
                  {field.type === "status" || field.type === "badge" ? (
                    <View
                      className="self-start px-3 py-1 rounded-full"
                      style={{ backgroundColor: field.badgeColor || colors.primary }}
                    >
                      <Text className="text-white text-sm font-medium">
                        {field.value || "N/A"}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-base text-foreground">
                      {field.value || "Não informado"}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Actions */}
        {actions && actions.length > 0 && (
          <View className="px-4 py-4 gap-3">
            {actions.map((action, index) => {
              const bgColor =
                action.variant === "danger"
                  ? colors.error
                  : action.variant === "secondary"
                  ? colors.surface
                  : colors.primary;
              const textColor =
                action.variant === "secondary" ? colors.foreground : "#FFFFFF";

              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    action.onPress();
                  }}
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                      borderRadius: 12,
                      backgroundColor: bgColor,
                      borderWidth: action.variant === "secondary" ? 1 : 0,
                      borderColor: colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  {action.icon && (
                    <Text className="mr-2">{action.icon}</Text>
                  )}
                  <Text style={{ color: textColor, fontWeight: "600" }}>
                    {action.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
