import { useNavigate, useLocation } from "react-router";
import {
  SpaceDashboardOutlined,
  ReceiptLongOutlined,
  AccountBalanceWalletOutlined,
  SavingsOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import {
  SidebarStyled,
  SidebarItemStyled,
  SidebarLabelStyled,
} from "./sidebar-style";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: <SpaceDashboardOutlined /> },
  { label: "Expenses", path: "/expenses", icon: <ReceiptLongOutlined /> },
  { label: "Budget", path: "/budget", icon: <AccountBalanceWalletOutlined /> },
  { label: "Saving Goals", path: "/saving-goals", icon: <SavingsOutlined /> },
  { label: "Investments", path: "/investments", icon: <TrendingUpOutlined /> },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <SidebarStyled aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <SidebarItemStyled
          key={item.path}
          active={pathname === item.path}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <SidebarLabelStyled>{item.label}</SidebarLabelStyled>
        </SidebarItemStyled>
      ))}
    </SidebarStyled>
  );
};
