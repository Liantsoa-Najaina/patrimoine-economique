import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const CreatePossessionForm = ({ formState, onChange, onSubmit, error }) => {
	return (
		<Container>
			<h2>Create New Possession</h2>
			{error && <p className="text-danger">{error}</p>}
			<Form onSubmit={onSubmit}>
				<Form.Group controlId="formLibelle">
					<Form.Label>Libellé</Form.Label>
					<Form.Control
						type="text"
						name="libelle"
						value={formState.libelle}
						onChange={onChange}
						placeholder="Enter libellé"
						required
					/>
				</Form.Group>
				<Form.Group controlId="formValeur">
					<Form.Label>Valeur</Form.Label>
					<Form.Control
						type="number"
						name="valeur"
						value={formState.valeur}
						onChange={onChange}
						placeholder="Enter valeur"
						required
					/>
				</Form.Group>
				<Form.Group controlId="formDateDebut">
					<Form.Label>Date Début</Form.Label>
					<Form.Control
						type="date"
						name="dateDebut"
						value={formState.dateDebut}
						onChange={onChange}
						required
					/>
				</Form.Group>
				<Form.Group controlId="formTauxAmortissement">
					<Form.Label>Amortissement</Form.Label>
					<Form.Control
						type="number"
						name="tauxAmortissement"
						value={formState.tauxAmortissement}
						onChange={onChange}
						required
					/>
				</Form.Group>
				<Button variant="primary" type="submit">Add Possession</Button>
			</Form>
		</Container>
	);
};

export default CreatePossessionForm;
