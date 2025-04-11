DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (email LIKE '%@%'),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(25) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
  property_id TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT,
  beds INTEGER,
  baths INTEGER,
  square_feet INTEGER
);
