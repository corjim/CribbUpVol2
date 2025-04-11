require("dotenv").config();
const axios = require("axios");
const { ExpressError, BadRequestError } = require("../expressError");

const BASE_URL = "https://zillow-com1.p.rapidapi.com";
const RAPID_API_KEY = process.env.ZILLOW_API_KEY;

/**
 * Makes a request to the Zillow API with dynamic endpoint and parameters.
 *
 * @param {string} endpoint - The API endpoint (e.g., 'propertyExtendedSearch').
 * @param {object} params - The query parameters for the API request.
 * @returns {Promise<object>} - Returns the API response data.
 */
async function fetchZillowData(endpoint, params) {

    try {

        console.log("Making API request to:", `${BASE_URL}/${endpoint}`);
        console.log("With params:", params);
        console.log("Using API Key:", RAPID_API_KEY ? "Loaded Successfully" : "Missing API Key");


        const options = {
            method: "GET",
            url: `${BASE_URL}/${endpoint}`,
            params: params,
            headers: {
                "x-rapidapi-key": RAPID_API_KEY,
                "x-rapidapi-host": "zillow-com1.p.rapidapi.com"
            }
        };

        const response = await axios.request(options);

        return response.data // Return data from API

    } catch (error) {
        console.error("Zillow API Request Failed:", error.response ? error.response.data : error.message);
        throw new BadRequestError("Failed to fetch data from Zillow API");
    }
};

module.exports = { fetchZillowData };
