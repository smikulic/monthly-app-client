import { useState } from "react";
import { useNavigate } from "react-router";
import { useDemoControls, useIsDemo } from "./demo-session";
import { useOnboarding } from "./onboarding";
import {
  DemoBannerActionsStyled,
  DemoBannerButtonStyled,
  DemoBannerStyled,
  DemoBannerTextStyled,
} from "./demo-banner-style";

/**
 * Says whose money is on screen, and how to stop looking at it.
 *
 * Present on every authenticated page while a demo is running. The wording
 * matters more than the styling: someone who mistakes a demo household's
 * figures for their own has been actively misinformed by a finance app, so the
 * band states plainly that none of it is theirs.
 */
export const DemoBanner = () => {
  const isDemo = useIsDemo();
  const { leave } = useDemoControls();
  const { replayTour } = useOnboarding();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  if (!isDemo) return null;

  const handleExit = async () => {
    setLeaving(true);
    try {
      await leave();
      // Back to the dashboard: whatever page the demo was on is about to be
      // empty, and landing on an empty Insights page is a poor first look at
      // your own account.
      navigate("/");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <DemoBannerStyled role="status" data-tour="demo-banner">
      <DemoBannerTextStyled>
        <strong>Sample household.</strong> None of these figures are yours.
      </DemoBannerTextStyled>

      <DemoBannerActionsStyled>
        <DemoBannerButtonStyled type="button" onClick={replayTour}>
          Show me around
        </DemoBannerButtonStyled>
        <DemoBannerButtonStyled
          type="button"
          onClick={handleExit}
          disabled={leaving}
        >
          {leaving ? "Leaving…" : "Exit demo"}
        </DemoBannerButtonStyled>
      </DemoBannerActionsStyled>
    </DemoBannerStyled>
  );
};
