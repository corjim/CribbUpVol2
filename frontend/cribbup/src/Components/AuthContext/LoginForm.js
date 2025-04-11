import React, { useState, useContext } from "react";
import { Spinner, Card, Button, Form, Container, Alert } from "react-bootstrap";
import CribbUp from "../../Api/CribbupApi";
import { AuthContext } from "../Context/AuthContext";
import "./AuthStyling/LoginForm.css"

function LoginForm() {
    const INITIAL_STATE = { username: "", password: "" };
    const [formData, setFormData] = useState(INITIAL_STATE);
    const { login, loading } = useContext(AuthContext);
    const [error, setError] = useState(null);

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(f => ({ ...f, [name]: value }));
    }

    async function handleSubmit(evt) {
        evt.preventDefault();

        try {
            const token = await CribbUp.authenticateUser(formData.username, formData.password);

            CribbUp.token = token;

            localStorage.setItem("token", token);

            login(token);

        } catch (err) {
            console.error("Login Failed ", err);
            setError("Invalid username or password. Please try again.");

        }
    }

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    }

    return (
        <Container className="d-flex justify-content-center align-items-center login-container">
            <Card className="login-card shadow">
                <div>
                    {error && <Alert variant="danger">{error}</Alert>}
                </div>
                <Card.Body>
                    <h2 className="text-center mb-4">Welcome Back</h2>
                    <p className="text-muted text-center">Sign in to access your account</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
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
                                placeholder="Enter your password"
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100 login-button">
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default LoginForm;
