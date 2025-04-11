import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <Container>
                <Row className="text-center">
                    <Col md={4}>
                        <h5>CribbUp</h5>
                        <p>Your number one destination for finding a Crib.</p>
                    </Col>
                    <Col md={4}>
                        <h5>Quick Links</h5>
                        <ul className="footer-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/favorites">Favorites</a></li>
                            <li><a href="/search">Properties</a></li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5>Connect With Us</h5>
                        <div className="social-icons">
                            <a href="www.linkedin.com/in/martin-orji-77b37b226">linkedin<i className="fab fa-linkedin"></i></a>
                            <a href="https://github.com/corjim/CapstoneTwo-CribbUp/tree/main">gitHub<i className="fab fa-gitHub"></i></a>
                        </div>
                    </Col>
                </Row>
                <hr />
                <p className="text-center">© {new Date().getFullYear()} CribbUp. All rights reserved.</p>
            </Container>
        </footer>
    );
}

export default Footer;
