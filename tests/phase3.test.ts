import { describe, expect, it } from "vitest";

describe("Phase 3 - Endpoints API, Notificações e Navegação", () => {
  describe("Endpoints da API Mobile no GRC-NEXT", () => {
    it("deve ter endpoint /api/mobile/dashboard definido", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/GRC-NEXT/app/api/mobile/dashboard/route.ts";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });

    it("deve ter endpoint /api/mobile/cliente definido", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/GRC-NEXT/app/api/mobile/cliente/route.ts";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });

    it("deve ter endpoint /api/mobile/search definido", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/GRC-NEXT/app/api/mobile/search/route.ts";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });

    it("deve ter endpoint /api/mobile/calleva-ai definido", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/GRC-NEXT/app/api/mobile/calleva-ai/route.ts";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });
  });

  describe("Serviço de Notificações", () => {
    it("deve ter arquivo de notificações", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/calleva-ia/lib/notifications.ts";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });

    it("deve exportar função registerForPushNotifications", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/lib/notifications.ts", "utf-8");
      expect(content).toContain("export async function registerForPushNotifications");
    });

    it("deve exportar função scheduleLocalNotification", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/lib/notifications.ts", "utf-8");
      expect(content).toContain("export async function scheduleLocalNotification");
    });

    it("deve exportar função notifyTarefaVencida", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/lib/notifications.ts", "utf-8");
      expect(content).toContain("export async function notifyTarefaVencida");
    });

    it("deve exportar função notifyRiscoElevado", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/lib/notifications.ts", "utf-8");
      expect(content).toContain("export async function notifyRiscoElevado");
    });

    it("deve exportar função notifyNovoIncidente", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/lib/notifications.ts", "utf-8");
      expect(content).toContain("export async function notifyNovoIncidente");
    });

    it("deve exportar interface NotificationData com campos corretos", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/lib/notifications.ts", "utf-8");
      expect(content).toContain("export interface NotificationData");
      expect(content).toContain("type: \"tarefa_vencida\" | \"risco_elevado\" | \"incidente\" | \"geral\"");
    });
  });

  describe("Hook useNotifications", () => {
    it("deve existir o hook useNotifications", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/calleva-ia/hooks/use-notifications.ts";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });

    it("deve conter handleNotificationNavigation para navegação", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/hooks/use-notifications.ts", "utf-8");
      expect(content).toContain("handleNotificationNavigation");
    });
  });

  describe("Telas de Detalhes", () => {
    it("deve ter tela de detalhes de ROPA", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/calleva-ia/app/detalhes/ropa/[id].tsx";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });

    it("deve ter tela de detalhes de Risco", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/calleva-ia/app/detalhes/risco/[id].tsx";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });

    it("deve ter tela de detalhes de Fornecedor", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/calleva-ia/app/detalhes/fornecedor/[id].tsx";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });

    it("deve ter tela de detalhes de Incidente", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/calleva-ia/app/detalhes/incidente/[id].tsx";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });

    it("deve ter tela de detalhes de Tarefa", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/calleva-ia/app/detalhes/tarefa/[id].tsx";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });
  });

  describe("Componente DetailScreen", () => {
    it("deve existir o componente DetailScreen", async () => {
      const fs = await import("fs");
      const path = "/home/ubuntu/calleva-ia/components/detail-screen.tsx";
      const exists = fs.existsSync(path);
      expect(exists).toBe(true);
    });

    it("deve exportar DetailScreen como função", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/components/detail-screen.tsx", "utf-8");
      expect(content).toContain("export function DetailScreen");
    });

    it("deve ter props para title, sections e actions", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/components/detail-screen.tsx", "utf-8");
      expect(content).toContain("title: string");
      expect(content).toContain("sections: DetailSection[]");
      expect(content).toContain("actions?:");
    });
  });

  describe("Navegação da Busca", () => {
    it("deve ter navegação para detalhes na tela de busca", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/app/(tabs)/busca.tsx", "utf-8");
      expect(content).toContain("router.push");
      expect(content).toContain("/detalhes/ropa/");
      expect(content).toContain("/detalhes/risco/");
      expect(content).toContain("/detalhes/fornecedor/");
      expect(content).toContain("/detalhes/incidente/");
      expect(content).toContain("/detalhes/tarefa/");
    });
  });

  describe("Ícones de Navegação", () => {
    it("deve ter ícone chevron.left mapeado para navegação de volta", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("/home/ubuntu/calleva-ia/components/ui/icon-symbol.tsx", "utf-8");
      expect(content).toContain('"chevron.left"');
    });
  });
});
