const db = require("../db.js");
const { NotFoundError, BadRequestError } = require("../expressError.js");

/**
 * Favorite Model - Handles all database operations related to user favorites.
 */
class Favorite {
    /** Get all favorite properties of a user */
    static async getAllFavorites(username) {
        const result = await db.query(
            `SELECT property_id, address, price, image_url, beds, baths, square_feet 
             FROM favorites 
             WHERE user_id = $1`,
            [username]
        );

        return result.rows;
    }

    /** Check if a property is already favorited */
    static async isFavorite(username, property_id) {
        const result = await db.query(
            `SELECT * FROM favorites WHERE user_id = $1 AND property_id = $2`,
            [username, property_id]
        );

        if (result.rows.length === 0) {
            return false;
        }
        return true;
    }

    /** Add a property to favorites */
    static async addFavorite(username, property_id, address, price, image_url, beds, baths, square_feet) {


        if (!username && !property_id) {
            throw new BadRequestError("Username and property ID are required.");
        }

        // Check for duplicate before inserting
        const duplicateCheck = await db.query(
            `SELECT property_id FROM favorites WHERE user_id = $1 AND property_id = $2`,
            [username, property_id]
        );

        if (duplicateCheck.rows.length > 0) {
            throw new BadRequestError(`Property already in favorites: ${property_id}`);
        }

        // Insert into favorites table
        const result = await db.query(
            `INSERT INTO favorites 
             (user_id, property_id, address, price, image_url, beds, baths, square_feet) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [username, property_id, address, price, image_url, beds, baths, square_feet]
        );

        return result.rows[0];
    }

    /** Remove a property from favorites */
    static async removeFavorite(username, property_id) {

        const result = await db.query(
            `DELETE FROM favorites WHERE user_id = $1 AND property_id = $2 
             RETURNING *`,
            [username, property_id]
        );

        if (result.rows.length === 0) {
            throw new NotFoundError(`No favorite found for property ID: ${property_id}`);
        }

        return result.rows[0];
    }
}

module.exports = Favorite;
