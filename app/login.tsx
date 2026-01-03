import { View, Text, Pressable, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { useAuth, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

// Warm up browser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  // OAuth with Google
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: "oauth_google" });
  // OAuth with Microsoft
  const { startOAuthFlow: startMicrosoftOAuth } = useOAuth({ strategy: "oauth_microsoft" });

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleGoogleLogin = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const { createdSessionId, setActive: setActiveSession } = await startGoogleOAuth({
        redirectUrl: Linking.createURL("/oauth/callback"),
      });

      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("[Login] Google OAuth error:", error);
    }
  };

  const handleMicrosoftLogin = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const { createdSessionId, setActive: setActiveSession } = await startMicrosoftOAuth({
        redirectUrl: Linking.createURL("/oauth/callback"),
      });

      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("[Login] Microsoft OAuth error:", error);
    }
  };

  if (!isLoaded) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 items-center justify-center px-8">
        {/* Logo and Brand */}
        <View className="items-center mb-12">
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 120, height: 120, borderRadius: 30 }}
          />
          <Text
            className="text-4xl font-bold mt-6 tracking-wider"
            style={{ color: colors.primary }}
          >
            CALLEVA
          </Text>
          <Text className="text-lg text-muted tracking-widest mt-1">GRC</Text>
        </View>

        {/* Welcome Text */}
        <View className="items-center mb-12">
          <Text className="text-2xl font-semibold text-foreground text-center">
            Bem-vindo ao CALLEVA IA
          </Text>
          <Text className="text-base text-muted text-center mt-3 leading-6">
            Sua assistente inteligente para{"\n"}Governança, Risco e Compliance
          </Text>
        </View>

        {/* Features List */}
        <View className="w-full max-w-sm mb-12">
          <FeatureItem
            icon="📊"
            title="Dashboard em tempo real"
            description="Visualize métricas e estatísticas do seu cliente"
          />
          <FeatureItem
            icon="🤖"
            title="IA Calleva"
            description="Converse com a IA sobre seus dados de GRC"
          />
          <FeatureItem
            icon="🔍"
            title="Busca inteligente"
            description="Encontre rapidamente o que precisa"
          />
        </View>

        {/* Login Buttons */}
        <View className="w-full max-w-sm gap-3">
          {/* Google Login */}
          <Pressable
            onPress={handleGoogleLogin}
            style={({ pressed }) => [
              {
                width: "100%",
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                paddingVertical: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text className="text-lg mr-3">🔵</Text>
            <Text className="text-foreground font-semibold text-base">
              Entrar com Google
            </Text>
          </Pressable>

          {/* Microsoft Login */}
          <Pressable
            onPress={handleMicrosoftLogin}
            style={({ pressed }) => [
              {
                width: "100%",
                backgroundColor: colors.primary,
                borderRadius: 16,
                paddingVertical: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text className="text-lg mr-3">🟦</Text>
            <Text className="text-white font-semibold text-base">
              Entrar com Microsoft
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text className="text-xs text-muted mt-8 text-center">
          Ao entrar, você concorda com os{"\n"}Termos de Uso e Política de Privacidade
        </Text>
      </View>
    </ScreenContainer>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const colors = useColors();

  return (
    <View className="flex-row items-center mb-4">
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: `${colors.primary}15` }}
      >
        <Text className="text-xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-foreground">{title}</Text>
        <Text className="text-sm text-muted">{description}</Text>
      </View>
    </View>
  );
}
