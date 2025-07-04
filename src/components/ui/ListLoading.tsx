import React from "react";
import { Skeleton } from "@mui/material";
import { MainListItemStyled } from "@/shared";

interface ListLoadingProps {
  // Height of each skeleton item
  height?: number;
  // Number of skeleton items to show
  itemCount?: number;
  // Show action column (for lists with edit/delete actions)
  showActions?: boolean;
  // Show details column (for lists with additional info)
  showDetails?: boolean;
  // Custom width for the main content skeleton
  contentWidth?: number;
  // Custom width for the details/actions skeleton
  detailsWidth?: number;
}

export const ListLoading: React.FC<ListLoadingProps> = ({
  height = 24,
  itemCount = 2,
  showActions = false,
  showDetails = false,
  contentWidth = 200,
  detailsWidth = 60,
}) => {
  return (
    <>
      {Array.from({ length: itemCount }, (_, index) => (
        <MainListItemStyled key={index}>
          <Skeleton animation="wave" width={contentWidth} height={height} />
          {(showDetails || showActions) && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Skeleton animation="wave" width={detailsWidth} height={height} />
            </div>
          )}
        </MainListItemStyled>
      ))}
    </>
  );
};
