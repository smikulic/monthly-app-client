import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  gql,
  useQuery,
  ServerError,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { API_URL, AUTH_TOKEN, AUTH_TOKEN_USER } from "@/constants";

// ============================================================================
// GraphQL Query
// ============================================================================
export const GET_USER_ME = gql`
  query Me {
    me {
      id
      email
      currency
      weeklyReminder
      name
      picture
      provider
    }
  }
`;

// ============================================================================
// Types
// ============================================================================
export type User = {
  id: string;
  email: string;
  currency: string;
  weeklyReminder: boolean;
  name?: string;
  picture?: string;
  provider?: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => void;
  loading: boolean;
};

// ============================================================================
// Context Creation
// ============================================================================

// AuthContext - holds authentication state
const AuthContext = createContext<AuthContextType | null>(null);

// UserContext - provides currency similar to web app (for easy access in components)
export const UserContext = createContext<string>("USD");

// ============================================================================
// Custom Hooks
// ============================================================================

/**
 * Hook to access authentication state and methods
 * Usage: const { user, token, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

/**
 * Hook to access user currency (similar to web app's UserContext)
 * Usage: const currency = useUserCurrency();
 */
export const useUserCurrency = () => {
  return useContext(UserContext);
};

// ============================================================================
// Apollo Client Setup
// ============================================================================

const httpLink = createHttpLink({
  uri: API_URL,
});

// Add authentication token to all GraphQL requests
const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// ============================================================================
// Auth Provider Component
// ============================================================================

/**
 * Internal component that handles user data fetching
 * Must be inside ApolloProvider to use useQuery
 */
function AuthProviderInner({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize: Load token from secure storage when app starts
  useEffect(() => {
    SecureStore.getItemAsync(AUTH_TOKEN).then((storedToken) => {
      setTokenState(storedToken);
      setIsInitialized(true);
    });
  }, []);

  // Fetch user data when token exists
  const {
    data,
    loading: userLoading,
    refetch,
  } = useQuery(GET_USER_ME, {
    skip: !token, // Don't query if no token
    onError: (error) => {
      // Handle invalid token errors
      if (error?.networkError) {
        const serverError = error.networkError as ServerError;
        const errorMessage = serverError.result;

        if (errorMessage?.includes("invalid token")) {
          logout(); // Auto logout on invalid token
        }
      }
    },
  });

  /**
   * Set authentication token and store it securely
   * @param newToken - JWT token or null to clear
   */
  const setToken = async (newToken: string | null) => {
    if (newToken) {
      await SecureStore.setItemAsync(AUTH_TOKEN, newToken);
      setTokenState(newToken);
      refetch(); // Fetch user data with new token
    } else {
      // Clear all auth data
      await SecureStore.deleteItemAsync(AUTH_TOKEN);
      await SecureStore.deleteItemAsync(AUTH_TOKEN_USER);
      setTokenState(null);
    }
  };

  /**
   * Logout user - clears all stored auth data
   */
  const logout = async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(AUTH_TOKEN),
      SecureStore.deleteItemAsync(AUTH_TOKEN_USER),
    ]);
    setTokenState(null);
  };

  // Context value for AuthContext
  const authValue: AuthContextType = {
    token,
    user: data?.me ?? null,
    setToken,
    logout,
    refetchUser: refetch,
    loading: !isInitialized || userLoading,
  };

  // Extract currency for UserContext (similar to web app)
  const currency = data?.me?.currency || "USD";

  // Show nothing while initializing (prevents flash of login screen)
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={authValue}>
      <UserContext.Provider value={currency}>{children}</UserContext.Provider>
    </AuthContext.Provider>
  );
}

/**
 * AuthProvider - Manages authentication state and provides Apollo Client
 * Wraps the entire app to provide auth context to all components
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </ApolloProvider>
  );
}
