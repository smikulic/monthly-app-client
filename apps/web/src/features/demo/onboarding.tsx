/**
 * First-run onboarding: demo, tour, then set up your own.
 *
 * The order matters. A fresh account cannot demonstrate rollover (which needs
 * months of history), insights (which needs trends) or sharing (which needs a
 * second person), so the tour runs over a sample household first and the user's
 * own budget is created afterwards, by them.
 *
 * Whether it has run is `User.onboardingSeenAt` — server-side rather than
 * localStorage, or it would replay on every new device.
 */
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import * as Sentry from "@sentry/react";
import { useLocation, useNavigate } from "react-router";
import dayjs from "dayjs";
import { analytics } from "@/utils/mixpanel";
import { GET_CATEGORIES_LIST } from "@/pages/categories-page/categories-page-queries";
import { PENDING_INVITE_KEY } from "@/pages/accept-invite-page/accept-invite-page-container";
import { MARK_ONBOARDING_SEEN } from "./demo-queries";
import { useDemoControls } from "./demo-session";
import { useTour } from "./tour/use-tour";
import { OnboardingWizard } from "./wizard/onboarding-wizard";

interface OnboardingContextValue {
  /** Starts the demo and the tour. Used on first login and from Settings. */
  startShowcase: () => Promise<void>;
  /** Restarts the tour over a demo that is already running. */
  replayTour: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue>({
  startShowcase: async () => {},
  replayTour: () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({
  user,
  onUserChanged,
  children,
}: {
  user?: { id: string; onboardingSeenAt?: string | null } | null;
  /** Refetches `me`, so `onboardingSeenAt` is current after it is recorded. */
  onUserChanged?: () => void;
  children: ReactNode;
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const apolloClient = useApolloClient();
  const { enter, leave } = useDemoControls();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [markSeen] = useMutation(MARK_ONBOARDING_SEEN);

  // First login fires once per page load at most, whatever `me` does next.
  const autoStarted = useRef(false);

  /**
   * Reached from all three exits — finishing, closing, and Escape — so the
   * marker is written exactly once however the tour ends.
   *
   * The demo is torn down *before* the wizard opens, and that order is not
   * cosmetic: while a demo is running the Apollo link answers every mutation
   * locally, so a wizard opened over it would write the user's first budget
   * into a copy that is about to be thrown away.
   */
  const finishTour = () => {
    markSeen()
      .then(() => onUserChanged?.())
      .catch((error) => Sentry.captureException(error));

    analytics.track("Onboarding tour finished");

    leave()
      .catch((error) => Sentry.captureException(error))
      .then(offerWizardIfEmpty);
  };

  /**
   * Someone who joined an existing household already has a budget — the one
   * they were invited to. Offering them a starter set would put a second,
   * duplicate set of categories next to it, which is the exact mess the
   * household feature exists to avoid.
   *
   * Asked of the server rather than inferred, and only after the demo has been
   * torn down: while it is running this query is answered locally and would
   * report the sample household's categories every time.
   */
  const offerWizardIfEmpty = async () => {
    try {
      const { data } = await apolloClient.query({
        query: GET_CATEGORIES_LIST,
        variables: { date: dayjs().format("MM-DD-YYYY"), scope: "ALL" },
        fetchPolicy: "network-only",
      });

      if ((data?.categories ?? []).length === 0) setWizardOpen(true);
    } catch (error) {
      // Not knowing is not a reason to show nothing: an empty account with no
      // wizard is a blank screen, which is what this whole flow is for.
      Sentry.captureException(error);
      setWizardOpen(true);
    }
  };

  const { start: startTour } = useTour({ onFinish: finishTour });

  const startShowcase = async () => {
    try {
      await enter();
      // The tour opens on the dashboard; entering the demo may have left the
      // user wherever they were.
      navigate("/");
      await startTour();
    } catch (error) {
      // A demo that will not load must not block the app. The account behind
      // it is untouched and perfectly usable.
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    if (autoStarted.current) return;
    if (!user?.id) return;
    // Anyone who has seen it — including someone replaying from Settings, who
    // clears the marker deliberately — is left alone.
    if (user.onboardingSeenAt) return;

    /*
     * An invite in progress wins.
     *
     * `PendingInviteResume` redirects a freshly-signed-up invitee to the accept
     * page, and the tour's own `navigate("/")` would cancel that redirect and
     * strand them outside the household they were invited to. Waiting costs a
     * few seconds; the alternative loses the invitation.
     */
    if (localStorage.getItem(PENDING_INVITE_KEY)) return;
    if (pathname.startsWith("/accept-invite")) return;

    autoStarted.current = true;
    void startShowcase();
    // `pathname` is a dep so this reconsiders once the invite has been
    // accepted and the user lands back on the dashboard. Everything else about
    // `me` is deliberately excluded: re-running on a refetch would restart the
    // tour under someone half-way through it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.onboardingSeenAt, pathname]);

  const value: OnboardingContextValue = {
    startShowcase,
    replayTour: () => void startTour(),
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}

      <OnboardingWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </OnboardingContext.Provider>
  );
};
