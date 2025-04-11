import React, { useState, useEffect, useCallback } from "react";
import CribbUp from "../../Api/CribbupApi";
import { Button, Container, Row, Col, Spinner, Form } from "react-bootstrap";
import PropertyCard from "./PropertyCard";
import "./SearchPage.css";

function SearchPage() {
    const [location, setLocation] = useState("");
    const [properties, setProperties] = useState(() => {
        const savedProperties = localStorage.getItem("savedProperties");
        return savedProperties ? JSON.parse(savedProperties) : [];
    });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem("lastPage"), 10) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const propertiesPerPage = 12;
    const [error, setError] = useState(null);

    const [searchButtonClicked, setSearchButtonClicked] = useState(false); // Ensures API calls is not made on keystrike.

    const handleChange = (evt) => {
        setLocation(evt.target.value);
    };

    // useCallback to prevent unnecessary re-renders
    const handleSearch = useCallback(async (newPage = 1) => {

        if (!location.trim()) {
            setError("Please enter a valid city or ZIP code.");
            return;
        }

        setLoading(true);
        setError(null);
        setSearchButtonClicked(true);
        try {
            const data = await CribbUp.searchProperties(location, newPage, propertiesPerPage);

            const propertiesArray = data?.properties || data?.props || [];
            const totalResults = data?.totalResultCount || data?.totalResults || propertiesArray.length;
            const totalPages = data?.totalPages || Math.ceil(totalResults / propertiesPerPage);

            setProperties(propertiesArray);
            setTotalPages(totalPages);
            setCurrentPage(newPage);

            //Persist data on refresh
            localStorage.setItem("lastLocation", location);
            localStorage.setItem("savedProperties", JSON.stringify(propertiesArray));
            localStorage.setItem("lastPage", newPage);
        } catch (error) {
            console.error("Error fetching properties:", error);
            setError("Failed to fetch properties.");
        } finally {
            setLoading(false);
        }
    }, [location]
    );

    //Run search on component mount and when location or properties change
    useEffect(() => {
        if (location && searchButtonClicked) {
            handleSearch(currentPage);
            setSearchButtonClicked(false);
        }
    }, [location, handleSearch, currentPage]);

    return (
        <Container className="search-page-container">
            <div className="search-header text-center">
                <h1>Find Your Perfect Home</h1>
                <p>Enter a city or ZIP code to discover properties</p>
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
                <Form.Control
                    type="text"
                    value={location}
                    onChange={handleChange}
                    placeholder="Search by city or ZIP code..."
                    className="search-input"
                />
                <Button onClick={() => handleSearch(1)} variant="primary" className="search-button">
                    Search
                </Button>
            </div>

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Loading Spinner */}
            {loading && <Spinner animation="border" className="d-block mx-auto mt-5 pageSpinner" />}

            {/* Property List */}
            {!loading && properties.length > 0 && (
                <Container className="search-results-container">

                    <h2 className="text-center mt-4 location-title"> 🏡 Properties in {location} 🏡</h2>

                    <Row className="property-row" >
                        {properties.map((property) => (
                            <Col key={property.zpid} md={4} className=" property-card mb-4">
                                <PropertyCard property={property} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            )}

            {/* Pagination Controls */}
            {!loading && properties.length > 0 && totalPages > 1 && (
                <div className="pagination-controls">
                    <Button
                        variant="secondary"
                        disabled={currentPage <= 1}
                        onClick={() => handleSearch(currentPage - 1)}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button
                        variant="secondary"
                        disabled={currentPage >= totalPages}
                        onClick={() => handleSearch(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* No Results Message */}
            {!loading && properties.length === 0 && !error && (
                <h5 className="no-results-message">Enter a ZIP code, city, or address to get started.</h5>
            )}
        </Container>
    );
}

export default SearchPage;
