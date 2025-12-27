import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotifications,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  getLastNotificationResponse,
  clearBadge,
  NotificationData,
} from "@/lib/notifications";

export function useNotifications() {
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // Navegar para a tela apropriada baseado nos dados da notificação
  const handleNotificationNavigation = useCallback(
    (data: NotificationData | undefined) => {
      if (!data) return;

      // Limpar badge ao interagir
      clearBadge();

      // Navegar baseado no tipo
      switch (data.type) {
        case "tarefa_vencida":
          if (data.itemId) {
            router.push(`/detalhes/tarefa/${data.itemId}` as any);
          } else {
            router.push("/(tabs)/busca" as any);
          }
          break;
        case "risco_elevado":
          if (data.itemId) {
            router.push(`/detalhes/risco/${data.itemId}` as any);
          } else {
            router.push("/(tabs)/busca" as any);
          }
          break;
        case "incidente":
          if (data.itemId) {
            router.push(`/detalhes/incidente/${data.itemId}` as any);
          } else {
            router.push("/(tabs)/busca" as any);
          }
          break;
        default:
          // Para notificações gerais, ir para home
          router.push("/(tabs)" as any);
      }
    },
    [router]
  );

  useEffect(() => {
    // Registrar para notificações push
    registerForPushNotifications().then((token) => {
      if (token) {
        setExpoPushToken(token);
        console.log("[useNotifications] Token registrado:", token);
      }
    });

    // Listener para notificações recebidas em foreground
    notificationListener.current = addNotificationReceivedListener((notification) => {
      setNotification(notification);
      console.log("[useNotifications] Notificação recebida:", notification);
    });

    // Listener para interação com notificações
    responseListener.current = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data as NotificationData | undefined;
      console.log("[useNotifications] Resposta à notificação:", data);
      handleNotificationNavigation(data);
    });

    // Verificar se o app foi aberto por uma notificação
    getLastNotificationResponse().then((response) => {
      if (response) {
        const data = response.notification.request.content.data as NotificationData | undefined;
        console.log("[useNotifications] App aberto por notificação:", data);
        handleNotificationNavigation(data);
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [handleNotificationNavigation]);

  return {
    expoPushToken,
    notification,
  };
}
