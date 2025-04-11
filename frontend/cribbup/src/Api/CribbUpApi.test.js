import axios from "axios";
import CribbUpApi from "./CribbupApi";

jest.mock("axios"); // Mock axios globally

const API_BASE_URL = "http://localhost:5000"; // Call to bckend

describe("CribbUpApi API Functions", () => {

    afterEach(() => {
        jest.clearAllMocks(); // Reset mocks after each test
    });

    test("searchProperties() should fetch property data", async () => {
        const mockResponse = {
            data: {
                properties: [
                    {
                        zpid: "12345",
                        address: "123 Main St, New York, NY",
                        price: 500000,
                        bedrooms: 3,
                        bathrooms: 2,
                        imgSrc: "https://via.placeholder.com/300",
                    }
                ],
                totalPages: 1,
                totalResults: 1,
            },
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await CribbUpApi.searchProperties("New York", 1, 12);

        expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/cribbup/search`, {
            params: { location: "New York", page: 1, limit: 12 },
        });

        expect(result).toEqual(mockResponse.data);
    });

    test("searchProperties() should handle errors", async () => {
        axios.get.mockRejectedValue(new Error("Failed to fetch"));

        await expect(CribbUpApi.searchProperties("Invalid City", 1, 12)).rejects.toThrow(
            "Failed to load properties"
        );
    });

    test("propertiesDetails() should fetch property details", async () => {
        const mockResponse = {
            data: {
                building: {
                    zpid: "12345",
                    address: "123 Main St, New York, NY",
                    price: 500000,
                    bedrooms: 3,
                    bathrooms: 2,
                    imgSrc: "https://via.placeholder.com/300",
                },
            },
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await CribbUpApi.propertiesDetails("12345");

        expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/cribbup/property`, {
            params: { zpid: "12345" },
        });

        expect(result).toEqual(mockResponse.data);
    });

    test("authenticateUser() should return a token", async () => {
        const mockResponse = { data: { token: "test-token" } };

        axios.post.mockResolvedValue(mockResponse);

        const result = await CribbUpApi.authenticateUser("testuser", "password123");

        expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/auth/token`, {
            username: "testuser",
            password: "password123",
        });

        expect(result).toBe("test-token");
    });

    test("authenticateUser() should handle login errors", async () => {
        axios.post.mockRejectedValue(new Error("Invalid credentials"));

        await expect(CribbUpApi.authenticateUser("wronguser", "wrongpass")).rejects.toThrow();
    });

    test("signup() should return a token after successful registration", async () => {
        const mockResponse = { data: { token: "signup-test-token" } };

        axios.post.mockResolvedValue(mockResponse);

        const result = await CribbUpApi.signup({
            username: "newuser",
            password: "newpass",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
        });

        expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/auth/register`, {
            username: "newuser",
            password: "newpass",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
        });

        expect(result).toBe("signup-test-token");
    });

    test("getUser() should fetch user details", async () => {
        const mockResponse = {
            data: {
                username: "testuser",
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
            },
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await CribbUpApi.getUser("testuser");

        expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/users/testuser`);
        expect(result).toEqual(mockResponse.data);
    });

    test("editProfile() should update user data", async () => {
        const mockResponse = {
            data: {
                username: "testuser",
                firstName: "John Updated",
                lastName: "Doe",
                email: "john@example.com",
            },
        };

        axios.patch.mockResolvedValue(mockResponse);

        const result = await CribbUpApi.editProfile(
            { firstName: "John Updated", lastName: "Doe", email: "john@example.com" },
            "testuser"
        );

        expect(axios.patch).toHaveBeenCalledWith(
            `${API_BASE_URL}/users/testuser`,
            { firstName: "John Updated", lastName: "Doe", email: "john@example.com" }
        );

        expect(result).toEqual(mockResponse.data);
    });

    test("editProfile() should handle profile update errors", async () => {
        axios.patch.mockRejectedValue(new Error("Profile update failed"));

        await expect(
            CribbUpApi.editProfile(
                { firstName: "John Updated", lastName: "Doe", email: "john@example.com" },
                "testuser"
            )
        ).rejects.toThrow();
    });
});
