const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Favorite = require("../models/Favorite");

// Get all favorite properties of a user
router.get("/", ensureLoggedIn, async (req, res, next) => {
    try {
        // Probe here if user is coming out or not!!
        const { username } = req.query || res.locals.user

        if (!username) {
            throw new BadRequestError(`User not found: ${username}`)
        }
        const favorites = await Favorite.getAllFavorites(username);

        return res.json({ favorites });

    } catch (err) {
        return next(err);
    }
});

// Add a property to favorites
router.post("/:property_id", ensureLoggedIn, async (req, res, next) => {

    const { username, property_id, address, price, image_url, beds, baths, square_feet } = req.body;


    if (!username) {
        return res.status(500).json({ message: "No user or property in place!" });
    }

    try {

        // Check if property is already favorited
        const alreadyFavorited = await Favorite.isFavorite(username, property_id, address, price, image_url, beds, baths, square_feet);

        if (alreadyFavorited) {
            return res.status(400).json({ message: "Property already in favorites" });
        }

        // Add to favorites
        const favorite = await Favorite.addFavorite(username, property_id, address, price, image_url, beds, baths, square_feet);

        return res.status(201).json({ favorite });

    } catch (err) {
        return next(err);
    }
});

// Remove a property from favorites
router.delete("/:property_id", ensureLoggedIn, async (req, res, next) => {

    try {
        const { username, property_id } = req.body;

        if (!username) {
            return res.status(500).json({ message: "Must be a user to remove favorite" });
        }

        const removedFavorite = await Favorite.removeFavorite(username, property_id);

        if (!removedFavorite) {
            return res.status(404).json({ message: "Property not found in favorites" });
        }

        return res.json({ message: "Property removed from favorites" });

    } catch (err) {
        return next(err);
    }
});

module.exports = router;
