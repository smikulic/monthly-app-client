import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, ListItemIcon, Menu } from "@mui/material";
import { Logout, AccountCircle } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { AUTH_TOKEN_USER } from "@/constants";
import { BackButtonStyled, HeaderStyled } from "./header-style";
import { Box } from "@/components/ui/Box";
import { MenuItem } from "@/components/ui/MenuItem";

export const Header = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const userName = localStorage.getItem(AUTH_TOKEN_USER)
    ? localStorage.getItem(AUTH_TOKEN_USER)!.split("@")[0]
    : null;
  const isHome = location.pathname === "/";

  return (
    <HeaderStyled>
      {!isHome && (
        <BackButtonStyled onClick={() => navigate("/")}>
          <ChevronLeftIcon />
          back
        </BackButtonStyled>
      )}

      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        {userName}
        <Button
          color="secondary"
          endIcon={<MenuIcon />}
          onClick={handleMenuClick}
        />
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </HeaderStyled>
  );
};
