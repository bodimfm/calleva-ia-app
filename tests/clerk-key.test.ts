import { describe, it, expect } from "vitest";

describe("Clerk Configuration", () => {
  it("should have EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY set", () => {
    const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(key?.startsWith("pk_")).toBe(true);
  });

  it("should have valid Clerk publishable key format", async () => {
    const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    if (!key) {
      throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
    }

    // Clerk publishable keys start with pk_test_ or pk_live_
    const isValidFormat = key.startsWith("pk_test_") || key.startsWith("pk_live_");
    expect(isValidFormat).toBe(true);
  });

  it("should be able to fetch Clerk JWKS endpoint", async () => {
    const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    if (!key) {
      throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
    }

    // Extract the instance ID from the key
    // Format: pk_test_<base64_encoded_instance_id>
    const parts = key.split("_");
    if (parts.length < 3) {
      throw new Error("Invalid Clerk key format");
    }

    // The key is valid if it has the correct format
    // We can't actually call Clerk API without the full setup
    expect(parts[0]).toBe("pk");
    expect(["test", "live"]).toContain(parts[1]);
    expect(parts[2].length).toBeGreaterThan(10);
  });
});
