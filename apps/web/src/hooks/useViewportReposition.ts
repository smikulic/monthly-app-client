import { useEffect } from "react";
import type { PopoverActions } from "@mui/material";

/**
 * Keeps an open popover attached to its anchor when the soft keyboard appears
 * or disappears.
 *
 * MUI's Popover measures the anchor when it opens and re-measures only on
 * `window.resize`. iOS never fires that for the keyboard — the layout viewport
 * keeps its size and only the *visual* viewport moves, which is a separate
 * object with its own events. (`interactive-widget=resizes-content` in the
 * viewport meta does not change this; Safari ignores it.)
 *
 * So a menu opened while the keyboard was up kept the position it was given
 * and, once the keyboard went away, floated hundreds of pixels above the field
 * it belonged to. In a form that is the normal case rather than the edge one:
 * you have just typed an amount, so the keyboard is always up when you reach
 * the next control.
 */
export const useViewportReposition = (
  actions: React.RefObject<PopoverActions | null>,
) => {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    // `updatePosition` is a no-op unless the popover is open, so this does not
    // need to know whether it is.
    const reposition = () => actions.current?.updatePosition();

    // Resize covers the keyboard opening and closing; scroll covers the pan
    // iOS does to keep a focused field above it.
    viewport.addEventListener("resize", reposition);
    viewport.addEventListener("scroll", reposition);

    return () => {
      viewport.removeEventListener("resize", reposition);
      viewport.removeEventListener("scroll", reposition);
    };
  }, [actions]);
};
