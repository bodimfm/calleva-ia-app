import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useRef, useCallback } from "react";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  ChatMessage,
  initialChatMessages,
  chatSuggestions,
  mockDashboardMetrics,
} from "@/lib/mock-data";

export default function ChatScreen() {
  const colors = useColors();
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes("risco") && (q.includes("elevado") || q.includes("alto"))) {
      const total = mockDashboardMetrics.riscosElevados + mockDashboardMetrics.riscosMuitoElevados;
      return `Atualmente você possui **${total} riscos** classificados como elevados ou muito elevados:\n\n• ${mockDashboardMetrics.riscosElevados} riscos elevados\n• ${mockDashboardMetrics.riscosMuitoElevados} riscos muito elevados\n\nRecomendo priorizar a análise e tratamento desses riscos para garantir a conformidade.`;
    }

    if (q.includes("atividade") || q.includes("tratamento") || q.includes("ropa")) {
      return `Aqui está o resumo das **atividades de tratamento**:\n\n• Total: ${mockDashboardMetrics.totalAtividades} atividades\n• Ativas: ${mockDashboardMetrics.atividadesAtivas}\n• Em avaliação: ${mockDashboardMetrics.atividadesEmAvaliacao}\n• Encerradas: ${mockDashboardMetrics.atividadesEncerradas}\n\nPosso ajudar com mais detalhes sobre alguma atividade específica?`;
    }

    if (q.includes("fornecedor") && (q.includes("pendente") || q.includes("triagem"))) {
      return `Você possui **${mockDashboardMetrics.fornecedoresPendentesTriagem} fornecedores** pendentes de triagem.\n\nAlém disso, ${mockDashboardMetrics.fornecedoresAltoRisco} fornecedores estão classificados como alto risco e requerem atenção especial.\n\nDeseja que eu liste os fornecedores prioritários?`;
    }

    if (q.includes("tarefa") && q.includes("vencid")) {
      return `Existem **${mockDashboardMetrics.tarefasVencidas} tarefas vencidas** que precisam de atenção imediata.\n\nO total de tarefas pendentes é ${mockDashboardMetrics.tarefasPendentes}.\n\nRecomendo revisar essas tarefas para manter a conformidade em dia.`;
    }

    if (q.includes("fornecedor")) {
      return `Seu cadastro possui **${mockDashboardMetrics.totalFornecedores} fornecedores**:\n\n• Pendentes de triagem: ${mockDashboardMetrics.fornecedoresPendentesTriagem}\n• Alto risco: ${mockDashboardMetrics.fornecedoresAltoRisco}\n\nPosso ajudar a filtrar por categoria ou nível de risco?`;
    }

    return `Entendi sua pergunta sobre "${question}". Para fornecer informações mais precisas, posso ajudar com:\n\n• Atividades de tratamento (ROPA)\n• Gestão de riscos\n• Fornecedores e triagem\n• Tarefas e prazos\n\nComo posso ajudar?`;
  };

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setIsTyping(true);

      // Simulate AI response delay
      setTimeout(() => {
        const response = generateResponse(text);
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1000 + Math.random() * 1000);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    []
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";

    return (
      <View
        className={`flex-row mb-3 ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <Image
            source={require("@/assets/images/icon.png")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginRight: 8,
            }}
          />
        )}
        <View
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isUser ? "rounded-br-md" : "rounded-bl-md"
          }`}
          style={{
            backgroundColor: isUser ? colors.primary : colors.surface,
            borderWidth: isUser ? 0 : 1,
            borderColor: colors.border,
          }}
        >
          <Text
            className={`text-sm leading-5 ${isUser ? "text-white" : "text-foreground"}`}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View className="px-4 py-3 border-b border-border flex-row items-center">
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          <View className="ml-3 flex-1">
            <Text className="text-lg font-semibold text-foreground">Calleva IA</Text>
            <View className="flex-row items-center">
              <View
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: colors.success }}
              />
              <Text className="text-xs text-muted">Online</Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View className="px-4 pb-2 flex-row items-center">
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
            />
            <View
              className="px-4 py-2 rounded-2xl"
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
            >
              <Text className="text-muted text-sm">Calleva está digitando...</Text>
            </View>
          </View>
        )}

        {/* Suggestions */}
        {messages.length <= 1 && (
          <View className="px-4 pb-2">
            <Text className="text-xs text-muted mb-2">Sugestões:</Text>
            <View className="flex-row flex-wrap gap-2">
              {chatSuggestions.map((suggestion, index) => (
                <Pressable
                  key={index}
                  onPress={() => sendMessage(suggestion)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.surface,
                      borderRadius: 16,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderWidth: 1,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text className="text-sm text-foreground">{suggestion}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Input */}
        <View className="px-4 py-3 border-t border-border flex-row items-end gap-2">
          <View
            className="flex-1 rounded-2xl px-4 py-2 min-h-[44px] justify-center"
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage(inputText)}
              style={{
                color: colors.foreground,
                fontSize: 15,
                maxHeight: 100,
              }}
            />
          </View>
          <Pressable
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
            style={({ pressed }) => [
              {
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: inputText.trim() ? colors.primary : colors.surface,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            <IconSymbol
              name="paperplane.fill"
              size={20}
              color={inputText.trim() ? "#FFFFFF" : colors.muted}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
