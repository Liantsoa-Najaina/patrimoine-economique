// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const CreateNewPossession = () => {
	const [libelle, setLibelle] = useState("");
	const [valeur, setValeur] = useState("0");
	const [dateDebut, setDateDebut] = useState(new Date());
	const [tauxAmortissement, setTauxAmortissement] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		const formattedValeur = parseInt(valeur, 10);
		const formattedTauxAmortissement = tauxAmortissement
			? parseInt(tauxAmortissement, 10)
			: null;

		const newPossession = {
			possesseur: {
				nom: "John Doe",
			},
			libelle,
			valeur: formattedValeur,
			dateDebut: dateDebut.toISOString(),
			tauxAmortissement: formattedTauxAmortissement,
		};

		fetch("http://localhost:3000/possession/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newPossession),
		})
			.then((response) => {
				if (response.ok) {
					navigate("/possession");
				} else {
					console.error("Erreur lors de la création de la possession");
				}
			})
			.catch((error) =>
				console.error("Erreur lors de la création de la possession:", error)
			);
	};

	return (
		<Container className="">
			<h1 className="fw-normal text-secondary mt-5 mb-5">
				Create New Possession
			</h1>
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
					Create
				</Button>
			</Form>
		</Container>
	);
};

export default CreateNewPossession;
