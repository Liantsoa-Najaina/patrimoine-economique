import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const CreatePossessionForm = ({ onSubmit }) => {
	const [libelle, setLibelle] = useState('');
	const [valeur, setValeur] = useState('');
	const [dateDebut, setDateDebut] = useState('');
	const [taux, setTaux] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ libelle, valeur, dateDebut, tauxAmortissement: taux });
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group controlId="formLibelle">
				<Form.Label>Libellé</Form.Label>
				<Form.Control
					type="text"
					placeholder="Enter libellé"
					value={libelle}
					onChange={(e) => setLibelle(e.target.value)}
					required
				/>
			</Form.Group>
			<Form.Group controlId="formValeur">
				<Form.Label>Valeur</Form.Label>
				<Form.Control
					type="number"
					placeholder="Enter valeur"
					value={valeur}
					onChange={(e) => setValeur(e.target.value)}
					required
				/>
			</Form.Group>
			<Form.Group controlId="formDateDebut">
				<Form.Label>Date Début</Form.Label>
				<Form.Control
					type="date"
					value={dateDebut}
					onChange={(e) => setDateDebut(e.target.value)}
					required
				/>
			</Form.Group>
			<Form.Group controlId="formTaux">
				<Form.Label>Taux</Form.Label>
				<Form.Control
					type="number"
					placeholder="Enter taux"
					value={taux}
					onChange={(e) => setTaux(e.target.value)}
					required
				/>
			</Form.Group>
			<Button variant="primary" type="submit">
				Créer
			</Button>
		</Form>
	);
};

export default CreatePossessionForm;
