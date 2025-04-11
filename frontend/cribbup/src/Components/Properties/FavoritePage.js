import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import CribbUpApi from "../../Api/CribbupApi";
import { Card, Button, Container, Alert, Spinner, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";

function FavoritesPage() {
    const { currentUser } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchFavorites() {
            try {
                const response = await CribbUpApi.getFavorites(currentUser.user.username);

                // Converts response to an array
                const favoriteList = Array.isArray(response.favorites) ? response.favorites : response;

                setFavorites(favoriteList);
            } catch (err) {
                setError("Failed to load favorites.");
            } finally {
                setLoading(false);
            }
        }

        if (currentUser) {
            fetchFavorites();
        }
    }, [currentUser]);

    /** Remove a favorite property */
    async function handleRemoveFavorite(propertyId) {
        try {

            if (!propertyId) {
                setError("No property ID found.");
                return;
            }

            await CribbUpApi.removeFavorite(currentUser.user.username, propertyId);

            setFavorites(prevFavorites => prevFavorites.filter(fav => fav.property_id !== propertyId));

            setMessage("Property successfully removed");
            setTimeout(() => setMessage(null), 2000);

        } catch (err) {
            console.error("Error removing favorite:", err);
            setError("Failed to remove favorite. Please try again.");
            setTimeout(() => setError(null), 2000);
        }
    }

    return (
        <Container>
            <h2 className="mt-4">Your Favorite Properties</h2>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <Spinner animation="border" className="d-block mx-auto mt-5" />
            ) : favorites.length === 0 ? (
                <Alert variant="info">You have no favorite properties yet.</Alert>
            ) : (
                <Row className="g-4">
                    {favorites.map(fav => (
                        <Col key={fav.property_id} xs={12} sm={6} md={4} lg={3} xl={2}>
                            <Card className="shadow">
                                <Card.Img variant="top" src={fav.image_url} alt="Property" />
                                <Card.Body>
                                    <Card.Title>{fav.address}</Card.Title>
                                    <Card.Text>
                                        <strong>Price:</strong> ${fav.price.toLocaleString()}
                                        <br />
                                        <strong>Beds:</strong> {fav.beds} | <strong>Baths:</strong> {fav.baths}
                                        <br />
                                        <strong>Size:</strong> {fav.square_feet.toLocaleString()} sqft
                                    </Card.Text>
                                    <OverlayTrigger placement="top"
                                        overlay={<Tooltip> Remove from favorites </Tooltip>}>

                                        <Button variant="danger" onClick={() => handleRemoveFavorite(fav.property_id)}>
                                            🗑
                                        </Button>

                                    </OverlayTrigger>


                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default FavoritesPage;
