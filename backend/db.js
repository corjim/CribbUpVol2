"use strict";

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db = new Client({
    connectionString: getDatabaseUri(),
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

db.connect()
    .then(() => console.log("Connected to database".green))
    .catch(err => console.error("Database connection error:".red, err));

module.exports = db;

