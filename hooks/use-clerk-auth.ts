import { useAuth, useUser, useOrganization } from "@clerk/clerk-expo";

export interface ClerkUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl: string | null;
}

export interface ClerkOrganization {
  id: string;
  name: string;
  slug: string | null;
  imageUrl: string | null;
}

export function useClerkAuth() {
  const { isLoaded, isSignedIn, signOut, getToken } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();

  const clerkUser: ClerkUser | null = user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
      }
    : null;

  const clerkOrganization: ClerkOrganization | null = organization
    ? {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        imageUrl: organization.imageUrl,
      }
    : null;

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("[ClerkAuth] Logout error:", error);
    }
  };

  // Get JWT token for API calls to GRC-NEXT
  const getAuthToken = async (): Promise<string | null> => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error("[ClerkAuth] Error getting token:", error);
      return null;
    }
  };

  return {
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    user: clerkUser,
    organization: clerkOrganization,
    logout,
    getAuthToken,
  };
}
