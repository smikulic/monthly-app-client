import { useState, MouseEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import { AUTH_TOKEN_USER } from "@/constants";
import { Button } from "@/components/ui/Button";
import { ListItemIcon, Menu } from "@/components/ui/Menu";
import { Logout, AccountCircle, AssessmentOutlined } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { BackButtonStyled, HeaderStyled } from "./header-style";
import { Box } from "@/components/ui/Box";
import { MenuItem } from "@/components/ui/MenuItem";
import { Avatar } from "@/components/ui/Avatar";

export const Header = ({
  onLogout,
  userData,
}: {
  onLogout: () => void;
  userData?: any;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Use Google name if available, otherwise fall back to email prefix
  const emailPrefix = localStorage.getItem(AUTH_TOKEN_USER)
    ? localStorage.getItem(AUTH_TOKEN_USER)!.split("@")[0]
    : null;
  const userName = userData?.name || emailPrefix;
  const userPicture = userData?.picture;
  const isHome = location.pathname === "/";

  return (
    <HeaderStyled>
      {!isHome && (
        <BackButtonStyled
          onClick={() => navigate("/")}
          data-testId="back-button"
        >
          <ChevronLeftIcon />
          back
        </BackButtonStyled>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          gap: 1,
        }}
      >
        {userName}
        {userPicture ? (
          <Avatar
            src={userPicture}
            alt={userName || "User"}
            sx={{ width: 32, height: 32, cursor: "pointer" }}
            onClick={handleMenuClick}
            // onError={(e) => console.error("Avatar image failed to load:", e)}
          />
        ) : (
          <Button
            color="secondary"
            endIcon={<MenuIcon />}
            onClick={handleMenuClick}
          />
        )}
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
        <MenuItem onClick={() => navigate("/reports")}>
          <ListItemIcon>
            <AssessmentOutlined fontSize="small" />
          </ListItemIcon>
          Reports
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
