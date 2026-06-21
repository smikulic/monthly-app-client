import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PENDING_INVITE_KEY } from "./accept-invite-page-container";

// Rendered inside the authenticated layout. If a user arrived via an invite
// link while logged out, we stashed the token; once they're authenticated this
// resumes the accept flow by redirecting to the accept page.
//
// We deliberately do NOT clear the token here, the accept page clears it on
// success/error. That keeps the redirect reliable even if this component
// remounts during the post-login load (when App briefly renders null).
export const PendingInviteResume = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(PENDING_INVITE_KEY);
    if (token) {
      navigate(`/accept-invite?token=${encodeURIComponent(token)}`, {
        replace: true,
      });
    }
  }, [navigate]);

  return null;
};
