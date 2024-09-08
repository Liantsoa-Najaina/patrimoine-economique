import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Possession from "../../../models/possessions/Possession";
import Flux from "../../../models/possessions/Flux";

const PossessionPage = () => {
	const [possessions, setPossessions] = useState([]);
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

				return {
					...possessionData,
					valeurActuelle: possession.getValeur(currentDate) || "-",
				};
			});
			setPossessions(updatedPossessions);
		} catch (error) {
			console.error("Erreur lors de la récupération des possessions:", error);
		}
	};

	const handleCreate = () => {
		navigate("/create");
	};

	const handleEdit = (libelle) => {
		navigate(`/edit/${libelle}`);
	};

	const handleClose = async (libelle) => {
		try {
			const response = await axios.post(`http://localhost:3000/possession/${libelle}/close`);
			if (response.status === 200) {
				fetchPossessions();
			} else {
				console.error("Erreur lors de la fermeture de la possession.");
			}
		} catch (error) {
			console.error("Erreur lors de la fermeture de la possession:", error);
		}
	};

	return (
		<Container>
			<h3 className="fw-normal text-secondary mt-5">Liste des Possessions</h3>
			<Button
				className="mt-4 fs-5 px-4 bg-light text-info border border-2 border-info"
				onClick={handleCreate}
			>
				Create
			</Button>
			<Table className="table table-hover my-5 text-left">
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
						<td className="text-center pt-4">
							{possession.tauxAmortissement || "-"}
						</td>
						<td className="text-center pt-4">
							{possession.valeurActuelle.toFixed(2) || "-"}
						</td>
						<td className="text-center">
							<Button
								className="bg-light border-1 border-secondary text-secondary px-4 py-2 me-1 my-2"
								onClick={() => handleEdit(possession.libelle)}
							>
								Edit
							</Button>
							<Button
								className="bg-light border-1 border-danger text-danger px-3 py-2 ms-1 my-2"
								onClick={() => handleClose(possession.libelle)}
							>
								Close
							</Button>
						</td>
					</tr>
				))}
				</tbody>
			</Table>
		</Container>
	);
};

export default PossessionPage;
