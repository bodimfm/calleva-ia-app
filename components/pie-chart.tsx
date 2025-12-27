import { View, Text } from "react-native";
import Svg, { G, Path, Circle } from "react-native-svg";
import { useColors } from "@/hooks/use-colors";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  title?: string;
}

export function PieChart({ data, size = 140, title }: PieChartProps) {
  const colors = useColors();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  if (total === 0) {
    return (
      <View className="bg-surface rounded-2xl p-4 border border-border">
        {title && <Text className="text-base font-semibold text-foreground mb-3">{title}</Text>}
        <View className="items-center justify-center" style={{ height: size }}>
          <Text className="text-muted">Sem dados</Text>
        </View>
      </View>
    );
  }

  let currentAngle = -90;
  const paths = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return <Path key={index} d={pathData} fill={item.color} />;
  });

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      {title && <Text className="text-base font-semibold text-foreground mb-3">{title}</Text>}
      <View className="flex-row items-center">
        <Svg width={size} height={size}>
          <G>{paths}</G>
          <Circle cx={centerX} cy={centerY} r={radius * 0.5} fill={colors.surface} />
        </Svg>
        <View className="flex-1 ml-4">
          {data.map((item, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <Text className="text-xs text-muted flex-1" numberOfLines={1}>
                {item.label}
              </Text>
              <Text className="text-xs font-medium text-foreground ml-1">{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
