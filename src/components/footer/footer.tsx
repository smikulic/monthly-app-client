import React from "react";
import { FooterStyled } from "./footer-styled";

export const Footer = () => {
  return (
    <FooterStyled>
      <a
        data-testid="footer"
        href="https://forms.gle/a59QBuddeMJf2S64A"
        target="_blank"
        rel="noreferrer"
      >
        Leave a feedback or suggestion :)
      </a>
    </FooterStyled>
  );
};
