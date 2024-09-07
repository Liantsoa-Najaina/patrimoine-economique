import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatrimoineContainer from './containers/PatrimoineContainer.jsx';
import PossessionContainer from './containers/PossessionContainer.jsx';
import CreatePossessionContainer from './containers/CreatePossessionContainer.jsx';
import UpdatePossessionContainer from './containers/UpdatePossessionContainer.jsx';

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/patrimoine" element={<PatrimoineContainer />} />

				<Route path="/possession" element={<PossessionContainer />} />

				<Route path="/possession/create" element={<CreatePossessionContainer />} />

				<Route path="/possession/edit/:libelle" element={<UpdatePossessionContainer />} />

			</Routes>
		</Router>
	);
};

export default App;
