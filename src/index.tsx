import ReactDOM from "react-dom/client";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import * as Sentry from "@sentry/browser";
import "./index.css";
import "react-toastify/dist/ReactToastify.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { API_PRODUCTION, AUTH_TOKEN, SENTRY_DSN } from "./constants";
import { analytics } from "./utils/mixpanel";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    // functional integrations replace the old class-based ones
    Sentry.browserTracingIntegration(), // ← no more `new Sentry.BrowserTracing()`
    Sentry.replayIntegration(), // ← no more `new Sentry.Replay()`
  ],

  // distributed tracing targets now live at the top level
  tracePropagationTargets: [/^https:\/\/yourmonthly\.app/],

  // Performance Monitoring
  tracesSampleRate: 0.5,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // (Optional) backfill IP addresses for grouping & user context
  sendDefaultPii: true,
});

const apiUrl =
  import.meta.env.MODE === "production"
    ? API_PRODUCTION
    : "http://localhost:3001";

const httpLink = createHttpLink({
  uri: apiUrl,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
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

// Initialize Mixpanel
analytics.init();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
