import React from "react";
import { Card, Button, Carousel } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import FavoriteCard from "./FavoriteCard";

import "./SearchPage.css";

const PropertyCard = ({ property }) => {
    const navigate = useNavigate();

    if (!property) return <p>No property data available</p>;

    // Log in and ensure carousel has photos.
    const carouselPhotos = property.carouselPhotos ? property.carouselPhotos : [];

    return (
        <Card className="shadow property-card" >
            {/* Clickable Carousel */}
            {carouselPhotos.length > 0 ? (
                <div
                    onClick={() =>
                        navigate(`/property/${property.zpid}`, { state: { carouselPhotos } })
                    }
                    style={{ cursor: "pointer" }}
                >
                    <Carousel>
                        {carouselPhotos.map((photo, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={photo.url}
                                    alt={property.address || `Slide ${index + 1}`}
                                    style={{ maxHeight: "400px", objectFit: "cover" }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            ) : (
                <Link
                    to={{
                        pathname: `/property/${property.zpid}`,
                        state: { carouselPhotos: property.carouselPhotos || [] }
                    }}
                    className="text-decoration-none"
                >
                    <Card.Img
                        className="PropsImage"
                        variant="top"
                        src={property.imgSrc || "https://via.placeholder.com/300"}
                        alt={property.address || "Property Image"}
                        style={{ maxHeight: "400px", objectFit: "cover" }}
                    />
                </Link>
            )}

            <Card.Body className="props-body">
                <Link
                    to={{
                        pathname: `/property/${property.zpid}`,
                        state: { carouselPhotos }
                    }}
                    className="text-decoration-none"
                >
                    <Card.Title className="props-addy">{property.address || "No Address Available"}</Card.Title>
                </Link>
                <Card.Text className="props-body-details">
                    <strong>Price:</strong> {property.price ? `$${property.price.toLocaleString()}` : "Unavailable"} <br />
                    <strong>Type:</strong> {property.propertyType || "Unavailable"} <br />
                    <strong>Bedrooms:</strong> {property.bedrooms || "N/A"} |
                    <strong> Bathrooms:</strong> {property.bathrooms || "N/A"} <br />
                    <strong>Area:</strong> {property.livingArea ? `${property.livingArea} sqft` : "N/A"} <br />
                    <strong>Listing Status:</strong> {property.listingStatus || "Unavailable"}
                </Card.Text>


                {/* Links to the zillow web */}
                <Link
                    to={{
                        pathname: `/property/${property.zpid}`,
                        state: { carouselPhotos }
                    }}
                    className="text-decoration-none"
                >
                    <Button variant="primary">Discover crib</Button>
                </Link>

                {/* Favorite State and button */}
                <FavoriteCard property={property} />
            </Card.Body>
        </Card>
    );
};

export default PropertyCard;
