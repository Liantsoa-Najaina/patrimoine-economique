import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavbarComponent = () => {
	return (
		<Navbar bg="light" expand="lg">
			<Navbar.Brand as={Link} to="/">Patrimoine App</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link as={Link} to="/patrimoine">Menu Patrimoine</Nav.Link>
					<Nav.Link as={Link} to="/possessions">Menu Possessions</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavbarComponent;
