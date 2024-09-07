import React, { useEffect, useState } from 'react';
import UpdatePossessionForm from "../components/UpdatePossessionForm.jsx";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdatePossessionContainer = () => {
	const { libelle } = useParams();
	const [possession, setPossession] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPossession = async () => {
			try {
				const response = await axios.get(`/possession/${libelle}`);
				setPossession(response.data);
			} catch (err) {
				setError(err.message);
			}
		};
		fetchPossession();
	}, [libelle]);

	const handleUpdate = async (updatedPossession) => {
		try {
			await axios.put(`/possession/${libelle}/update`, updatedPossession);
			navigate('/possession');
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div>
			<h2>Éditer la Possession</h2>
			{possession ? (
				<UpdatePossessionForm possession={possession} onUpdate={handleUpdate} />
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default UpdatePossessionContainer;
