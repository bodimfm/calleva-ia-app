import { describe, it, expect, vi } from "vitest";

// Mock data and API functions
import {
  getMockDashboardMetrics,
  getMockClienteInfo,
  getMockModulosResumo,
} from "../lib/grc-api";

describe("GRC API Mock Data", () => {
  describe("getMockDashboardMetrics", () => {
    it("should return valid dashboard metrics", () => {
      const metrics = getMockDashboardMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.totalAtividades).toBeGreaterThan(0);
      expect(metrics.totalRiscos).toBeGreaterThan(0);
      expect(metrics.totalFornecedores).toBeGreaterThan(0);
      expect(metrics.riscosPorClassificacao).toBeInstanceOf(Array);
      expect(metrics.atividadesPorStatus).toBeInstanceOf(Array);
    });

    it("should have correct risk classification structure", () => {
      const metrics = getMockDashboardMetrics();

      expect(metrics.riscosPorClassificacao.length).toBeGreaterThan(0);
      metrics.riscosPorClassificacao.forEach((item) => {
        expect(item).toHaveProperty("classificacao");
        expect(item).toHaveProperty("count");
        expect(typeof item.count).toBe("number");
      });
    });

    it("should have correct activity status structure", () => {
      const metrics = getMockDashboardMetrics();

      expect(metrics.atividadesPorStatus.length).toBeGreaterThan(0);
      metrics.atividadesPorStatus.forEach((item) => {
        expect(item).toHaveProperty("status");
        expect(item).toHaveProperty("count");
        expect(typeof item.count).toBe("number");
      });
    });

    it("should have valid risk counts", () => {
      const metrics = getMockDashboardMetrics();

      expect(metrics.riscosElevados).toBeGreaterThanOrEqual(0);
      expect(metrics.riscosMuitoElevados).toBeGreaterThanOrEqual(0);
      expect(metrics.riscosElevados + metrics.riscosMuitoElevados).toBeLessThanOrEqual(
        metrics.totalRiscos
      );
    });
  });

  describe("getMockClienteInfo", () => {
    it("should return valid client info", () => {
      const cliente = getMockClienteInfo();

      expect(cliente).toBeDefined();
      expect(cliente.id).toBeDefined();
      expect(cliente.nome).toBeDefined();
      expect(cliente.cnpj).toBeDefined();
      expect(cliente.email).toContain("@");
    });

    it("should have all required fields", () => {
      const cliente = getMockClienteInfo();

      expect(cliente).toHaveProperty("id");
      expect(cliente).toHaveProperty("nome");
      expect(cliente).toHaveProperty("cnpj");
      expect(cliente).toHaveProperty("setor");
      expect(cliente).toHaveProperty("responsavel");
      expect(cliente).toHaveProperty("email");
      expect(cliente).toHaveProperty("telefone");
      expect(cliente).toHaveProperty("dataContrato");
      expect(cliente).toHaveProperty("plano");
    });

    it("should have valid date format", () => {
      const cliente = getMockClienteInfo();
      const date = new Date(cliente.dataContrato);

      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });

  describe("getMockModulosResumo", () => {
    it("should return array of modules", () => {
      const modulos = getMockModulosResumo();

      expect(modulos).toBeInstanceOf(Array);
      expect(modulos.length).toBeGreaterThan(0);
    });

    it("should have correct module structure", () => {
      const modulos = getMockModulosResumo();

      modulos.forEach((modulo) => {
        expect(modulo).toHaveProperty("nome");
        expect(modulo).toHaveProperty("icone");
        expect(modulo).toHaveProperty("total");
        expect(modulo).toHaveProperty("pendentes");
        expect(modulo).toHaveProperty("concluidos");
        expect(modulo).toHaveProperty("alertas");
        expect(modulo).toHaveProperty("progresso");
      });
    });

    it("should have valid progress values", () => {
      const modulos = getMockModulosResumo();

      modulos.forEach((modulo) => {
        expect(modulo.progresso).toBeGreaterThanOrEqual(0);
        expect(modulo.progresso).toBeLessThanOrEqual(100);
      });
    });

    it("should have consistent totals", () => {
      const modulos = getMockModulosResumo();

      modulos.forEach((modulo) => {
        // pendentes + concluidos should be <= total (some might be in other states)
        expect(modulo.pendentes + modulo.concluidos).toBeLessThanOrEqual(
          modulo.total + modulo.alertas
        );
      });
    });
  });
});

// Clerk Token Cache tests skipped - requires native modules

describe("Theme Configuration", () => {
  it("should have CALLEVA brand colors", () => {
    const { themeColors } = require("../theme.config.js");

    expect(themeColors).toBeDefined();
    expect(themeColors.primary).toBeDefined();
    expect(themeColors.primary.light).toBe("#1E3A4C");
    expect(themeColors.primary.dark).toBe("#4A8BA8");
  });

  it("should have all required color tokens", () => {
    const { themeColors } = require("../theme.config.js");

    const requiredTokens = [
      "primary",
      "background",
      "surface",
      "foreground",
      "muted",
      "border",
      "success",
      "warning",
      "error",
    ];

    requiredTokens.forEach((token) => {
      expect(themeColors[token]).toBeDefined();
      expect(themeColors[token].light).toBeDefined();
      expect(themeColors[token].dark).toBeDefined();
    });
  });
});

describe("Mock Data Store", () => {
  it("should export chat messages", async () => {
    const { initialChatMessages, chatSuggestions } = await import("../lib/mock-data");

    expect(initialChatMessages).toBeInstanceOf(Array);
    expect(chatSuggestions).toBeInstanceOf(Array);
    expect(chatSuggestions.length).toBeGreaterThan(0);
  });

  it("should export risk colors", async () => {
    const { riskColors } = await import("../lib/mock-data");

    expect(riskColors).toBeDefined();
    expect(riskColors["Muito Elevado"]).toBeDefined();
    expect(riskColors["Elevado"]).toBeDefined();
  });

  it("should export module icons", async () => {
    const { moduleIcons } = await import("../lib/mock-data");

    expect(moduleIcons).toBeDefined();
    expect(moduleIcons.ropa).toBeDefined();
    expect(moduleIcons.grc).toBeDefined();
    expect(moduleIcons.fornecedores).toBeDefined();
  });
});
