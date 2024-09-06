import {Button, Table} from "react-bootstrap";
import {useState} from "react";

const PossessionTable = ({ possessions, onClose, onUpdate }) => {
	const [editablePossession, setEditablePossession] = useState(null);
	const [updatedData, setUpdatedData] = useState({});

	const handleEdit = (possession) => {
		setEditablePossession(possession);
		setUpdatedData(possession);
	};

	const handleSave = () => {
		onUpdate(editablePossession.libelle, updatedData);
		setEditablePossession(null);
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
				<th>Actions</th>
			</tr>
			</thead>
			<tbody>
			{possessions.map((possession) => (
				<tr key={possession.libelle}>
					<td>
						{editablePossession?.libelle === possession.libelle ? (
							<input
								type="text"
								value={updatedData.libelle || ''}
								onChange={(e) => setUpdatedData({ ...updatedData, libelle: e.target.value })}
							/>
						) : possession.libelle}
					</td>
					<td>
						{editablePossession?.libelle === possession.libelle ? (
							<input
								type="number"
								value={updatedData.valeur || ''}
								onChange={(e) => setUpdatedData({ ...updatedData, valeur: e.target.value })}
							/>
						) : possession.valeur}
					</td>
					<td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
					<td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'Active'}</td>
					<td>{possession.tauxAmortissement}%</td>
					<td>
						{!editablePossession || editablePossession.libelle !== possession.libelle ? (
							<Button variant="primary" onClick={() => handleEdit(possession)}>
								Edit
							</Button>
						) : (
							<Button variant="success" onClick={handleSave}>
								Save
							</Button>
						)}
					</td>
				</tr>
			))}
			</tbody>
		</Table>
	);
};

export default PossessionTable;
