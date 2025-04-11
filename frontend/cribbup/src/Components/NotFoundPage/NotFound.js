// src/components/Common/NotFound.js
import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <Container className="text-center my-5">
            <h1 className="display-3">404</h1>
            <p className="lead">The page you're looking for doesn't exist.</p>
            <Button as={Link} to="/" variant="primary">
                Back to Home
            </Button>
        </Container>
    );
}

export default NotFound;
