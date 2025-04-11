import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CribbUpApi from "../../Api/CribbupApi";
import { AuthContext } from "../Context/AuthContext";
import { Spinner, Card, Button, Form, Container, Alert } from "react-bootstrap";
import "./AuthStyling/SignUp.css";

function SignupForm() {
    const navigate = useNavigate();
    const { login, loading } = useContext(AuthContext);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
    });

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(f => ({ ...f, [name]: value }));
    }

    async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            const token = await CribbUpApi.signup(formData);

            login(token)

            navigate("/search"); // Redirect to property page after signup
        } catch (err) {
            console.error("Signup failed:", err);
            setError(err.message)
        };
    }

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    }

    return (
        <Container className="d-flex justify-content-center align-items-center signup-container">
            <Card className="signup-card shadow">
                <div>
                    {error && <Alert variant="danger">{error}</Alert>}
                </div>
                <Card.Body>
                    <h2 className="text-center mb-4">Create an Account</h2>
                    <p className="text-muted text-center">Join us today!</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter your last name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100 signup-button">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SignupForm;
