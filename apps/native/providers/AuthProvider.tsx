// providers/AuthProvider.tsx
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { gql, useQuery } from "@apollo/client";
import { API_URL, AUTH_TOKEN } from "@/constants";

const httpLink = createHttpLink({
  uri: API_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = SecureStore.getItem(AUTH_TOKEN);
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

type AuthContext = {
  token: string | null;
  user: any | null;
  setToken: (t: string | null) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => void;
  loading: boolean;
};
const authContext = createContext<AuthContext | null>(null);

export const useAuth = () => useContext(authContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(AUTH_TOKEN).then(setToken);
  }, []);

  const { data, loading, refetch } = useQuery(GET_USER_ME, {
    skip: !token,
    client,
  });

  const setTokenAction = async (token: string | null) => {
    if (token) {
      SecureStore.setItem(AUTH_TOKEN, token);
    } else {
      await SecureStore.deleteItemAsync(AUTH_TOKEN);
    }
    setToken(token);
    if (token) refetch();
  };

  const logout = async () => {
    await setTokenAction(null);
  };

  const value = useMemo(
    () => ({
      token,
      user: data?.me ?? null,
      setToken,
      logout,
      refetchUser: refetch,
      loading,
    }),
    [token, data, loading]
  );

  return (
    <ApolloProvider client={client}>
      <Ctx.Provider value={value}>{children}</Ctx.Provider>
    </ApolloProvider>
  );
}
