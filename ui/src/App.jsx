import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import PatrimoinePage from "./pages/PatrimoinePage";
import PossessionPage from "./pages/PossessionPage";
import CreateNewPossession from "./pages/CreateNewPossession.jsx";
import UpdatePossession from "./pages/UpdatePossession.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"

function App() {
	return (
		<Router>
			<Navbar className="mb-4 sticky-top " bg="dark" data-bs-theme="dark" expand="lg">
				<Container>
					<Navbar.Brand href="/" className={"text-light"} >Patrimoine Economique</Navbar.Brand>
					<Nav className="fs-5 fw-bold">
						<Nav.Link
							as={Link}
							to="/"
							className="mx-3 text-secondary border-secondary "
						>
							Patrimoine
						</Nav.Link>
						<Nav.Link
							as={Link}
							to="/possession"
							className="mx-3 text-secondary border-secondary "
						>
							Possessions
						</Nav.Link>
					</Nav>

				</Container>
			</Navbar>
			<Routes>
				<Route path="/" element={<PatrimoinePage />} />
				<Route path="/possession" element={<PossessionPage />} />
				<Route path="/create" element={<CreateNewPossession />} />
				<Route path="/edit/:libelle" element={<UpdatePossession />} />{" "}
			</Routes>
		</Router>
	);
}

export default App;
