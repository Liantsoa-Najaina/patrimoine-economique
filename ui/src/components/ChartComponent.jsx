import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title } from 'chart.js';
import { Form, Button, Row, Col } from 'react-bootstrap';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title);

const ChartComponent = ({ chartData, onDateChange, onValidate }) => {
	return (
		<div>
			<Form onSubmit={onValidate}>
				<Row className="mb-3">
					<Col>
						<Form.Group>
							<Form.Label>Date Début</Form.Label>
							<Form.Control
								type="date"
								name="dateDebut"
								onChange={onDateChange}
								required
							/>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Date Fin</Form.Label>
							<Form.Control
								type="date"
								name="dateFin"
								onChange={onDateChange}
								required
							/>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Jour</Form.Label>
							<Form.Control
								type="number"
								name="jour"
								min="1"
								max="31"
								onChange={onDateChange}
								required
							/>
						</Form.Group>
					</Col>
				</Row>
				<Button variant="primary" type="submit">Valider</Button>
			</Form>
			<Line data={chartData} />
		</div>
	);
};

export default ChartComponent;
