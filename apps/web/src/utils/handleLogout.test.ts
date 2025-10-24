import { describe, expect, it, vi } from "vitest";
import { mockReplace } from "../setupTests";
import { handleLogout } from "./handleLogout";

vi.mock("./mixpanel", () => ({
  analytics: {
    trackUserLogout: vi.fn(),
    reset: vi.fn(),
  },
}));

describe("handleLogout", () => {
  it("should log out a user and return to log in screen", async () => {
    const spyLocalStorageRemove = vi.spyOn(localStorage, "removeItem");

    await handleLogout();

    expect(spyLocalStorageRemove).toHaveBeenCalled();
    expect(spyLocalStorageRemove).toHaveBeenCalledTimes(2);

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});
