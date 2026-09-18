/**
 * Drives the first-run tour across the whole app.
 *
 * A cross-page tour is the expensive option — it steers the router, waits on
 * queries and has to survive the user clicking elsewhere — but a single-screen
 * tour cannot show rollover, insights or sharing, which is most of what there
 * is to show.
 *
 * Two things keep it from being fragile:
 *
 * - driver.js waits for each anchor itself (`waitForElement`) rather than this
 *   guessing a timeout, so a slow query delays a step instead of breaking it.
 * - A step whose anchor never appears is skipped rather than hanging
 *   (`skipMissingElement`) — and reported, because the alternative is a tour
 *   that quietly loses a third of itself and nobody finds out.
 */
import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import type { Driver } from "driver.js";
import * as Sentry from "@sentry/react";
import { useMediaQuery, useTheme } from "@mui/material";
import { tourSteps, TourStep } from "./tour-steps";

/** How long an anchor has to appear before its step is skipped. */
const ANCHOR_TIMEOUT_MS = 5000;

export const useTour = ({ onFinish }: { onFinish: () => void }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const driverRef = useRef<Driver | null>(null);

  // `onFinish` is called from driver's own callbacks, which are captured when
  // the tour starts; a ref keeps them pointing at the current one.
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  /**
   * driver fires `onDestroyed` for *any* teardown, including the ones this
   * hook performs itself — replacing a previous run, or unmounting. Treating
   * those as "the user finished the tour" would end the demo the moment it was
   * replayed, and would mark onboarding seen on logout.
   */
  const suppressFinish = useRef(false);

  const teardown = useCallback(() => {
    if (!driverRef.current) return;
    suppressFinish.current = true;
    driverRef.current.destroy();
    driverRef.current = null;
    suppressFinish.current = false;
  }, []);

  useEffect(() => teardown, [teardown]);

  const start = useCallback(async () => {
    // Replaying from Settings must not be read as finishing the run it
    // replaces.
    teardown();

    // Loaded on demand: the tour runs once per account, so its code and CSS
    // have no business in the bundle every returning user downloads.
    const [{ driver }] = await Promise.all([
      import("driver.js"),
      import("driver.js/dist/driver.css"),
    ]);

    const steps = tourSteps.filter((step) => !(isMobile && step.desktopOnly));

    // Route changes are applied before the step is shown; driver then waits
    // for the anchor, so no step races the query behind it.
    const enter = (step: TourStep) => {
      if (step.route) navigate(step.route);
      step.prepare?.();
    };

    const instance = driver({
      showProgress: true,
      // Honours the reduced-motion preference the app already declares in
      // `index.css`; the spotlight jumping is the point, not the easing.
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      allowClose: true,
      /*
       * The spotlight is a picture, not a button — on every step, with no
       * exceptions.
       *
       * Nearly every anchor is a link or an expandable row, so a reader who
       * taps what the tour is pointing at ends up on another page while the
       * tour stays behind, pointing at nothing on a screen they have left.
       * Nothing here asks to be clicked; the demo stays fully editable once
       * the tour is over, which is when the reader is free to wander.
       */
      disableActiveInteraction: true,
      // Likewise a stray click on the dimmed area: driver closes the tour by
      // default, which here also ends the demo. Leaving is the X and Escape.
      overlayClickBehavior: () => {},
      overlayColor: "#14120F",
      overlayOpacity: 0.6,
      stagePadding: 6,
      stageRadius: 12,
      waitForElement: ANCHOR_TIMEOUT_MS,
      skipMissingElement: true,
      popoverClass: "monthly-tour",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Set up my budget",
      steps: steps.map((step) => ({
        element: step.anchor ? `[data-tour="${step.anchor}"]` : undefined,
        popover: {
          title: step.title,
          description: step.description,
        },
        onHighlighted: () => {
          if (!step.anchor) return;
          if (document.querySelector(`[data-tour="${step.anchor}"]`)) return;
          // Skipped silently by driver. Reported here so a tour that has lost
          // a step to a refactor shows up somewhere other than a support email.
          Sentry.captureMessage(`Tour anchor missing: ${step.anchor}`, "warning");
        },
      })),
      onNextClick: () => {
        const next = steps[(instance.getActiveIndex() ?? 0) + 1];
        if (next) enter(next);
        instance.moveNext();
      },
      onPrevClick: () => {
        const previous = steps[(instance.getActiveIndex() ?? 0) - 1];
        if (previous) enter(previous);
        instance.movePrevious();
      },
      // Covers all three of the user's exits — finishing, closing and pressing
      // Escape — so the tour is never left half-ended.
      onDestroyed: () => {
        if (suppressFinish.current) return;
        driverRef.current = null;
        finishRef.current();
      },
    });

    driverRef.current = instance;
    enter(steps[0]);
    instance.drive();
  }, [isMobile, navigate, teardown]);

  return { start, stop: teardown };
};
