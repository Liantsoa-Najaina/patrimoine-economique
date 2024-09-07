import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const UpdatePossessionForm = ({ possession, onChange, onSubmit, error }) => {
	return (
		<Container>
			<h2>Update Possession</h2>
			{error && <p className="text-danger">{error}</p>}
			<Form onSubmit={onSubmit}>
				<Form.Group controlId="formLibelle">
					<Form.Label>Libellé</Form.Label>
					<Form.Control
						type="text"
						name="newLibelle"
						value={possession.newLibelle}
						onChange={onChange}
						placeholder="Enter new libellé"
						required
					/>
				</Form.Group>
				<Form.Group controlId="formDateFin">
					<Form.Label>Date Fin</Form.Label>
					<Form.Control
						type="date"
						name="dateFin"
						value={possession.dateFin}
						onChange={onChange}
						placeholder="Select date fin"
					/>
				</Form.Group>
				<Button variant="primary" type="submit">Update</Button>
			</Form>
		</Container>
	);
};

export default UpdatePossessionForm;
