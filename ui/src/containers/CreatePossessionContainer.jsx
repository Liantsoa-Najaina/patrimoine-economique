import React from 'react';
import CreatePossessionForm from "../components/CreatePossessionForm.jsx";
import { useNavigate } from 'react-router-dom';

const CreatePossessionContainer = ({ onCreatePossession }) => {
	const navigate = useNavigate();

	const handleSubmit = (newPossession) => {
		onCreatePossession(newPossession);
		navigate('/possession');
	};

	return (
		<div>
			<h2>Créer une Nouvelle Possession</h2>
			<CreatePossessionForm onSubmit={handleSubmit} />
		</div>
	);
};

export default CreatePossessionContainer;
