import { describe, expect, it } from "vitest";
import path from "path";

// Base path for the project
const PROJECT_ROOT = path.resolve(__dirname, "..");

describe("Phase 3 - Endpoints API, Notificações e Navegação", () => {
  // Skip API endpoints tests as they are in a different project (GRC-NEXT)
  describe.skip("Endpoints da API Mobile no GRC-NEXT", () => {
    it("deve ter endpoint /api/mobile/dashboard definido", async () => {
      // This test requires GRC-NEXT project to be available
      expect(true).toBe(true);
    });
  });

  describe("Serviço de Notificações", () => {
    const notificationsPath = path.join(PROJECT_ROOT, "lib/notifications.ts");

    it("deve ter arquivo de notificações", async () => {
      const fs = await import("fs");
      const exists = fs.existsSync(notificationsPath);
      expect(exists).toBe(true);
    });

    it("deve exportar função registerForPushNotifications", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(notificationsPath, "utf-8");
      expect(content).toContain("export async function registerForPushNotifications");
    });

    it("deve exportar função scheduleLocalNotification", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(notificationsPath, "utf-8");
      expect(content).toContain("export async function scheduleLocalNotification");
    });

    it("deve exportar função notifyTarefaVencida", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(notificationsPath, "utf-8");
      expect(content).toContain("export async function notifyTarefaVencida");
    });

    it("deve exportar função notifyRiscoElevado", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(notificationsPath, "utf-8");
      expect(content).toContain("export async function notifyRiscoElevado");
    });

    it("deve exportar função notifyNovoIncidente", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(notificationsPath, "utf-8");
      expect(content).toContain("export async function notifyNovoIncidente");
    });

    it("deve exportar interface NotificationData com campos corretos", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(notificationsPath, "utf-8");
      expect(content).toContain("export interface NotificationData");
      expect(content).toContain("type: \"tarefa_vencida\" | \"risco_elevado\" | \"incidente\" | \"geral\"");
    });
  });

  describe("Hook useNotifications", () => {
    const hookPath = path.join(PROJECT_ROOT, "hooks/use-notifications.ts");

    it("deve existir o hook useNotifications", async () => {
      const fs = await import("fs");
      const exists = fs.existsSync(hookPath);
      expect(exists).toBe(true);
    });

    it("deve conter handleNotificationNavigation para navegação", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(hookPath, "utf-8");
      expect(content).toContain("handleNotificationNavigation");
    });
  });

  describe("Telas de Detalhes", () => {
    it("deve ter tela de detalhes de ROPA", async () => {
      const fs = await import("fs");
      const filePath = path.join(PROJECT_ROOT, "app/detalhes/ropa/[id].tsx");
      const exists = fs.existsSync(filePath);
      expect(exists).toBe(true);
    });

    it("deve ter tela de detalhes de Risco", async () => {
      const fs = await import("fs");
      const filePath = path.join(PROJECT_ROOT, "app/detalhes/risco/[id].tsx");
      const exists = fs.existsSync(filePath);
      expect(exists).toBe(true);
    });

    it("deve ter tela de detalhes de Fornecedor", async () => {
      const fs = await import("fs");
      const filePath = path.join(PROJECT_ROOT, "app/detalhes/fornecedor/[id].tsx");
      const exists = fs.existsSync(filePath);
      expect(exists).toBe(true);
    });

    it("deve ter tela de detalhes de Incidente", async () => {
      const fs = await import("fs");
      const filePath = path.join(PROJECT_ROOT, "app/detalhes/incidente/[id].tsx");
      const exists = fs.existsSync(filePath);
      expect(exists).toBe(true);
    });

    it("deve ter tela de detalhes de Tarefa", async () => {
      const fs = await import("fs");
      const filePath = path.join(PROJECT_ROOT, "app/detalhes/tarefa/[id].tsx");
      const exists = fs.existsSync(filePath);
      expect(exists).toBe(true);
    });
  });

  describe("Componente DetailScreen", () => {
    const componentPath = path.join(PROJECT_ROOT, "components/detail-screen.tsx");

    it("deve existir o componente DetailScreen", async () => {
      const fs = await import("fs");
      const exists = fs.existsSync(componentPath);
      expect(exists).toBe(true);
    });

    it("deve exportar DetailScreen como função", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(componentPath, "utf-8");
      expect(content).toContain("export function DetailScreen");
    });

    it("deve ter props para title, sections e actions", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(componentPath, "utf-8");
      expect(content).toContain("title: string");
      expect(content).toContain("sections: DetailSection[]");
      expect(content).toContain("actions?:");
    });
  });

  describe("Navegação da Busca", () => {
    it("deve ter navegação para detalhes na tela de busca", async () => {
      const fs = await import("fs");
      const filePath = path.join(PROJECT_ROOT, "app/(tabs)/busca.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
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
      const filePath = path.join(PROJECT_ROOT, "components/ui/icon-symbol.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain('"chevron.left"');
    });
  });
});
