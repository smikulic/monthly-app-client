import { createContext, useContext, useState, ReactNode } from "react";

export type ScopeMode = "ALL" | "MINE" | "GROUP";

type ScopeState = { mode: ScopeMode; groupId?: string };

type ScopeContextValue = ScopeState & {
  setScope: (mode: ScopeMode, groupId?: string) => void;
};

const ScopeContext = createContext<ScopeContextValue>({
  mode: "ALL",
  setScope: () => {},
});

export const ScopeProvider = ({ children }: { children: ReactNode }) => {
  // Defaults to ALL each session; shared across pages via context.
  const [state, setState] = useState<ScopeState>({ mode: "ALL" });

  const setScope = (mode: ScopeMode, groupId?: string) =>
    setState({ mode, groupId });

  return (
    <ScopeContext.Provider value={{ ...state, setScope }}>
      {children}
    </ScopeContext.Provider>
  );
};

export const useScope = () => useContext(ScopeContext);

// GraphQL variables for the active scope (groupId only matters for GROUP mode).
export const scopeVariables = (scope: ScopeState) => ({
  scope: scope.mode,
  groupId: scope.mode === "GROUP" ? scope.groupId : undefined,
});
