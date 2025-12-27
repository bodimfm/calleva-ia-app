import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  maxValue?: number;
}

export function BarChart({ data, title, maxValue }: BarChartProps) {
  const colors = useColors();
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  if (data.length === 0) {
    return (
      <View className="bg-surface rounded-2xl p-4 border border-border">
        {title && <Text className="text-base font-semibold text-foreground mb-3">{title}</Text>}
        <View className="items-center justify-center py-8">
          <Text className="text-muted">Sem dados</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      {title && <Text className="text-base font-semibold text-foreground mb-4">{title}</Text>}
      <View className="gap-3">
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100;
          const barColor = item.color || colors.primary;

          return (
            <View key={index}>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-muted flex-1" numberOfLines={1}>
                  {item.label}
                </Text>
                <Text className="text-xs font-medium text-foreground ml-2">{item.value}</Text>
              </View>
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: barColor,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
