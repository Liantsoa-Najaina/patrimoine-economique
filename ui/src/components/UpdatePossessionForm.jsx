import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const UpdatePossessionForm = ({ possession, onUpdate }) => {
	const [libelle, setLibelle] = useState(possession.libelle);
	const [valeur, setValeur] = useState(possession.valeur);
	const [dateFin, setDateFin] = useState(possession.dateFin || '');
	const [taux, setTaux] = useState(possession.tauxAmortissement);

	const handleSubmit = (e) => {
		e.preventDefault();
		onUpdate({libelle, valeur, dateFin, tauxAmortissement: taux});
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
			<Form.Group controlId="formDateFin">
				<Form.Label>Date Fin</Form.Label>
				<Form.Control
					type="date"
					value={dateFin}
					onChange={(e) => setDateFin(e.target.value)}
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
				Enregistrer
			</Button>
		</Form>
	);
}

export default UpdatePossessionForm;
