import React from "react";
import { Card, Button, ListGroup, Carousel } from "react-bootstrap";
import "./SearchPage.css";


// A foundation to display return values of a property.
function BuildingCard({ property, carouselPhotos }) {
    return (
        <Card className="shadow mt-4">
            {/* Property Image Carousel */}
            {carouselPhotos.length > 0 ? (
                <Carousel className="mb-4">
                    {carouselPhotos.map((photo, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={photo.url}
                                alt={`Property pic ${index + 1}`}
                                style={{ maxHeight: "800px", objectFit: "contain" }}
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

                {/* View on Zillow Button */}
                {property.url && (
                    <Button variant="primary" href={property.url} target="_blank" className="d-block mx-auto mt-3">
                        View on Zillow
                    </Button>
                )}

            </Card.Body>
        </Card>
    );
}

export default BuildingCard;
