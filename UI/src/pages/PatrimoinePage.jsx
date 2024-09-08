// PatrimoinePage.js
import React, { useState } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "../components/DatePicker";
import LineChart from "../components/LineChart";

const PatrimoinePage = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [chartData, setChartData] = useState([]);
	const [selectedDay, setSelectedDay] = useState(1);
	const [specificDate, setSpecificDate] = useState(new Date());
	const [patrimoineValeur, setPatrimoineValeur] = useState(null);

	const fetchData = async () => {
		try {
			const response = await axios.post(
				"http://localhost:3000/patrimoine/range",
				{
					startDate: startDate.toISOString().split("T")[0],
					endDate: endDate.toISOString().split("T")[0],
					jour: selectedDay,
				}
			);
			setChartData(response.data.values);
		} catch (error) {
			console.error("Erreur lors de la récupération des données:", error);
		}
	};

	const fetchPatrimoineValeur = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/patrimoine/${specificDate.toISOString().split("T")[0]}`
			);
			setPatrimoineValeur(response.data.totalValue);
		} catch (error) {
			console.error("Erreur lors de la récupération de la valeur du patrimoine:", error);
		}
	};

	return (
		<Container className="mb-5">
			<h3 className="my-5 fw-normal text-secondary">Statistiques du patrimoine économique</h3>

			<Row>
				<Col xs={12} md={4}>
					<div className="d-flex flex-column">
						<label className="fs-5 fw-bold">Date Début:</label>
						<DatePicker selectedDate={startDate} onDateChange={setStartDate} />

						<label className="fs-5 fw-bold mt-3">Date Fin:</label>
						<DatePicker selectedDate={endDate} onDateChange={setEndDate} />

						<label className="fs-5 fw-bold mt-3">Jour du mois:</label>
						<Form.Control
							type="number"
							min="1"
							max="31"
							value={selectedDay}
							onChange={(e) => setSelectedDay(e.target.value)}
							className="fs-5 px-4 mt-3 btn-sm "
						/>

						<Button
							className="fs-5 px-4 mt-3 btn-sm bg-light text-success border border-2 border-success"
							onClick={fetchData}
						>
							Valider
						</Button>
					</div>
				</Col>

				<Col xs={12} md={8}>
					<div className="mt-4 w-100">
						<LineChart data={chartData} />
					</div>
				</Col>
			</Row>

			<div className="d-flex align-items-center mt-4 w-75 gap-3"> {/* Using flexbox here */}
				<label className="fs-5 fw-bold me-3">Selectionner une date :</label>
				<DatePicker
					selectedDate={specificDate}
					onDateChange={setSpecificDate}
					className="me-3"
				/>
				<Button
					className="bg-light border-2 border-success text-success px-4 py-2"
					onClick={fetchPatrimoineValeur}
				>
					Valider
				</Button>
			</div>


			<div>
        <span className="fs-5">
          Le total de votre patrimoine à cette date est : <span className="fw-bold">=&gt;</span>
        </span>
				{patrimoineValeur !== null && (
					<span className="mt-3">
            <span className="h5 ps-3 text-primary">{patrimoineValeur}</span>
          </span>
				)}
			</div>
		</Container>
	);
};

export default PatrimoinePage;
