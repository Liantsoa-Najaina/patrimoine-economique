import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PossessionContainer from "./containers/PossessionContainer.jsx";
import PatrimoineContainer from "./containers/PatrimoineContainer.jsx";
import CreatePossessionContainer from "./containers/CreatePossessionContainer.jsx";
import UpdatePossessionContainer from "./containers/UpdatePossessionContainer.jsx";
import { Navbar } from "react-bootstrap";
import NotFoundPage from "./components/NotFoundPage.jsx"; // Add this component

export default function App() {
	return (
		<Router>
			<Navbar>
				{/* Add Navbar links for navigation */}
				<Navbar.Brand href="/patrimoine">Patrimoine</Navbar.Brand>
				<Navbar.Brand href="/possession">Possessions</Navbar.Brand>
			</Navbar>
			<Routes>
				<Route path="/patrimoine" element={<PatrimoineContainer />} />
				<Route path="/possession" element={<PossessionContainer />} />
				<Route path="/possession/create" element={<CreatePossessionContainer />} />
				<Route path="/possession/edit/:libelle" element={<UpdatePossessionContainer />} />
				<Route path="/" element={<PatrimoineContainer />} /> {/* Default route */}
				<Route path="*" element={<NotFoundPage />} /> {/* Handle 404 */}
			</Routes>
		</Router>
	);
}
