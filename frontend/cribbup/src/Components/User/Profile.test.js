import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "./Profile";
import { AuthContext } from "../Context/AuthContext"; // Mock AuthContext
import CribbUpApi from "../../Api/CribbupApi"; // Mock API
import { BrowserRouter } from "react-router-dom";

jest.mock("../../Api/CribbupApi"); // Mock API calls

describe("Profile Component", () => {
    const mockUser = {
        user: {
            username: "testuser",
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
        }
    };

    const mockSetCurrentUser = jest.fn();

    function renderProfile() {
        return render(
            <AuthContext.Provider value={{ currentUser: mockUser, setCurrentUser: mockSetCurrentUser }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    }

    test("renders Profile component with user data", () => {
        renderProfile();

        expect(screen.getByText("Profile Page")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Username: testuser")).toBeInTheDocument();
        expect(screen.getByText("Email: johndoe@example.com")).toBeInTheDocument();
    });

    test("toggles edit mode when Edit Profile is clicked", () => {
        renderProfile();

        const editButton = screen.getByRole("button", { name: /edit profile/i });
        fireEvent.click(editButton);

        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    test("allows user to update profile", async () => {
        renderProfile();

        const editButton = screen.getByRole("button", { name: /edit profile/i });
        fireEvent.click(editButton);

        const firstNameInput = screen.getByLabelText(/First Name/i);
        const lastNameInput = screen.getByLabelText(/Last Name/i);
        const emailInput = screen.getByLabelText(/Email/i);
        const saveButton = screen.getByRole("button", { name: /save changes/i });

        fireEvent.change(firstNameInput, { target: { value: "Jane" } });
        fireEvent.change(lastNameInput, { target: { value: "Smith" } });
        fireEvent.change(emailInput, { target: { value: "janesmith@example.com" } });

        CribbUpApi.editProfile.mockResolvedValue({
            username: "testuser",
            firstName: "Jane",
            lastName: "Smith",
            email: "janesmith@example.com",
        });

        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockSetCurrentUser).toHaveBeenCalledWith({
                user: {
                    username: "testuser",
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "janesmith@example.com",
                }
            });
        });
    });

    test("displays error message when API call fails", async () => {
        renderProfile();

        const editButton = screen.getByRole("button", { name: /edit profile/i });
        fireEvent.click(editButton);

        CribbUpApi.editProfile.mockRejectedValue(new Error("Failed to update profile"));

        const saveButton = screen.getByRole("button", { name: /save changes/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText("Failed to update profile. Please try again.")).toBeInTheDocument();
        });
    });
});
