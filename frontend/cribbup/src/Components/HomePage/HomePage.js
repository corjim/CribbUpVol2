import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    return (
        <div className="homepage">

            {/* Hero Section */}
            <div className="hero">
                <Container className="text-center">
                    <h1 className="hero-title">Welcome to CribbUp</h1>
                    <p className="hero-subtitle">Your one-stop solution for finding the perfect a crib.</p>

                    <Link to="/search">
                        <Button variant="info" size="lg" className="hero-btn">
                            Start Searching
                        </Button>
                    </Link>
                </Container>
            </div>

            {/* Features Section */}
            <Container className="features">
                <div className="feature">
                    <h3>🏡 Find Your Dream Home</h3>
                    <p>Browse thousands of listings and find the perfect place to call home.</p>
                </div>
                <div className="feature">
                    <h3>📍 Search by Location</h3>
                    <p>Enter a city or ZIP code to explore available properties in your area.</p>
                </div>
                <div className="feature">
                    <h3>📊 Market Insights</h3>
                    <p>Get valuable insights about property values, rental estimates, and more.</p>
                </div>
            </Container>
        </div>
    );
}

export default HomePage;
