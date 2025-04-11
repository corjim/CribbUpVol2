import React, { useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

function NavBar() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        console.error("AuthContext is undefined in NavBar.js!");
        return null;
    }

    const { currentUser, logout, loading } = authContext;

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">CribbUp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/search">Properties</Nav.Link>

                        {loading ? null : currentUser ? (
                            <>
                                <Nav.Link as={Link} to="/favorites">Favorites</Nav.Link>
                                <Nav.Link as={Link} to="/profile">Welcome {currentUser.user.firstName}</Nav.Link>
                                <Button variant="dark" onClick={logout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
