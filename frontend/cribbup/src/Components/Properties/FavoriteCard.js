import React, { useState, useEffect, useContext } from "react";
import { Button, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AuthContext } from "../Context/AuthContext";
import CribbUpApi from "../../Api/CribbupApi";
import "./FavoriteCard.css";

function FavoriteCard({ property }) {
    const { currentUser } = useContext(AuthContext);
    const [isFavorited, setIsFavorited] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);


    const username = currentUser?.user?.username; // Extract username safely

    /** Fetch and Set Favorite Status when component mounts */
    useEffect(() => {

        /** Check if the property is already in the user's favorites */
        async function fetchFavoriteStatus() {
            if (!username || !property?.zpid) {
                setError("No user or property information available.");
                return;
            }

            try {
                const favoritesResponse = await CribbUpApi.getFavorites(username);

                if (!favoritesResponse || typeof favoritesResponse !== "object") {
                    console.warn("Invalid favorites data received:", favoritesResponse);
                    return;
                }

                // Extract the actual favorites
                const favorites = Array.isArray(favoritesResponse.favorites)
                    ? favoritesResponse.favorites
                    : Array.isArray(favoritesResponse)
                        ? favoritesResponse
                        : [];

                // Check if the property is in the favorites list
                const isFavorite = favorites.some(fav => fav.property_id === property.zpid);
                setIsFavorited(isFavorite);

            } catch (error) {
                console.error("Error fetching favorites:", error);
                setError(null);
            }
        }

        if (username && property?.zpid) {

            fetchFavoriteStatus();
        }
    }, [username, property?.zpid]);


    /** Toggle favorite status */
    async function handleFavorite() {

        if (!username) {
            setError("You must be logged in to add favorites.");
            setTimeout(() => setError(null), 2000);
            return;
        }

        try {
            if (!isFavorited) {
                await CribbUpApi.addFavorite(username, {
                    property_id: property.zpid,
                    address: property.address,
                    price: property.price,
                    image_url: property.imgSrc,
                    beds: property.bedrooms,
                    baths: property.bathrooms,
                    square_feet: property.livingArea
                });

                setMessage("Property added to favorites!");

                setIsFavorited(true);
            } else {

                await CribbUpApi.removeFavorite(username, property.zpid);
                setMessage("Property removed from favorites!");
                setIsFavorited(false);
            }

            // Hide messages after 2 seconds
            setTimeout(() => {
                setMessage(null);
                setError(null);
            }, 2000);
        } catch (error) {
            console.error("Error updating favorites:", error);
            setError("Failed to update favorite. Please try again.");
            setTimeout(() => setError(null), 2000);
        }
    }

    return (
        <div className="favorite-card">
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {username && property?.zpid && (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{isFavorited ? "Remove from favorites" : "Add to favorites"}</Tooltip>}
                >
                    <Button
                        variant={isFavorited ? "danger" : "outline-primary"}
                        onClick={handleFavorite}
                        className="favorite-button"
                    >
                        {isFavorited ? "❤️ Remove" : "🤍 Favorite"}
                    </Button>
                </OverlayTrigger>
            )}
        </div>
    );
}

export default FavoriteCard;
