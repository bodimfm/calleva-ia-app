import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PUSH_TOKEN_KEY = "@calleva_push_token";

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  type: "tarefa_vencida" | "risco_elevado" | "incidente" | "geral";
  itemId?: string;
  module?: string;
  url?: string;
  [key: string]: string | undefined;
}

/**
 * Registra o dispositivo para notificações push
 * @returns Token de push ou null se falhar
 */
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    // Verificar se é um dispositivo físico
    if (!Device.isDevice) {
      console.log("[Notifications] Push notifications não funcionam em emuladores");
      return null;
    }

    // Verificar permissões existentes
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Solicitar permissões se necessário
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("[Notifications] Permissão para notificações não concedida");
      return null;
    }

    // Configurar canal de notificação para Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "CALLEVA IA",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#1E3A4C",
      });

      // Canal para alertas urgentes
      await Notifications.setNotificationChannelAsync("alerts", {
        name: "Alertas Urgentes",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: "#EF4444",
        sound: "default",
      });
    }

    // Obter token de push
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });

    const token = tokenData.data;

    // Salvar token localmente
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

    console.log("[Notifications] Token registrado:", token);
    return token;
  } catch (error) {
    console.error("[Notifications] Erro ao registrar:", error);
    return null;
  }
}

/**
 * Obtém o token de push salvo
 */
export async function getSavedPushToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Agenda uma notificação local
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: NotificationData,
  triggerSeconds?: number
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trigger: any = triggerSeconds
    ? { seconds: triggerSeconds }
    : null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data as Record<string, unknown>,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });

  return id;
}

/**
 * Envia notificação imediata
 */
export async function sendImmediateNotification(
  title: string,
  body: string,
  data?: NotificationData
): Promise<string> {
  return scheduleLocalNotification(title, body, data);
}

/**
 * Cancela uma notificação agendada
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancela todas as notificações agendadas
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Obtém o número de notificações pendentes
 */
export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}

/**
 * Define o número do badge
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Limpa o badge
 */
export async function clearBadge(): Promise<void> {
  await setBadgeCount(0);
}

// Tipos de listeners
export type NotificationReceivedListener = (
  notification: Notifications.Notification
) => void;

export type NotificationResponseListener = (
  response: Notifications.NotificationResponse
) => void;

/**
 * Adiciona listener para notificações recebidas (app em foreground)
 */
export function addNotificationReceivedListener(
  listener: NotificationReceivedListener
): Notifications.EventSubscription {
  return Notifications.addNotificationReceivedListener(listener);
}

/**
 * Adiciona listener para interação com notificações
 */
export function addNotificationResponseListener(
  listener: NotificationResponseListener
): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener(listener);
}

/**
 * Obtém a última notificação que abriu o app
 */
export async function getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
  return await Notifications.getLastNotificationResponseAsync();
}

// Notificações específicas do CALLEVA

/**
 * Notifica sobre tarefa vencida
 */
export async function notifyTarefaVencida(
  tarefaTitulo: string,
  tarefaId: string
): Promise<string> {
  return sendImmediateNotification(
    "⚠️ Tarefa Vencida",
    `A tarefa "${tarefaTitulo}" está vencida e requer atenção imediata.`,
    {
      type: "tarefa_vencida",
      itemId: tarefaId,
      module: "tarefas",
      url: `/tarefas/${tarefaId}`,
    }
  );
}

/**
 * Notifica sobre risco elevado identificado
 */
export async function notifyRiscoElevado(
  riscoNome: string,
  riscoId: string,
  classificacao: string
): Promise<string> {
  return sendImmediateNotification(
    "🔴 Risco Elevado Identificado",
    `O risco "${riscoNome}" foi classificado como ${classificacao}.`,
    {
      type: "risco_elevado",
      itemId: riscoId,
      module: "grc",
      url: `/grc/riscos/${riscoId}`,
    }
  );
}

/**
 * Notifica sobre novo incidente
 */
export async function notifyNovoIncidente(
  incidenteTitulo: string,
  incidenteId: string
): Promise<string> {
  return sendImmediateNotification(
    "🚨 Novo Incidente Registrado",
    `Um novo incidente foi registrado: "${incidenteTitulo}". Ação imediata pode ser necessária.`,
    {
      type: "incidente",
      itemId: incidenteId,
      module: "incidentes",
      url: `/incidentes/${incidenteId}`,
    }
  );
}

/**
 * Notificação geral
 */
export async function notifyGeral(
  titulo: string,
  mensagem: string
): Promise<string> {
  return sendImmediateNotification(titulo, mensagem, {
    type: "geral",
  });
}
