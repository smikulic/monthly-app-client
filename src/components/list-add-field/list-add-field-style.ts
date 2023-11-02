import { styled } from "@mui/material/styles";

type ListAddFieldStyledProps = {
  indent?: boolean;
};

export const ListAddFieldStyled = styled("div")<ListAddFieldStyledProps>(
  ({ indent }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "48px",
    position: "relative",
    margin: indent ? "12px 12px 12px 48px" : "12px",
    padding: "14px 24px",

    color: "#181818",
    border: "1px solid #181818",
    // border: "2px solid #41efcd",
    background: "#41efcd",
    borderRadius: "16px",
    cursor: "pointer",

    "&:hover": {
      opacity: 0.7,
      // color: "#41efcd",
    },
  })
);
