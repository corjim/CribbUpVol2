import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom"; // Get zpid from URL and retrieve carousel photo.
import CribbUp from "../../Api/CribbupApi";
import { Card, Container, Spinner, ListGroup, Carousel } from "react-bootstrap";

function BuildingDetails() {
    const location = useLocation(); // Get passed data
    const { zpid } = useParams(); // Extract property ID from URL

    // Retrieve `carouselPhotos` from state, or fallback to an empty array
    const carouselPhotos = location.state?.carouselPhotos || [];

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchBuilding() {
            if (!zpid) {
                setError("No property ID found.");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await CribbUp.propertiesDetails(zpid);

                if (!data || Object.keys(data).length === 0) {
                    throw new Error("No details available for this property.");
                }
                setProperty(data.building || data);
            } catch (err) {
                console.error("Error fetching property details:", err);
                setError("Failed to fetch property details.");
            } finally {
                setLoading(false);
            }
        }

        fetchBuilding();
    }, [zpid]);

    return (
        <Container className="mt-4">
            <h1 className="text-center">Property Details</h1>

            {/* Loading Indicator */}
            {loading && <Spinner animation="border" className="d-block mx-auto mt-3" />}

            {/* Error Message */}
            {error && <p className="text-danger text-center">{error}</p>}

            {/* Property Details */}
            {property && !loading && (
                <Card className="shadow mt-4">
                    {/* Property Image (Carousel for Multiple Photos) */}
                    {carouselPhotos.length > 0 ? (
                        <Carousel className="mb-4">
                            {carouselPhotos.map((photo, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100"
                                        src={photo.url}
                                        alt={`Property pix ${index + 1}`}
                                        style={{ maxHeight: "500px", objectFit: "cover" }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ) : (
                        <Card.Img
                            variant="top"
                            src={property.imgSrc || "https://via.placeholder.com/600"}
                            alt="No Images Available"
                            className="mb-4"
                        />
                    )}

                    <Card.Body>
                        <Card.Title className="text-center">
                            {property.address
                                ? `${property.address.streetAddress || "Unknown"}, 
                                    ${property.address.city || ""}, 
                                    ${property.address.state || ""} 
                                    ${property.address.zipcode || ""}`
                                : "No Address Available"}
                        </Card.Title>
                        <Card.Text className="text-center">{property.description || "No description available."}</Card.Text>

                        <ListGroup variant="flush">
                            <ListGroup.Item><strong>Price:</strong> {property.price ? `$${property.price.toLocaleString()}` : "Unavailable"}</ListGroup.Item>
                            <ListGroup.Item><strong>Type:</strong> {property.homeType || "Unavailable"}</ListGroup.Item>
                            <ListGroup.Item><strong>Bedrooms:</strong> {property.bedrooms || "N/A"} | <strong>Bathrooms:</strong> {property.bathrooms || "N/A"}</ListGroup.Item>
                            <ListGroup.Item><strong>Living Area:</strong> {property.livingArea ? `${property.livingArea.toLocaleString()} sqft` : "N/A"}</ListGroup.Item>
                            <ListGroup.Item><strong>Zestimate:</strong> {property.zestimate ? `$${property.zestimate.toLocaleString()}` : "Unavailable"}</ListGroup.Item>
                            <ListGroup.Item><strong>List status:</strong> {property.homeStatus || "Unavailable"}</ListGroup.Item>
                            <ListGroup.Item><strong>Rent:</strong> {property.rentZestimate ? `$${property.rentZestimate.toLocaleString()}` : "Unavailable"}</ListGroup.Item>
                            <ListGroup.Item><strong>Built in:</strong> {property.yearBuilt || "Unavailable"}</ListGroup.Item>
                        </ListGroup>

                        {/* Schools Information */}
                        {property.schools && Object.keys(property.schools).length > 0 && (
                            <div className="mt-4">
                                <h5>Nearby Schools</h5>
                                <ListGroup>
                                    {Object.entries(property.schools).map(([key, school]) => (
                                        <ListGroup.Item key={key}>
                                            <strong>Name:</strong> {school.name} &nbsp; | &nbsp;
                                            <strong>Grades:</strong> {school.grades} &nbsp; | &nbsp;
                                            <strong>Level:</strong> {school.level} &nbsp; | &nbsp;
                                            <strong>Rating:</strong> {school.rating}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        )}

                    </Card.Body>
                </Card>
            )}

            {/* No Data Message */}
            {!loading && !property && !error && (
                <p className="text-center text-muted mt-4">No property details available.</p>
            )}
        </Container>
    );
}

export default BuildingDetails;
