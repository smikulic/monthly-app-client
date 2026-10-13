import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import {
  ProminentButtonStyled,
  ButtonGroupStyled,
  PageWrapperStyled,
  HelperTextStyled,
} from "@/shared";
import { handleLogout } from "@/utils/handleLogout";

/**
 * Shown when there is a token but `me` did not come back.
 *
 * The app cannot render a single authenticated page without a user — every one
 * of them reads `userData.id` or `userData.currency` — so the alternative to
 * this screen is a white page and a `TypeError` in Sentry.
 *
 * Only for failures that are *not* auth-shaped. An expired or rejected token
 * logs out on its own; this is for the server being unreachable or briefly
 * unhappy, where throwing the session away would be an overreaction to a blip.
 */
export const SessionError = ({ onRetry }: { onRetry: () => void }) => (
  <Container>
    <PageWrapperStyled>
      <Typography variant="h5">We couldn&rsquo;t load your account</Typography>
      <HelperTextStyled>
        Your data is safe — the app just couldn&rsquo;t reach the server. Try
        again in a moment, or sign out and back in.
      </HelperTextStyled>

      <ButtonGroupStyled>
        <ProminentButtonStyled textCenter onClick={onRetry}>
          Try again
        </ProminentButtonStyled>
        <ProminentButtonStyled textCenter outline onClick={handleLogout}>
          Sign out
        </ProminentButtonStyled>
      </ButtonGroupStyled>
    </PageWrapperStyled>
  </Container>
);
