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
			fetchPossessions();
		} catch (err) {
			setError(err.message);
		}
	};

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<h2>Liste des Possessions</h2>
			<PossessionCreationForm onCreatePossession={handleCreatePossession} />
			<PossessionTable possessions={possessions} />
		</div>
	);
};

export default PossessionContainer;
