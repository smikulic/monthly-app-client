import React, { useState } from "react";

export type AnchorActionDropdownElProps = Record<string, HTMLElement | null>;

export const useActionDropdown = () => {
  const [anchorActionDropdownEl, setAnchorActionDropdownEl] =
    useState<AnchorActionDropdownElProps>({});

  const handleActionsDropdownClick = (
    event: React.MouseEvent<HTMLElement>,
    anchorIndex: string
  ) => {
    setAnchorActionDropdownEl({
      ...anchorActionDropdownEl,
      [anchorIndex]: event.currentTarget,
    });
  };

  const handleActionsDropdownClose = (anchorIndex: string) => {
    setAnchorActionDropdownEl({
      ...anchorActionDropdownEl,
      [anchorIndex]: null,
    });
  };

  return {
    anchorActionDropdownEl,
    handleActionsDropdownClick,
    handleActionsDropdownClose,
  };
};
