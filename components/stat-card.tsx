import { View, Text } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

type TrendDirection = "up" | "down" | "stable";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: "house.fill" | "chart.bar.fill" | "exclamationmark.triangle.fill" | "checkmark.circle.fill" | "person.crop.circle.fill";
  color?: string;
  trend?: TrendDirection;
  trendValue?: string;
}

export function StatCard({ title, value, icon, color, trend, trendValue }: StatCardProps) {
  const colors = useColors();
  const iconColor = color || colors.primary;

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "arrow.up.right";
      case "down":
        return "arrow.down.right";
      default:
        return "minus";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return colors.error;
      case "down":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border flex-1 min-w-[140px]">
      <View className="flex-row items-center justify-between mb-2">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <IconSymbol name={icon} size={22} color={iconColor} />
        </View>
        {trend && trendValue && (
          <View className="flex-row items-center">
            <IconSymbol name={getTrendIcon()} size={14} color={getTrendColor()} />
            <Text style={{ color: getTrendColor(), fontSize: 12, marginLeft: 2 }}>
              {trendValue}
            </Text>
          </View>
        )}
      </View>
      <Text className="text-2xl font-bold text-foreground">{value}</Text>
      <Text className="text-sm text-muted mt-1">{title}</Text>
    </View>
  );
}
