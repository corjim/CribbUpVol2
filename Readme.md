# Real Estate Finder App (CribbUp) 

A **real estate listing and favorite management** web application that allows users to search for properties with a zip code, cit/town or address, save them favorites for future reference and tracking. App made use of Zillow api in the intergration and search of properties.

https://cribbup-2lnb.onrender.com/
---


## Features  

- **Property Search** – Browse through real estate listings.  
- **Favorite Properties** – Add properties to your favorite list.  
- **Remove Favorites** – Easily remove saved properties.   
- **Responsive UI** – Built with **React Bootstrap** for a modern, mobile-friendly design.  

---

## Tech Stack  

| Technology       | Description                          |
|-----------------|--------------------------------------|
| React.js        | Frontend Framework                  |
| Express.js      | Backend API                         |
| Node.js         | Server-side Runtime                 |
| PostgreSQL      | Database for storing user favorites |
| Bootstrap       | UI Styling                          |


## Other Integration.

 - Zillow API (for real estate data)
---

## Installation & Setup  

### 1 Clone the Repository  

git clone https://github.com/corjim/CapstoneTwo-CribbUp/tree/main
cd cribbup

### Install Dependencies

npm install

Create a .env file in the root directory
DATABASE_URL = your_postgres_connection_string
ZILLOW_API_KEY = your_zillow_api_key
JWT_SECRET = your_jwt_secret_key


### Start the Development Server.
npm start
The app will be available at http://localhost:5000.

##  API Routes

### Authentication.
- POST /auth/register → Register a new user.
- POST /auth/login → Login and receive a JWT.

### User Routes.
- GET /users/:username → Get user details.
- PATCH /users/:username → Update user profile.

### Property Routes.
- GET /properties → Get all properties.
- GET /properties/:id → Get a single property details.

### Favorites Routes
- GET /favorites/:username → Get user's favorite properties.
- POST /favorites/:username → Add a property to favorites.
- DELETE /favorites/:username/:property_id → Remove a property from favorites.


## Future Enhancements.

- Google Map integration.
- Compare property feature.
- Sort and filter property based on prices, room and bathrooms numbers.


## Contributing.

Feel free to fork the repo and create pull requests!
