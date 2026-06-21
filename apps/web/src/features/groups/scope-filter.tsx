import { useState, MouseEvent } from "react";
import { useQuery } from "@apollo/client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import { Menu, ListItemIcon } from "@/components/ui/Menu";
import { MenuItem } from "@/components/ui/MenuItem";
import { MY_GROUPS } from "./groups-queries";
import { useScope } from "./scope-context";
import {
  ScopeTriggerStyled,
  ScopeTriggerLabelStyled,
  ScopeTriggerValueStyled,
} from "./scope-filter-style";

// Lets the user view All (personal + groups), Personal only, or a specific
// group. Hidden entirely when the user belongs to no groups.
export const ScopeFilter = () => {
  const { mode, groupId, setScope } = useScope();
  const { data } = useQuery(MY_GROUPS, { fetchPolicy: "cache-and-network" });
  const groups: { id: string; name: string }[] = data?.myGroups ?? [];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (groups.length === 0) return null;

  const activeLabel =
    mode === "MINE"
      ? "Personal"
      : mode === "GROUP"
        ? (groups.find((g) => g.id === groupId)?.name ?? "All")
        : "All";

  const handleOpen = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const select = (next: () => void) => {
    next();
    handleClose();
  };

  const check = (active: boolean) => (
    <ListItemIcon>{active && <CheckIcon fontSize="small" />}</ListItemIcon>
  );

  return (
    <>
      <ScopeTriggerStyled
        onClick={handleOpen}
        aria-haspopup="true"
        aria-expanded={open}
        data-testid="scope-filter"
      >
        <ScopeTriggerLabelStyled>View</ScopeTriggerLabelStyled>
        <ScopeTriggerValueStyled>{activeLabel}</ScopeTriggerValueStyled>
        <ExpandMoreIcon />
      </ScopeTriggerStyled>

      <Menu
        anchorEl={anchorEl}
        id="scope-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem
          selected={mode === "ALL"}
          onClick={() => select(() => setScope("ALL"))}
        >
          {check(mode === "ALL")}
          All
        </MenuItem>
        <MenuItem
          selected={mode === "MINE"}
          onClick={() => select(() => setScope("MINE"))}
        >
          {check(mode === "MINE")}
          Personal
        </MenuItem>
        {groups.map((g) => {
          const active = mode === "GROUP" && groupId === g.id;
          return (
            <MenuItem
              key={g.id}
              selected={active}
              onClick={() => select(() => setScope("GROUP", g.id))}
            >
              {check(active)}
              {g.name}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
