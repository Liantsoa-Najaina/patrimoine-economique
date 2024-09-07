import React from 'react';
import { Button, Table } from 'react-bootstrap';

const PossessionTable = ({ possessions, onClose, onUpdate }) => {
	const handleEdit = (possession) => {
		// Implement edit functionality here
	};

	const handleSave = (possession) => {
		// Implement save functionality here
	};

	return (
		<Table striped bordered hover>
			<thead>
			<tr>
				<th>Libellé</th>
				<th>Valeur</th>
				<th>Date Début</th>
				<th>Date Fin</th>
				<th>Amortissement</th>
				<th>Valeur Actuelle</th>
				<th>Actions</th>
			</tr>
			</thead>
			<tbody>
			{possessions.map((possession) => (
				<tr key={possession.libelle}>
					<td>{possession.libelle}</td>
					<td>{possession.valeur}</td>
					<td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
					<td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'Active'}</td>
					<td>{possession.tauxAmortissement}%</td>
					<td>{possession.getValeur(new Date())}</td>
					<td>
						<Button variant="info" onClick={() => handleEdit(possession)}>
							Edit
						</Button>
						<Button variant="danger" onClick={() => onClose(possession.libelle)}>
							Close
						</Button>
					</td>
				</tr>
			))}
			</tbody>
		</Table>
	);
};

export default PossessionTable;
