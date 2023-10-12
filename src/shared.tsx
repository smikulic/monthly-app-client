import { styled } from "@mui/material/styles";

export const ListItemStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  borderBottom: "1px solid rgb(223, 223, 223)",
});

export const MainListItemStyled = styled(ListItemStyled)({
  height: "56px",
  padding: "16px 32px",
  fontSize: "20px",
});

export const SubcategoryListItemStyled = styled(ListItemStyled)({
  height: "52px",
  padding: "8px 32px 8px 56px",
  fontSize: "16px",
});

export const ProminentButtonStyled = styled("div")({
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  height: "40px",
  fontSize: "16px",
  color: "#181818",
  border: "1px solid #41efcd",
  borderRadius: "5px",
  cursor: "pointer",

  "&:hover": {
    color: " #41efcd",
  },
});
