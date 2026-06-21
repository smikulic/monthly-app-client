import { useState, MouseEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import { AUTH_TOKEN_USER } from "@/constants";
import { useResponsive } from "@/hooks/useResponsive";
import { ListItemIcon, Menu } from "@/components/ui/Menu";
import { MenuItem } from "@/components/ui/MenuItem";
import { Logout, AccountCircle, AssessmentOutlined } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  BackButtonStyled,
  HeaderStyled,
  HeaderLeftStyled,
  BrandStyled,
  AccountTriggerStyled,
  AccountAvatarStyled,
  MenuHeaderStyled,
  MenuHeaderNameStyled,
  MenuHeaderEmailStyled,
  MenuDividerStyled,
} from "./header-style";

export const Header = ({
  onLogout,
  userData,
}: {
  onLogout: () => void;
  userData?: any;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useResponsive();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Prefer the Google name, fall back to the email's local part.
  const email = userData?.email || localStorage.getItem(AUTH_TOKEN_USER) || "";
  const emailPrefix = email ? email.split("@")[0] : null;
  const userName = userData?.name || emailPrefix || "Account";
  const userPicture = userData?.picture;
  const initial = userName.charAt(0).toUpperCase();
  const isHome = location.pathname === "/";

  return (
    <HeaderStyled>
      <HeaderLeftStyled>
        {isMobile && !isHome ? (
          <BackButtonStyled
            onClick={() => navigate("/")}
            data-testid="back-button"
          >
            <ChevronLeftIcon />
            back
          </BackButtonStyled>
        ) : (
          <BrandStyled onClick={() => navigate("/")}>Monthly</BrandStyled>
        )}
      </HeaderLeftStyled>

      <AccountTriggerStyled
        onClick={handleMenuClick}
        aria-haspopup="true"
        aria-expanded={openMenu}
      >
        <AccountAvatarStyled src={userPicture || undefined} alt={userName}>
          {!userPicture && initial}
        </AccountAvatarStyled>
        <ExpandMoreIcon fontSize="small" />
      </AccountTriggerStyled>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuHeaderStyled>
          <MenuHeaderNameStyled>{userName}</MenuHeaderNameStyled>
          {email && <MenuHeaderEmailStyled>{email}</MenuHeaderEmailStyled>}
        </MenuHeaderStyled>

        <MenuDividerStyled />

        <MenuItem onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => navigate("/reports")}>
          <ListItemIcon>
            <AssessmentOutlined fontSize="small" />
          </ListItemIcon>
          Reports & Data
        </MenuItem>

        <MenuDividerStyled />

        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </HeaderStyled>
  );
};
