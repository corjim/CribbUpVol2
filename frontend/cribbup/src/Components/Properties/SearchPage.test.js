import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchPage from "./SearchPage";
import CribbUpApi from "../../Api/CribbupApi"; // Mock API
import { BrowserRouter } from "react-router-dom";

jest.mock("../../Api/CribbupApi"); // Mock API calls

describe("SearchPage Component", () => {
    function renderSearchPage() {
        return render(
            <BrowserRouter>
                <SearchPage />
            </BrowserRouter>
        );
    }

    test("renders search page with input field and button", () => {
        renderSearchPage();

        expect(screen.getByPlaceholderText(/Enter city or ZIP code/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
    });

    test("displays loading spinner while fetching properties", async () => {
        CribbUpApi.searchProperties.mockReturnValue(new Promise(() => { })); // Simulate ongoing request

        renderSearchPage();

        const searchInput = screen.getByPlaceholderText(/Enter city or ZIP code/i);
        const searchButton = screen.getByRole("button", { name: /Search/i });

        fireEvent.change(searchInput, { target: { value: "New York" } });
        fireEvent.click(searchButton);

        expect(screen.getByRole("status")).toBeInTheDocument(); // Bootstrap Spinner
    });

    test("fetches and displays property results", async () => {
        const mockProperties = [
            {
                zpid: "123456",
                address: "123 Main St, New York, NY",
                price: 500000,
                propertyType: "House",
                bedrooms: 3,
                bathrooms: 2,
                imgSrc: "https://via.placeholder.com/300",
                listingStatus: "For Sale",
            },
            {
                zpid: "789101",
                address: "456 Elm St, Brooklyn, NY",
                price: 750000,
                propertyType: "Apartment",
                bedrooms: 2,
                bathrooms: 1,
                imgSrc: "https://via.placeholder.com/300",
                listingStatus: "For Sale",
            },
        ];

        CribbUpApi.searchProperties.mockResolvedValue({
            properties: mockProperties,
            totalPages: 1,
            totalResults: 2,
        });

        renderSearchPage();

        const searchInput = screen.getByPlaceholderText(/Enter city or ZIP code/i);
        const searchButton = screen.getByRole("button", { name: /Search/i });

        fireEvent.change(searchInput, { target: { value: "New York" } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText("123 Main St, New York, NY")).toBeInTheDocument();
            expect(screen.getByText("456 Elm St, Brooklyn, NY")).toBeInTheDocument();
        });
    });

    test("displays error message if API fails", async () => {
        CribbUpApi.searchProperties.mockRejectedValue(new Error("Failed to fetch properties"));

        renderSearchPage();

        const searchInput = screen.getByPlaceholderText(/Enter city or ZIP code/i);
        const searchButton = screen.getByRole("button", { name: /Search/i });

        fireEvent.change(searchInput, { target: { value: "Invalid City" } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText("Failed to fetch properties.")).toBeInTheDocument();
        });
    });

    test("handles pagination correctly", async () => {
        const mockPropertiesPage1 = [
            {
                zpid: "123456",
                address: "123 Main St, New York, NY",
                price: 500000,
                propertyType: "House",
                bedrooms: 3,
                bathrooms: 2,
                imgSrc: "https://via.placeholder.com/300",
                listingStatus: "For Sale",
            },
        ];

        const mockPropertiesPage2 = [
            {
                zpid: "789101",
                address: "456 Elm St, Brooklyn, NY",
                price: 750000,
                propertyType: "Apartment",
                bedrooms: 2,
                bathrooms: 1,
                imgSrc: "https://via.placeholder.com/300",
                listingStatus: "For Sale",
            },
        ];

        CribbUpApi.searchProperties
            .mockResolvedValueOnce({ properties: mockPropertiesPage1, totalPages: 2, totalResults: 2 })
            .mockResolvedValueOnce({ properties: mockPropertiesPage2, totalPages: 2, totalResults: 2 });

        renderSearchPage();

        const searchInput = screen.getByPlaceholderText(/Enter city or ZIP code/i);
        const searchButton = screen.getByRole("button", { name: /Search/i });

        fireEvent.change(searchInput, { target: { value: "New York" } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText("123 Main St, New York, NY")).toBeInTheDocument();
        });

        const nextButton = screen.getByRole("button", { name: /Next/i });
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText("456 Elm St, Brooklyn, NY")).toBeInTheDocument();
        });

        const prevButton = screen.getByRole("button", { name: /Previous/i });
        fireEvent.click(prevButton);

        await waitFor(() => {
            expect(screen.getByText("123 Main St, New York, NY")).toBeInTheDocument();
        });
    });
});
