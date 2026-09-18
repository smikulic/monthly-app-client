import { ReactNode } from "react";
import {
  SectionCardStyled,
  SectionCardHeaderStyled,
  SectionCardTitleStyled,
  SectionCardDescriptionStyled,
  SectionCardBodyStyled,
} from "./section-card-style";

/**
 * A titled section of a settings-style page, as its own card.
 *
 * `danger` tints the border and title for a section whose actions cannot be
 * undone, so it separates itself from the ordinary settings above it rather
 * than relying on a red heading after a horizontal rule.
 */
export const SectionCard = ({
  title,
  description,
  danger,
  children,
}: {
  title: string;
  description?: ReactNode;
  danger?: boolean;
  children: ReactNode;
}) => (
  <SectionCardStyled danger={danger}>
    <SectionCardHeaderStyled>
      <SectionCardTitleStyled danger={danger}>{title}</SectionCardTitleStyled>
      {description && (
        <SectionCardDescriptionStyled>
          {description}
        </SectionCardDescriptionStyled>
      )}
    </SectionCardHeaderStyled>
    <SectionCardBodyStyled>{children}</SectionCardBodyStyled>
  </SectionCardStyled>
);
