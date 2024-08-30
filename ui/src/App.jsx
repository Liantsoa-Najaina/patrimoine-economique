// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import Header from './components/Header.jsx';
import Patrimoine from './pages/PatrimoinePage.jsx';
// import ListPossession from './pages/ListPossession';
import './App.css'
import './index.css'

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>  {/* Replace Switch with Routes */}
                <Route path="/patrimoine" element={<Patrimoine />} /> {/* Update component to element with JSX */}
                {/*<Route path="/possession" element={<ListPossession />} /> /!* Update component to element with JSX *!/*/}
                {/* Add routes for other pages as needed */}
            </Routes>
        </Router>
    );
};

export default App;
