import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@apollo/client";
import { AUTH_TOKEN } from "@/constants";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import {
  ProminentButtonStyled,
  PageWrapperStyled,
  HelperTextStyled,
} from "@/shared";
import { ACCEPT_GROUP_INVITE } from "@/features/groups/groups-queries";

// Where we stash an invite token while the user signs in / registers, so the
// flow can resume once they're authenticated.
export const PENDING_INVITE_KEY = "monthly.pendingInvite";

export const AcceptInvitePageContainer = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem(AUTH_TOKEN));
  const attempted = useRef(false);

  const [status, setStatus] = useState<"idle" | "accepting" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const [acceptInvite] = useMutation(ACCEPT_GROUP_INVITE, {
    onError: (e) => {
      localStorage.removeItem(PENDING_INVITE_KEY);
      setStatus("error");
      setMessage(e.message);
    },
    onCompleted: (data) => {
      localStorage.removeItem(PENDING_INVITE_KEY);
      setStatus("done");
      setMessage(`You joined ${data?.acceptGroupInvite?.name ?? "the group"}.`);
    },
  });

  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;

    if (isLoggedIn) {
      setStatus("accepting");
      acceptInvite({ variables: { token } });
    } else {
      // Remember the invite, then send them to sign in / create an account.
      localStorage.setItem(PENDING_INVITE_KEY, token);
    }
  }, [token, isLoggedIn, acceptInvite]);

  return (
    <Container>
      <PageWrapperStyled>
        <Typography variant="h5">Group invitation</Typography>

        {!token && (
          <HelperTextStyled>
            This invitation link is missing its token.
          </HelperTextStyled>
        )}

        {token && !isLoggedIn && (
          <>
            <HelperTextStyled>
              Sign in or create an account to accept this invitation. If you
              don't have an account yet, register with the email it was sent to,
              we'll add you to the group right after.
            </HelperTextStyled>
            <ProminentButtonStyled textCenter onClick={() => navigate("/")}>
              Sign in to accept
            </ProminentButtonStyled>
          </>
        )}

        {token && isLoggedIn && (
          <>
            {status === "accepting" && (
              <HelperTextStyled>Accepting your invitation…</HelperTextStyled>
            )}
            {(status === "done" || status === "error") && (
              <HelperTextStyled>{message}</HelperTextStyled>
            )}
            <ProminentButtonStyled
              textCenter
              onClick={() => navigate("/settings")}
            >
              Go to settings
            </ProminentButtonStyled>
          </>
        )}
      </PageWrapperStyled>
    </Container>
  );
};
