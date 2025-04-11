import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

class CribbUpApi {

    // the token for interactive with the API will be stored here.
    static token = localStorage.getItem("token");


    static checkTokenExpiration(token) {
        try {
            const decoded = jwtDecode(token);
            const now = Date.now() / 1000;
            return decoded.exp < now;
        } catch (error) {
            console.error("Failed decoding token", error)
            return true // code probally expired.
        }
    }

    static async request(endpoint, data = {}, method = "get") {

        const url = `${API_BASE_URL}/${endpoint}`;

        // Check for expired token
        if (this.token && this.checkTokenExpiration(this.token)) {
            console.warn("Token expired. Logging out...");

            this.logout();

            throw new Error("Session expired. Please re-sign up again.");
        }

        const headers = { Authorization: `Bearer ${CribbUpApi.token}` };

        axios.defaults.headers.common['Cache-Control'] = 'no-cache';

        const params = method === "get" ? data : {};

        try {
            const res = await axios({ url, method, data, params, headers });

            if (!res || !res.data) {
                throw new Error("Response is undefined or missing data property.");
            }

            return res.data;

        } catch (err) {
            console.error("API Error:", err.response ? err.response.data : err.message);
            let message = err.response?.data?.error?.message || "Unknown error";
            throw Array.isArray(message) ? message : [message];
        }
    }

    /**
 * Fetch properties from the backend based on location.
 * @param {string} location - City name or ZIP code
 * @param {number} page - Current page number
 * @param {number} limit - Number of properties per page
 * @returns {Promise<object[]>} - List of properties
 */
    static async searchProperties(location, page = 1, limit = 12) {
        try {
            const res = await this.request("cribbup/search", { location, page, limit }, "get");

            if (!res || !res.properties) {
                throw new Error("No properties found in response.");
            }

            return res;

        } catch (err) {
            console.error("Error fetching properties:", err);
            throw new Error("Failed to load properties");
        }
    };

    // GET Details of a Building.
    /**
     * Fetch properties from the backend based on location.
     * @param {number} zpid - The zpid of a building.
     * @returns {Promise<object[]>} - Building Details.
     */
    static async propertiesDetails(zpid) {

        try {
            const res = await this.request("cribbup/property", { zpid }, "get")

            return res;

        } catch (err) {
            console.error("Hey something is wrong with this building", err);
            throw new Error("Failed to load building.")
        };
    }

    /** Login user  */
    static async login(username, password) {
        try {

            let res = await this.request("auth/token", { username, password }, "post");

            if (!res || !res.token) {
                throw new Error("Invalid response: No token received");
            }
            this.token = res.token;

            localStorage.setItem("token", res.token);

            return res;

        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        }
    };

    /** Authenticat and logs in user */
    static async authenticateUser(username, password) {

        try {
            let res = await this.request("auth/token", { username, password }, "post");

            const { token } = res //Extract the token from the response.

            this.token = res.token;

            localStorage.setItem("token", token);

            return token;

        } catch (err) {
            console.error("API Login Error:", err.response?.data || err.message);
            throw new Error(err.response?.data?.error || "Failed to login.");
        }
    }

    // Signs up users.
    static async signup(userData) {
        try {

            let res = await this.request("auth/register", userData, "post");

            if (!res) {
                throw new Error("API did not return a response.");
            }
            if (!res.token) {
                throw new Error(`API Response Missing Token: ${JSON.stringify(res)}`);
            }

            this.token = res.token;
            localStorage.setItem("token", res.token);

            return res.token;

        } catch (error) {
            console.error("Error during signup:", error);
            throw error;
        }
    }

    /** Get a user */
    static async getUser(username) {

        if (!this.token) {
            console.error("No token available. Cannot fetch user.");
            return null;
        }

        if (!username) {
            console.error("Username is undefined. Ensure it is being passed correctly.");
            return null;
        }

        try {

            const res = await this.request(`users/${username}`);
            return res;

        } catch (err) {
            console.error("Error fetching user:", err);
            return null;
        }
    }

    /** Update user's profile */
    // static async updateUser(username, userData) {
    //     return await this.request(`users/${username}`, userData, "patch");
    // }
    static async editProfile(userData, username) {
        try {

            // Make the API request to update user data
            let res = await this.request(`users/${username}`, userData, "patch");

            // Save the updated token to localStorage (if available)
            if (res.token) {
                localStorage.setItem("token", res.token);
            }

            return res.user;
        } catch (error) {
            console.error("Error editing profile:", error);
            throw error;
        }
    };


    /** Fetch user's favorite properties */
    static async getFavorites(username) {
        if (!username) {
            console.error("getFavorites: Username is required.");
            throw new Error("Username is required to fetch favorites.");
        }

        try {
            return await this.request("favorites", { username }, "get");
        } catch (err) {
            console.error("Error fetching favorites:", err);
            throw new Error("Failed to fetch favorite properties.");
        }
    }

    /** Add property to favorites */
    static async addFavorite(username, propertyDetails) {

        if (!username || !propertyDetails.property_id) {
            console.error("Missing username or property details in addFavorite");
            throw new Error("Username and property ID are required.");
        }

        try {
            const response = await this.request(`favorites/${propertyDetails.property_id}`, {
                username,
                ...propertyDetails, // Spread the property details
            }, "post");


            return response.favorite;

        } catch (err) {
            console.error(`Error adding property ${propertyDetails.property_id} to favorites:`, err);
            throw new Error("Failed to add property to favorites.");
        }
    }

    /** Remove property from favorites */
    static async removeFavorite(username, property_id) {

        if (!username) {

            console.error("removeFavorite: Missing  or propertyId.");
            throw new Error(" and property ID are required.");
        }

        try {
            return await this.request(`favorites/${property_id}`, { username, property_id }, "delete");

        } catch (err) {
            console.error(`Error removing property ${property_id} from favorites:`, err);
            throw new Error("Failed to remove property from favorites.");
        }
    }
}

export default CribbUpApi;