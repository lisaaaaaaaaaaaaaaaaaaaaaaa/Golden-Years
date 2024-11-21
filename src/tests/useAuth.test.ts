import { renderHook, act } from "@testing-library/react-hooks";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../config/firebase";

jest.mock("../config/firebase", () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  },
}));

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles login successfully", async () => {
    const mockUser = { uid: "123", email: "test@example.com" };
    (auth.signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it("handles login error", async () => {
    const error = new Error("Invalid credentials");
    (auth.signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("test@example.com", "wrong-password");
    });

    expect(result.current.error).toBe(error.message);
    expect(result.current.user).toBeNull();
  });
});
