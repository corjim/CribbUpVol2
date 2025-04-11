# Proposal: Real Estate Finder App (Like Zillow)

## Overview

The Real Estate Finder App is a full-stack web application that allows users to search for property listings and estimate building costs using an external real estate API. Users can sign up, save favorite properties, and filter searches by location, price, and square footage.

The app will integrate an external real estate API (such as Zillow API, Realtor.com API, or PropertyData API) to fetch property listings, prices, and building cost estimates per square meter.

## Tech Stack

#### Frontend (React):
- React with React Router (for navigation).
- Axios (for API requests).
- React Context API or Redux (for state management).
- Tailwind CSS or Bootstrap (for styling).

#### Backend (Node.js + Express.js):

- Express.js (for REST API).
- JWT Authentication (for user authentication).
- PostgreSQL or MongoDB (for storing user preferences & saved properties).

#### External API:

- Zillow API / Realtor API / PropertyData API (to fetch real estate data).
- Google Maps API (for interactive location search & property visualization).

## Functionality and Features (Some of the features may or may not be implemented as of the time of submission.)

1. User Authentication & Profile
- Signup/Login using JWT authentication.
- Users can save favorite properties for later viewing.

2. Property Search by Location
- Users can search properties by zip code or city name.
- Fetch property listings from an external API.
- Display property details (price, square footage, number of rooms, etc.).
