import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PossessionTable from "../components/PossessionTable.jsx";
import PossessionCreationForm from "../components/PossessionCreationForm.jsx";

const PossessionContainer = () => {
	const [possessions, setPossessions] = useState([]);
	const [error, setError] = useState(null);

	const fetchPossessions = async () => {
		try {
			const response = await axios.get('/possession');
			setPossessions(response.data);
		} catch (err) {
			setError(err.message);
		}
	};

	useEffect(() => {
		fetchPossessions();
	}, []);

	const handleCreatePossession = async (newPossession) => {
		try {
			await axios.post('/possession/create', newPossession);
			await fetchPossessions();
		} catch (err) {
			setError(err.message);
		}
	};

	const handleUpdatePossession = async (updatedPossession) => {
		try {
			await axios.put(`/possession/${updatedPossession.libelle}/update`, updatedPossession);
			await fetchPossessions();
		} catch (err) {
			setError(err.message);
		}
	};

	const handleClosePossession = async (libelle) => {
		try {
			await axios.put(`/possession/${libelle}/close`);
			await fetchPossessions();
		} catch (err) {
			setError(err.message);
		}
	};


	return (
		<div>
			<h2>Liste des Possessions</h2>
			<PossessionCreationForm onCreatePossession={handleCreatePossession} />
			<PossessionTable possessions={possessions} onClose={handleClosePossession} onUpdate={handleUpdatePossession}/>
		</div>
	);
};

export default PossessionContainer;
