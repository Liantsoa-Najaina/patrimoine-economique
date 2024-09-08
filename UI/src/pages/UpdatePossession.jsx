// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePossession = () => {
	const { libelle } = useParams();
	const navigate = useNavigate();

	const [possession, setPossession] = useState({
		libelle: libelle,
		dateFin: null,
	});

	const handleChange = (e) => {
		setPossession({ ...possession, [e.target.name]: e.target.value });
	};

	const handleDateChange = (date) => {
		setPossession({ ...possession, dateFin: date });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const updatedPossession = {
			...possession,
			dateFin: possession.dateFin ? possession.dateFin.toISOString() : null,
		};

		fetch(
			`http://localhost:3000/possession/${libelle}/update`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedPossession),
			}
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Erreur lors de la mise à jour de la possession.");
				}
				return response.json();
			})
			.then((data) => {
				console.log("Mise à jour réussie:", data);
				navigate("/possession");
			})
			.catch((error) => {
				console.error("Erreur:", error);
			});
	};

	const handleFocus = (e) => {
		e.target.select();
	};

	return (
		<Container>
			<h1 className="fw-normal text-secondary mt-5 mb-5">Edit Possession</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="formLibelle">
					<Form.Label className="fs-5 fw-bold">Label</Form.Label>
					<Form.Control
						type="text"
						name="libelle"
						value={possession.libelle}
						onChange={handleChange}
						onFocus={handleFocus}
						placeholder="Entrez le libellé"
						className="w-50"
					/>
				</Form.Group>

				<label className="fs-5 fw-bold">End date</label>
				<Form.Group controlId="formDateFin">
					<DatePicker
						selected={possession.dateFin}
						onChange={handleDateChange}
						dateFormat="yyyy-MM-dd"
						className="form-control"
						placeholderText="Select a date"
						isClearable
					/>
				</Form.Group>

				<Button
					className="mt-4 fs-5 px-4 bg-light text-warning border border-2 border-warning"
					type="submit"
				>
					Update
				</Button>
			</Form>
		</Container>
	);
};

export default UpdatePossession;
