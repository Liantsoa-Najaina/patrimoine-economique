import React from 'react';
import { Table } from 'react-bootstrap';

const PossessionTable = ({ possessions }) => {
	return (
		<Table striped bordered hover>
			<thead>
			<tr>
				<th>Libellé</th>
				<th>Valeur</th>
				<th>Date Début</th>
				<th>Date Fin</th>
				<th>Amortissement</th>
			</tr>
			</thead>
			<tbody>
			{possessions.map((possession, index) => (
				<tr key={index}>
					<td>{possession.libelle}</td>
					<td>{possession.valeur}</td>
					<td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
					<td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : '-'}</td>
					<td>{possession.tauxAmortissement}%</td>
				</tr>
			))}
			</tbody>
		</Table>
	);
};

export default PossessionTable;
