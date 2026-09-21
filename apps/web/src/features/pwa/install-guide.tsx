import IosShareIcon from "@mui/icons-material/IosShare";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { SectionCard } from "@/components/section-card/section-card";
import { useInstallPlatform } from "./use-install-platform";
import {
  InstallAlternativeStyled,
  InstallButtonStyled,
  InstallCardStyled,
  InstallGlyphStyled,
  InstallLeadStyled,
  InstallStepStyled,
  InstallStepsStyled,
  InstallTitleStyled,
} from "./install-guide-style";

const TITLE = "Add Monthly to your home screen";
const LEAD = "Opens full screen, like any other app. Takes about ten seconds.";

/**
 * The instructions themselves, with no surrounding chrome.
 *
 * Shared between the welcome page and Settings so the two cannot drift — the
 * wording of a three-step gesture is exactly the sort of thing that gets fixed
 * in one copy and not the other.
 */
const InstallBody = () => {
  const { platform, install } = useInstallPlatform();

  if (platform === "ios") {
    return (
      <>
        <InstallLeadStyled>{LEAD}</InstallLeadStyled>
        <InstallStepsStyled>
          <InstallStepStyled>
            Tap
            <InstallGlyphStyled aria-hidden="true">
              <IosShareIcon />
            </InstallGlyphStyled>
            {/* Safari keeps Share in the bottom bar on iPhone and top-right on
                iPad; Chrome puts it beside the address bar. Naming the icon
                rather than a position is the only wording true everywhere. */}
            Share
          </InstallStepStyled>
          <InstallStepStyled>
            Scroll down and choose <strong>Add to Home Screen</strong>
          </InstallStepStyled>
          <InstallStepStyled>
            Tap <strong>Add</strong>
          </InstallStepStyled>
        </InstallStepsStyled>
      </>
    );
  }

  return (
    <>
      <InstallLeadStyled>{LEAD}</InstallLeadStyled>

      {/*
        Both, when the browser offers the prompt.

        The button is the fast path, but it is not reliable enough to be the
        only one: Chrome fires `beforeinstallprompt` once per page load, and a
        prompt that has been dismissed cannot be reopened — so anyone who taps
        away by accident would be left with a button that silently does
        nothing. The steps below always work.
      */}
      {install && (
        <>
          <InstallButtonStyled type="button" onClick={() => void install()}>
            Install Monthly
          </InstallButtonStyled>
          <InstallAlternativeStyled>or do it yourself</InstallAlternativeStyled>
        </>
      )}

      <InstallStepsStyled>
        <InstallStepStyled>
          Tap
          <InstallGlyphStyled aria-hidden="true">
            <MoreVertIcon />
          </InstallGlyphStyled>
          in the Chrome toolbar
        </InstallStepStyled>
        <InstallStepStyled>
          Choose
          <InstallGlyphStyled aria-hidden="true">
            <AddBoxOutlinedIcon />
          </InstallGlyphStyled>
          {/* Chrome calls this different things by version and by whether the
              site passes its installability checks, so the copy covers both
              rather than guessing. */}
          <strong>Add to Home screen</strong> or <strong>Install app</strong>
        </InstallStepStyled>
        <InstallStepStyled>
          Confirm with <strong>Install</strong>
        </InstallStepStyled>
      </InstallStepsStyled>
    </>
  );
};

/**
 * "Put Monthly on your home screen", for the welcome page.
 *
 * A budgeting app is only used if opening it is as easy as opening anything
 * else on the phone, and a bookmark two taps into a browser is not. There is an
 * Android build in the Play Store but no iOS one — Apple's guideline 4.2
 * rejects repackaged websites — so for iOS visitors the home screen icon *is*
 * the app, and nothing told them it existed.
 *
 * Renders nothing on a desktop, nothing once installed, and nothing on the
 * marketing domain, where an install would pin the sales page rather than the
 * app. See `servesApp` in `use-install-platform.ts`.
 */
export const InstallGuide = () => {
  const { platform } = useInstallPlatform();
  if (platform === "none") return null;

  return (
    <InstallCardStyled>
      <InstallTitleStyled>{TITLE}</InstallTitleStyled>
      <InstallBody />
    </InstallCardStyled>
  );
};

/**
 * The same thing in Settings, for people who are already signed in.
 *
 * Most people do not install anything on their first visit — they try the
 * product first. By the time it is worth a home screen icon they are inside the
 * app and will never see the welcome page again, so the offer has to live
 * somewhere they can come back to.
 */
export const InstallSection = () => {
  const { platform } = useInstallPlatform();
  if (platform === "none") return null;

  return (
    <SectionCard
      title={TITLE}
      description="Skips the browser entirely — full screen, and one tap from wherever you keep it."
    >
      <InstallBody />
    </SectionCard>
  );
};
