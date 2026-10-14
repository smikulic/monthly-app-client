import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useViewportReposition } from "./useViewportReposition";

/**
 * The bug: a select menu opened while the soft keyboard was up stayed where the
 * keyboard had put it, floating well above its own field once the keyboard
 * closed. iOS fires nothing on `window` for that — only `visualViewport` knows.
 */
const withVisualViewport = (viewport: unknown) => {
  Object.defineProperty(window, "visualViewport", {
    value: viewport,
    configurable: true,
    writable: true,
  });
};

afterEach(() => withVisualViewport(undefined));

describe("useViewportReposition", () => {
  it("repositions when the keyboard opens, closes, or pans the page", () => {
    const viewport = new EventTarget();
    withVisualViewport(viewport);
    const updatePosition = vi.fn();

    renderHook(() =>
      useViewportReposition({ current: { updatePosition } } as never),
    );

    viewport.dispatchEvent(new Event("resize"));
    viewport.dispatchEvent(new Event("scroll"));

    expect(updatePosition).toHaveBeenCalledTimes(2);
  });

  it("stops listening once unmounted, so a closed menu is never touched", () => {
    const viewport = new EventTarget();
    withVisualViewport(viewport);
    const updatePosition = vi.fn();

    const { unmount } = renderHook(() =>
      useViewportReposition({ current: { updatePosition } } as never),
    );
    unmount();
    viewport.dispatchEvent(new Event("resize"));

    expect(updatePosition).not.toHaveBeenCalled();
  });

  it("does nothing where visualViewport is unavailable", () => {
    withVisualViewport(undefined);
    expect(() =>
      renderHook(() => useViewportReposition({ current: null })),
    ).not.toThrow();
  });
});
