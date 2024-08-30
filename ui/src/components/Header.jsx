// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Navbar, Nav, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Navbar expand="xl" bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="#home">Patrimoine Economique</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link}>Patrimoine</Nav.Link>
                        <Nav.Link as={Link}>Possession</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
