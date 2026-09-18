import { useState, MouseEvent } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import { Menu, ListItemIcon } from "@/components/ui/Menu";
import { MenuItem } from "@/components/ui/MenuItem";
import {
  FilterTriggerStyled,
  FilterTriggerLabelStyled,
  FilterTriggerValueStyled,
} from "./filter-select-style";

export interface FilterOption {
  id: string;
  label: string;
}

/**
 * A toolbar filter: a compact trigger showing the active choice, opening a
 * menu of options with a check beside the current one.
 *
 * Extracted from the scope filter once the expenses list needed a second one,
 * so both sit on the same baseline and behave identically rather than being
 * two lookalikes that drift.
 */
export const FilterSelect = ({
  label,
  value,
  options,
  onSelect,
  menuId,
  testId,
}: {
  /** Static word before the value, e.g. "View". */
  label: string;
  value: string;
  options: FilterOption[];
  onSelect: (id: string) => void;
  menuId: string;
  testId?: string;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <FilterTriggerStyled
        onClick={handleOpen}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        data-testid={testId}
      >
        <FilterTriggerLabelStyled>{label}</FilterTriggerLabelStyled>
        <FilterTriggerValueStyled>{value}</FilterTriggerValueStyled>
        <ExpandMoreIcon />
      </FilterTriggerStyled>

      <Menu
        anchorEl={anchorEl}
        id={menuId}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        {options.map((option) => {
          const active = option.label === value;
          return (
            <MenuItem
              key={option.id}
              selected={active}
              onClick={() => {
                onSelect(option.id);
                handleClose();
              }}
            >
              {/* Always rendered, so the labels stay aligned whether or not a
                  row is the active one. */}
              <ListItemIcon>
                {active && <CheckIcon fontSize="small" />}
              </ListItemIcon>
              {option.label}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
