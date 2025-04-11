const express = require("express");
const fs = require("fs").promises; // File system module (supports async)
const path = require("path");
const router = express.Router();

/**
 * Reads the Zillow JSON file and extracts relevant data.
 */
async function getZillowDataFromFile() {
    try {
        // Read the JSON file
        const filePath = path.join(__dirname, "../zillowLocationData.json");
        const rawData = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(rawData); // Convert to JavaScript object

        if (!data || !data.props) {
            throw new Error("Invalid JSON format or missing data");
        }

        // Extract relevant property details
        return data.props.map(property => ({
            id: property.zpid,
            address: property.address || "N/A",
            price: property.price ? `$${property.price.toLocaleString()}` : "N/A",
            zestimate: property.zestimate ? `$${property.zestimate.toLocaleString()}` : "N/A",
            homeType: property.homeType || "N/A",
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            livingArea: property.livingArea ? `${property.livingArea} sq ft` : "N/A",
            yearBuilt: property.yearBuilt || "N/A",
            url: property.detailUrl || "#",
            image: property.imgSrc || "https://via.placeholder.com/300"
        }));

    } catch (error) {
        console.error("Error reading Zillow JSON file:", error.message);
        return null;
    }
}

// Extracts data from the building file
async function getBuildingInfoFromFile() {
    try {
        const filePath = path.join(__dirname, '../zillowBuildingData.json');
        const rawData = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(rawData);

        if (!data || !data.props) {
            throw new Error("Invalid JSON format or missing data");
        }

        const res = data.map(building => ({
            bathrooms: building.bathrooms,
            bedrooms: building.bedrooms,
            address: building.streetAddress,
            price: building.price ? `${building.price.toLocaleString()}` : "Unavailable",
            description: building.description || "Nice spot you would like it",
            yearBuilt: building.yearBuilt || null,
            RentEstimate: building.rentZestimate || "Not available",
            mortgageRates: building.mortgageRates ? `${building.mortgageRates.toLocaleString()}` : null,
            zestimate: property.zestimate ? `$${property.zestimate.toLocaleString()}` : "N/A",
            datePosted: building.datePosted || "Unavailbale",

        }))

    } catch (error) {
        console.error("Error reading Zillow JSON file:", error.message);
        return null;
    }
}
module.exports = { getZillowDataFromFile, getBuildingInfoFromFile };