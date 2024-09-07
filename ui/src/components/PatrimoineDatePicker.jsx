import React from 'react';
import { Form, Button } from 'react-bootstrap';

const PatrimoineDatePicker = ({ onDateChange, onValidate }) => {
	return (
		<Form onSubmit={onValidate}>
			<Form.Group>
				<Form.Label>Date</Form.Label>
				<Form.Control
					type="date"
					name="date"
					onChange={onDateChange}
					required
				/>
			</Form.Group>
			<Button variant="primary" type="submit">Valider</Button>
		</Form>
	);
};

export default PatrimoineDatePicker;