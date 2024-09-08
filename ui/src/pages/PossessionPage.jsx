import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Table, Alert, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Possession from "../../../models/possessions/Possession";
import Flux from "../../../models/possessions/Flux";

const PossessionPage = () => {
	const [possessions, setPossessions] = useState([]);
	const [error, setError] = useState("");
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [selectedPossession, setSelectedPossession] = useState({
		libelle: "",
		dateFin: null,
	});

	const [newLibelle, setNewLibelle] = useState("");
	const [dateFin, setDateFin] = useState(null);
	const [newValeur, setNewValeur] = useState("");
	const [newDateDebut, setNewDateDebut] = useState("");
	const [newTaux, setNewTaux] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		fetchPossessions();
	}, []);

	const fetchPossessions = async () => {
		try {
			const response = await axios.get("http://localhost:3000/possession");
			const data = response.data;

			const currentDate = new Date();
			const updatedPossessions = data.map((possessionData) => {
				let possession;
				if (possessionData.jour) {
					possession = new Flux(
						possessionData.possesseur,
						possessionData.libelle,
						possessionData.valeurConstante,
						new Date(possessionData.dateDebut),
						possessionData.dateFin ? new Date(possessionData.dateFin) : null,
						possessionData.tauxAmortissement,
						possessionData.jour
					);
				} else {
					possession = new Possession(
						possessionData.possesseur,
						possessionData.libelle,
						possessionData.valeur,
						new Date(possessionData.dateDebut),
						possessionData.dateFin ? new Date(possessionData.dateFin) : null,
						possessionData.tauxAmortissement
					);
				}

				let valeurActuelle;
				if (possessionData.dateFin && new Date(possessionData.dateFin) < currentDate) {
					valeurActuelle = 0;
				} else {
					valeurActuelle = possession.getValeur(currentDate).toFixed(2) || "-";
				}

				return {
					...possessionData,
					valeurActuelle,
				};
			});
			setPossessions(updatedPossessions);
		} catch (error) {
			setError("Erreur lors de la récupération des possessions: " + error.message);
		}
	};

	const handleShowUpdateModal = (possession) => {
		setSelectedPossession(possession);
		setNewLibelle(possession.libelle);
		setDateFin(possession.dateFin ? new Date(possession.dateFin) : null);
		setShowUpdateModal(true);
	};

	const handleCloseUpdateModal = () => {
		setShowUpdateModal(false);
	};

	const handleShowCreateModal = () => {
		setShowCreateModal(true);
	};

	const handleCloseCreateModal = () => {
		setShowCreateModal(false);
	};

	const handleCreate = async (e) => {
		e.preventDefault();
		try {
			const newPossession = {
				libelle: newLibelle,
				valeur: newValeur,
				dateDebut: newDateDebut,
				tauxAmortissement: newTaux,
			};

			await axios.post("http://localhost:3000/possession/create", newPossession);
			setShowCreateModal(false);
			window.location.reload();
		} catch (error) {
			setError("Erreur lors de la création de la possession: " + error.message);
		}
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		try {
			const updatedPossession = {
				newLibelle,
				dateFin: dateFin ? dateFin.toISOString() : null,
			};

			await axios.put(`http://localhost:3000/possession/${selectedPossession.libelle}/update`, updatedPossession);
			setShowUpdateModal(false);
			window.location.reload();
		} catch (error) {
			setError("Erreur lors de la mise à jour de la possession: " + error.message);
		}
	};

	const handleClose = async (libelle) => {
		try {
			const response = await axios.put(`http://localhost:3000/possession/${libelle}/close`);
			if (response.status === 200) {
				fetchPossessions(); // Fetch the updated possessions list
			} else {
				console.error("Erreur lors de la fermeture de la possession.");
			}
		} catch (error) {
			console.error("Erreur lors de la fermeture de la possession:", error);
		}
	};

	return (
		<Container>
			<h3 className="fw-normal text-secondary mt-5 text-center">Liste des Possessions</h3>
			<Button
				className="mt-3 btn-lg px-2 bg-light text-info border border-2 border-info"
				onClick={handleShowCreateModal}
			>
				Nouvelle Possession
			</Button>

			{error && <Alert variant="danger">{error}</Alert>}

			<Table className="table table-hover my-5 mx-0 text-left table-striped" responsive={true}>
				<thead className="fs-5 border-bottom border-secondary">
				<tr>
					<th>Label</th>
					<th className="text-center">Valeur</th>
					<th className="text-center">Date Début</th>
					<th className="text-center">Date Fin</th>
					<th className="text-center">Amortissement</th>
					<th className="text-center">Valeur Actuelle</th>
					<th className="text-center">Actions</th>
				</tr>
				</thead>
				<tbody className="fw-normal">
				{possessions.map((possession) => (
					<tr key={possession.libelle}>
						<td className="pt-4">{possession.libelle || "-"}</td>
						<td className="text-center pt-4">{possession.valeur || "-"}</td>
						<td className="text-center pt-4">
							{possession.dateDebut
								? new Date(possession.dateDebut).toLocaleDateString()
								: "-"}
						</td>
						<td className="text-center pt-4">
							{possession.dateFin
								? new Date(possession.dateFin).toLocaleDateString()
								: "-"}
						</td>
						<td className="text-center pt-4">{possession.tauxAmortissement || "-"}</td>
						<td className="text-center pt-4">{possession.valeurActuelle || "-"}</td>
						<td className="text-center pt-4">
							<Button
								className="me-2"
								onClick={() => handleShowUpdateModal(possession)}
							>
								Modifier
							</Button>
							<Button
								variant="danger"
								onClick={() => handleClose(possession.libelle)}
							>
								Clôturer
							</Button>
						</td>
					</tr>
				))}
				</tbody>
			</Table>

			{/* Misa a jour d'une possession */}
			<Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
				<Modal.Header closeButton>
					<Modal.Title>Update Possession</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleUpdate}>
						<Form.Group className="mb-3">
							<Form.Label>Label</Form.Label>
							<Form.Control
								type="text"
								placeholder="Label"
								value={newLibelle}
								onChange={(e) => setNewLibelle(e.target.value)}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Date Fin</Form.Label>
							<Form.Control
								type="date"
								value={
									dateFin ? new Date(dateFin).toISOString().substring(0, 10) : ""
								}
								onChange={(e) => setDateFin(new Date(e.target.value))}
							/>
						</Form.Group>
						<Button variant="primary" type="submit">
							Save Changes
						</Button>
					</Form>
				</Modal.Body>
			</Modal>

			{/* Creation d'une nouvelle possession */}
			<Modal show={showCreateModal} onHide={handleCloseCreateModal}>
				<Modal.Header closeButton>
					<Modal.Title>Create New Possession</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleCreate}>
						<Form.Group className="mb-3">
							<Form.Label>Label</Form.Label>
							<Form.Control
								type="text"
								placeholder="Label"
								value={newLibelle}
								onChange={(e) => setNewLibelle(e.target.value)}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Valeur</Form.Label>
							<Form.Control
								type="number"
								placeholder="Valeur"
								value={newValeur}
								onChange={(e) => setNewValeur(e.target.value)}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Date Début</Form.Label>
							<Form.Control
								type="date"
								value={newDateDebut}
								onChange={(e) => setNewDateDebut(e.target.value)}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Taux Amortissement</Form.Label>
							<Form.Control
								type="number"
								placeholder="Taux"
								value={newTaux}
								onChange={(e) => setNewTaux(e.target.value)}
							/>
						</Form.Group>
						<Button variant="primary" type="submit">
							Save
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</Container>
	);
};

export default PossessionPage;
