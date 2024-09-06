import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const PossessionCreationForm = ({ onCreatePossession }) => {
	const [formState, setFormState] = useState({
		libelle: '',
		valeur: '',
		dateDebut: '',
		tauxAmortissement: ''
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onCreatePossession(formState); // Call parent function to create possession
		setFormState({ libelle: '', valeur: '', dateDebut: '', tauxAmortissement: '' }); // Reset form
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group>
				<Form.Label>Libellé</Form.Label>
				<Form.Control
					type="text"
					name="libelle"
					value={formState.libelle}
					onChange={handleChange}
					required
				/>
			</Form.Group>

			<Form.Group>
				<Form.Label>Valeur</Form.Label>
				<Form.Control
					type="number"
					name="valeur"
					value={formState.valeur}
					onChange={handleChange}
					required
				/>
			</Form.Group>

			<Form.Group>
				<Form.Label>Date Début</Form.Label>
				<Form.Control
					type="date"
					name="dateDebut"
					value={formState.dateDebut}
					onChange={handleChange}
					required
				/>
			</Form.Group>

			<Form.Group>
				<Form.Label>Amortissement</Form.Label>
				<Form.Control
					type="number"
					name="tauxAmortissement"
					value={formState.tauxAmortissement}
					onChange={handleChange}
					required
				/>
			</Form.Group>

			<Button variant="primary" type="submit">Ajouter</Button>
		</Form>
	);
};

export default PossessionCreationForm;
