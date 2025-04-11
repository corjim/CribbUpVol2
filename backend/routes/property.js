const express = require("express");
const axios = require("axios");
const router = express.Router();
const { ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const { fetchZillowData } = require("../helpers/zillowAuthHeader");

const { getZillowDataFromFile, getBuildingInfoFromFile } = require("../helpers/zillowJson"); // For API testing. 

// Fetch properties based on city or ZIP code with pagination
router.get("/search", ensureLoggedIn, async (req, res, next) => {
    let { location, page = 1, limit = 12 } = req.query;

    if (!location) {
        return res.status(400).json({ error: "Missing parameter! Please add a location." });
    }

    try {
        // Convert page and limit to integers
        page = parseInt(page);
        limit = parseInt(limit);

        const data = await fetchZillowData("propertyExtendedSearch", {
            location: location,
            status_type: "ForSale",
            home_type: "Houses,Townhomes",
            page: page
        });

        if (!data || !data.props || data.props.length === 0) {
            return res.status(404).json({ error: "No properties found!" });
        }

        const totalResults = data.totalResultCount || data.props.length;
        const totalPages = Math.ceil(totalResults / limit);

        // Paginate results
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProperties = data.props.slice(startIndex, endIndex);

        res.status(200).json({

            totalResults: totalResults,
            totalPages: totalPages,
            properties: paginatedProperties,
            currentPage: page,
            resultsPerPage: limit
        })

    } catch (error) {
        console.error("Error fetching properties:", error.message);
        throw new BadRequestError("Failed to fetch properties from Zillow API.");
    }
});

// // Routes to fetch and display details of a building.
router.get("/property", ensureLoggedIn, async (req, res) => {
    let { zpid } = req.query;

    if (!zpid) {
        return res.status(400).json({ error: "Building missing zpid" });
    }

    try {
        const buildingData = await fetchZillowData("property", { zpid: zpid });

        // Ensure Api returned an empty object instead of an array
        if (!buildingData || Object.keys(buildingData).length === 0) {
            return res.status(404).json({ error: "No building found" });
        }

        res.status(200).json({ building: buildingData });
    } catch (err) {
        console.error("Error getting building", err.message || err);
        throw new BadRequestError("Failed to fetch building from Zillow API.");
    }
});


// Testing Routes with API replica
// Get details of a particular building based on `lotId` (for offline testing)
router.get("/buildingJson", async (req, res) => {
    try {
        const building = await getBuildingInfoFromFile();

        if (!building) {
            return res.status(500).json({ error: "No building found for this ID" });
        };

        res.status(200).json(building);

    } catch (error) {
        console.error("Error fetching building data:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch property data from a saved JSON file (for offline testing)
router.get("/jsonhouses", async (req, res) => {
    try {
        const properties = await getZillowDataFromFile();
        if (!properties) {
            return res.status(500).json({ error: "Failed to load property data" });
        }

        res.status(200).json({ properties });

    } catch (error) {
        console.error("Error fetching Zillow data:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
