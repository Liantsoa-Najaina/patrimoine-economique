// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import Header from './components/Header.jsx';
import Patrimoine from './pages/PatrimoinePage.jsx';
import './App.css'
import './index.css'
import ListPossessionPage from "./pages/ListPossessionPage.jsx";

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/patrimoine" element={<Patrimoine />} />
                <Route path="/possession" element={<ListPossessionPage />} />
            </Routes>
        </Router>
    );
};

export default App;
