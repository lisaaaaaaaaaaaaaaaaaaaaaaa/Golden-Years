import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../screens/LoginScreen";
import { useAuth } from "../hooks/useAuth";

jest.mock("../hooks/useAuth");

describe("LoginScreen", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: null,
    });
  });

  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  it("handles login submission", async () => {
    const mockLogin = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });
});
