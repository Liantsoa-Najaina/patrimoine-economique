import React, { useState } from "react";
import { Container, Button, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateNewPossession = () => {
	const [libelle, setLibelle] = useState("");
	const [valeur, setValeur] = useState("0");
	const [dateDebut, setDateDebut] = useState(new Date());
	const [tauxAmortissement, setTauxAmortissement] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!libelle || isNaN(parseInt(valeur)) || isNaN(parseInt(tauxAmortissement))) {
			setError("Please fill out all fields correctly.");
			return;
		}

		const formattedValeur = parseInt(valeur, 10);
		const formattedTauxAmortissement = tauxAmortissement
			? parseInt(tauxAmortissement, 10)
			: null;

		const newPossession = {
			possesseur: {
				nom: "John Doe", // Adjust as needed
			},
			libelle,
			valeur: formattedValeur,
			dateDebut: dateDebut.toISOString(),
			tauxAmortissement: formattedTauxAmortissement,
		};

		try {
			const response = await axios.post("http://localhost:3000/possession/create", newPossession, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status === 201) {
				navigate("/possession", { state: { newPossession } });
			} else {
				setError(`Erreur lors de la création de la possession: ${response.data}`);
			}
		} catch (error) {
			setError(`Erreur lors de la création de la possession: ${error.response?.data || error.message}`);
		}
	};

	return (
		<Container className="">
			<h1 className="fw-normal text-secondary mt-5 mb-5">Create New Possession</h1>
			{error && <Alert variant="danger">{error}</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="libelle">
					<Form.Label className="fs-5 fw-bold">Label</Form.Label>
					<Form.Control
						type="text"
						value={libelle}
						onChange={(e) => setLibelle(e.target.value)}
						required
						className="w-50"
					/>
				</Form.Group>

				<Form.Group controlId="valeur">
					<Form.Label className="fs-5 fw-bold">Value</Form.Label>
					<Form.Control
						type="number"
						value={valeur}
						onChange={(e) => setValeur(e.target.value)}
						required
						className="w-50"
					/>
				</Form.Group>

				<label className="fs-5 fw-bold">Start date</label>
				<Form.Group controlId="dateDebut">
					<DatePicker
						selected={dateDebut}
						onChange={(date) => setDateDebut(date)}
						className="form-control"
						dateFormat="yyyy-MM-dd"
					/>
				</Form.Group>

				<Form.Group controlId="tauxAmortissement">
					<Form.Label className="fs-5 fw-bold">Depreciation rate</Form.Label>
					<Form.Control
						type="number"
						value={tauxAmortissement}
						onChange={(e) => setTauxAmortissement(e.target.value)}
						className="w-50"
					/>
				</Form.Group>

				<Button
					className="mt-4 fs-5 px-4 bg-light text-info border border-2 border-info"
					type="submit"
				>
					Ajouter
				</Button>
			</Form>
		</Container>
	);
};

export default CreateNewPossession;