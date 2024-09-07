import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import UpdatePossessionForm from '../components/UpdatePossessionForm';

const UpdatePossessionContainer = () => {
	const { libelle } = useParams();
	const navigate = useNavigate();

	const [possession, setPossession] = useState({
		libelle: '',
		newLibelle: '',
		dateFin: ''
	});
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPossession = async () => {
			try {
				const response = await axios.get(`/possession/${libelle}`);
				setPossession({
					...possession,
					libelle: response.data.libelle,
					newLibelle: response.data.newLibelle || '',
					dateFin: response.data.dateFin ? new Date(response.data.dateFin).toISOString().split('T')[0] : ''
				});
			} catch (err) {
				setError('Error fetching possession details.');
			}
		};

		fetchPossession();
	}, [libelle]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPossession(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`/possession/${libelle}/update`, {
				newLibelle: possession.newLibelle,
				dateFin: possession.dateFin
			});
			navigate('/possession'); // Redirect to the list page after update
		} catch (err) {
			setError('Error updating possession.');
		}
	};

	return (
		<UpdatePossessionForm
			possession={possession}
			onChange={handleChange}
			onSubmit={handleSubmit}
			error={error}
		/>
	);
};

export default UpdatePossessionContainer;
