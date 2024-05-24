/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import Login from "../app/admin/login/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Admin Login", () => {
  it("should show authentication error when invalid login is provided", async () => {
    render(<Login />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("********");
    const loginButton = screen.getByText("Login");

    fireEvent.change(emailInput, { target: { value: "notvalid@gmail.com" } });
    expect(emailInput.value).toBe("notvalid@gmail.com");
    fireEvent.change(passwordInput, { target: { value: "password" } });
    expect(passwordInput.value).toBe("password");

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("should go to the admin homepage when valid login is provided", async () => {
    const pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });

    render(<Login />);

    expect(screen.queryByRole("login-home")).not.toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("********");
    const loginButton = screen.getByText("Login");

    fireEvent.change(emailInput, {
      target: { value: process.env.NEXT_PUBLIC_GUARD_EMAIL },
    });
    expect(emailInput.value).toBe(process.env.NEXT_PUBLIC_GUARD_EMAIL);
    fireEvent.change(passwordInput, {
      target: { value: process.env.NEXT_PUBLIC_GUARD_PASSWORD },
    });
    expect(passwordInput.value).toBe(process.env.NEXT_PUBLIC_GUARD_PASSWORD);

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/admin/home");
    });
  });
});
