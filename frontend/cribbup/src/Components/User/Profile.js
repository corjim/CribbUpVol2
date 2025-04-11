import { useState, useContext } from "react";
import CribbUpApi from "../../Api/CribbupApi"; // API request helper
import { AuthContext } from "../Context/AuthContext"; // Access authentication data
import { Card, Button, Container, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
import "./Profile.css";

/**
 * Profile Page: Allows a logged-in user to view and edit their profile information.
 */

const Profile = () => {
    // Access authentication context to retrieve and update user data
    const { currentUser, setCurrentUser } = useContext(AuthContext);

    // Ensure user data exists before accessing properties
    const loggedUser = currentUser?.user || {};

    // Initialize form state with the current user's data
    const [formData, setFormData] = useState({
        username: loggedUser.username || "",
        firstName: loggedUser.firstName || "",
        lastName: loggedUser.lastName || "",
        email: loggedUser.email || "",
    });

    // State for form visibility and messages
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);


    /**
     * Handle input changes in the form
     */
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    /**
     * Handle form submission
     * Sends the updated user data to the API and updates the context on success.
     */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Destructure username from formData
        const { username, ...updatedData } = formData;

        try {
            // Send updated data to the API
            const updatedUser = await CribbUpApi.editProfile(updatedData, username);

            // Update the currentUser in the context
            setCurrentUser((prevState) => ({
                ...prevState,
                user: updatedUser,
            }));

            setSuccessMessage("Profile successfully updated!");

            setIsEditing(false);
        } catch (error) {
            setError("Failed to update profile. Please try again.");
            console.error("Error during profile update:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return <h2 className="text-center text-danger">No user found. Please log in.</h2>;
    }

    return (
        <Container className="profile-container mt-4">
            <h1 className="text-center mb-4">Profile Page</h1>

            <Card className="shadow-lg p-4">
                {/* Display success or error messages */}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Show spinner if loading */}
                {loading && <Spinner animation="border" className="d-block mx-auto mt-3" />}

                {!isEditing ? (
                    <>
                        <Card.Body className="text-center">
                            <Card.Title className="mb-3">
                                {loggedUser.firstName || "First Name"} {loggedUser.lastName || "Last Name"}
                            </Card.Title>
                            <Card.Text className="mb-3">
                                <strong>Username:</strong> {loggedUser.username || "N/A"} <br />
                                <strong>Email:</strong> {loggedUser.email || "N/A"}
                            </Card.Text>
                            <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        </Card.Body>
                    </>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-center gap-2">
                            <Button type="submit" variant="success" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </Form>
                )}
            </Card>
        </Container>
    );
};

export default Profile;
