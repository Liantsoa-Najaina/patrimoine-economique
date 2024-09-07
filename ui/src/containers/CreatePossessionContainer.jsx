import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreatePossessionForm from '../components/CreatePossessionForm';

const CreatePossessionContainer = () => {
	const [formState, setFormState] = useState({
		libelle: '',
		valeur: '',
		dateDebut: '',
		tauxAmortissement: ''
	});
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post('/possession/create', formState);
			navigate('/possession'); // Redirect to the list page after creation
		} catch (err) {
			setError('Error creating possession.');
		}
	};

	return (
		<CreatePossessionForm
			formState={formState}
			onChange={handleChange}
			onSubmit={handleSubmit}
			error={error}
		/>
	);
};

export default CreatePossessionContainer;
