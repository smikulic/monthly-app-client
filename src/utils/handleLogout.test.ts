import { mockReplace } from "../setupTests";
import { handleLogout } from "./handleLogout";

describe("handleLogout", () => {
  it("should log out a user and return to log in screen", async () => {
    const spyLocalStorageRemove = jest.spyOn(localStorage, "removeItem");

    await handleLogout();

    expect(spyLocalStorageRemove).toHaveBeenCalled();
    expect(spyLocalStorageRemove).toHaveBeenCalledTimes(2);

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/app");
  });
});
