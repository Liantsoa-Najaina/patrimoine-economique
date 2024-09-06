import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PossessionTable from "../components/PossessionTable.jsx";

const PossessionContainer = () => {
	const [possessions, setPossessions] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get('/possession'); //
				setPossessions(response.data);
			} catch (err) {
				setError(err.message);
			}
		};

		fetchData();
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<h2>Liste des Possessions</h2>
			<PossessionTable possessions={possessions} />
		</div>
	);
};

export default PossessionContainer;
