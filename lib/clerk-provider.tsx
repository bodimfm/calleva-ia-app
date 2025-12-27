import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "./clerk-token-cache";
import { ReactNode } from "react";

// Clerk publishable key from environment
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.warn(
    "[Clerk] EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. Authentication will not work."
  );
}

interface ClerkAuthProviderProps {
  children: ReactNode;
}

export function ClerkAuthProvider({ children }: ClerkAuthProviderProps) {
  if (!publishableKey) {
    // Return children without Clerk if no key is set
    // This allows the app to run in development without Clerk
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {children}
    </ClerkProvider>
  );
}
