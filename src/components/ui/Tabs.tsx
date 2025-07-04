// src/components/ui/Tabs.tsx
import React from "react";
import {
  Tab as MuiTab,
  TabProps,
  Tabs as MuiTabs,
  TabsProps,
} from "@mui/material";

export const Tab: React.FC<TabProps> = (props) => <MuiTab {...props} />;
export const Tabs: React.FC<TabsProps> = (props) => <MuiTabs {...props} />;

export type { TabProps, TabsProps };
