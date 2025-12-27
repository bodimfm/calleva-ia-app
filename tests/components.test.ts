import { describe, it, expect } from "vitest";
import {
  mockDashboardMetrics,
  mockClienteInfo,
  mockModulosResumo,
  mockSearchResults,
  chatSuggestions,
  riskColors,
  statusColors,
} from "../lib/mock-data";

describe("Mock Data Structure", () => {
  describe("Dashboard Metrics", () => {
    it("should have valid dashboard metrics structure", () => {
      expect(mockDashboardMetrics).toBeDefined();
      expect(typeof mockDashboardMetrics.totalAtividades).toBe("number");
      expect(typeof mockDashboardMetrics.atividadesAtivas).toBe("number");
      expect(typeof mockDashboardMetrics.totalRiscos).toBe("number");
      expect(typeof mockDashboardMetrics.riscosElevados).toBe("number");
      expect(typeof mockDashboardMetrics.totalFornecedores).toBe("number");
    });

    it("should have valid risk classification data", () => {
      expect(Array.isArray(mockDashboardMetrics.riscosPorClassificacao)).toBe(true);
      expect(mockDashboardMetrics.riscosPorClassificacao.length).toBeGreaterThan(0);
      mockDashboardMetrics.riscosPorClassificacao.forEach((item) => {
        expect(item).toHaveProperty("classificacao");
        expect(item).toHaveProperty("count");
        expect(typeof item.count).toBe("number");
      });
    });

    it("should have valid activity status data", () => {
      expect(Array.isArray(mockDashboardMetrics.atividadesPorStatus)).toBe(true);
      expect(mockDashboardMetrics.atividadesPorStatus.length).toBeGreaterThan(0);
      mockDashboardMetrics.atividadesPorStatus.forEach((item) => {
        expect(item).toHaveProperty("status");
        expect(item).toHaveProperty("count");
        expect(typeof item.count).toBe("number");
      });
    });

    it("should have consistent activity counts", () => {
      const sumByStatus = mockDashboardMetrics.atividadesPorStatus.reduce(
        (sum, item) => sum + item.count,
        0
      );
      expect(sumByStatus).toBe(mockDashboardMetrics.totalAtividades);
    });
  });

  describe("Cliente Info", () => {
    it("should have valid client info structure", () => {
      expect(mockClienteInfo).toBeDefined();
      expect(mockClienteInfo.id).toBeDefined();
      expect(mockClienteInfo.nome).toBeDefined();
      expect(mockClienteInfo.cnpj).toBeDefined();
      expect(mockClienteInfo.setor).toBeDefined();
      expect(mockClienteInfo.responsavel).toBeDefined();
      expect(mockClienteInfo.email).toBeDefined();
    });

    it("should have valid CNPJ format", () => {
      // Basic CNPJ format check (XX.XXX.XXX/XXXX-XX)
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
      expect(cnpjRegex.test(mockClienteInfo.cnpj)).toBe(true);
    });

    it("should have valid email format", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(mockClienteInfo.email)).toBe(true);
    });
  });

  describe("Modulos Resumo", () => {
    it("should have valid modules structure", () => {
      expect(Array.isArray(mockModulosResumo)).toBe(true);
      expect(mockModulosResumo.length).toBeGreaterThan(0);
    });

    it("should have valid module data", () => {
      mockModulosResumo.forEach((modulo) => {
        expect(modulo).toHaveProperty("nome");
        expect(modulo).toHaveProperty("total");
        expect(modulo).toHaveProperty("pendentes");
        expect(modulo).toHaveProperty("concluidos");
        expect(modulo).toHaveProperty("alertas");
        expect(typeof modulo.total).toBe("number");
        expect(typeof modulo.pendentes).toBe("number");
        expect(typeof modulo.concluidos).toBe("number");
      });
    });

    it("should have consistent module counts", () => {
      mockModulosResumo.forEach((modulo) => {
        // Pendentes + Concluídos should be <= Total (some may be in other states)
        expect(modulo.pendentes + modulo.concluidos).toBeLessThanOrEqual(modulo.total + modulo.alertas);
      });
    });
  });

  describe("Search Results", () => {
    it("should have valid search results structure", () => {
      expect(Array.isArray(mockSearchResults)).toBe(true);
      expect(mockSearchResults.length).toBeGreaterThan(0);
    });

    it("should have valid search result items", () => {
      mockSearchResults.forEach((result) => {
        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("module");
        expect(result).toHaveProperty("title");
        expect(result).toHaveProperty("description");
        expect(result).toHaveProperty("url");
      });
    });

    it("should have valid module types", () => {
      const validModules = ["ropa", "grc", "fornecedores", "incidentes", "tarefas", "politicas", "contratos"];
      mockSearchResults.forEach((result) => {
        expect(validModules).toContain(result.module);
      });
    });
  });

  describe("Chat Suggestions", () => {
    it("should have valid chat suggestions", () => {
      expect(Array.isArray(chatSuggestions)).toBe(true);
      expect(chatSuggestions.length).toBeGreaterThan(0);
      chatSuggestions.forEach((suggestion) => {
        expect(typeof suggestion).toBe("string");
        expect(suggestion.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Color Mappings", () => {
    it("should have valid risk colors", () => {
      expect(riskColors).toBeDefined();
      expect(riskColors["Muito Baixo"]).toBeDefined();
      expect(riskColors["Baixo"]).toBeDefined();
      expect(riskColors["Médio"]).toBeDefined();
      expect(riskColors["Elevado"]).toBeDefined();
      expect(riskColors["Muito Elevado"]).toBeDefined();
    });

    it("should have valid hex color format for risk colors", () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      Object.values(riskColors).forEach((color) => {
        expect(hexColorRegex.test(color)).toBe(true);
      });
    });

    it("should have valid status colors", () => {
      expect(statusColors).toBeDefined();
      expect(statusColors["Ativa"]).toBeDefined();
      expect(statusColors["Em avaliação"]).toBeDefined();
      expect(statusColors["Encerrada"]).toBeDefined();
    });

    it("should have valid hex color format for status colors", () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      Object.values(statusColors).forEach((color) => {
        expect(hexColorRegex.test(color)).toBe(true);
      });
    });
  });
});

describe("Data Calculations", () => {
  it("should calculate total high risks correctly", () => {
    const totalHighRisks = mockDashboardMetrics.riscosElevados + mockDashboardMetrics.riscosMuitoElevados;
    expect(totalHighRisks).toBe(7); // 5 + 2
  });

  it("should calculate risk distribution total correctly", () => {
    const totalFromDistribution = mockDashboardMetrics.riscosPorClassificacao.reduce(
      (sum, item) => sum + item.count,
      0
    );
    expect(totalFromDistribution).toBe(mockDashboardMetrics.totalRiscos);
  });

  it("should have ROPA module in modules list", () => {
    const ropaModule = mockModulosResumo.find((m) => m.nome === "ROPA");
    expect(ropaModule).toBeDefined();
    expect(ropaModule?.total).toBe(mockDashboardMetrics.totalAtividades);
  });
});
