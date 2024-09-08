// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "../components/DatePicker";
import LineChart from "../components/LineChart";

const PatrimoinePage = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [chartData, setChartData] = useState([]);
	const [timeUnit, setTimeUnit] = useState("jour");
	const [specificDate, setSpecificDate] = useState(new Date());
	const [patrimoineValeur, setPatrimoineValeur] = useState(null);

	const fetchData = async () => {
		try {
			const response = await fetch(
				"http://localhost:3000/patrimoine/range",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						type: timeUnit,
						dateDebut: startDate.toISOString().split("T")[0],
						dateFin: endDate.toISOString().split("T")[0],
					}),
				}
			);
			const data = await response.json();
			setChartData(data.valeur);
		} catch (error) {
			console.error("Erreur lors de la récupération des données:", error);
		}
	};

	const fetchPatrimoineValeur = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/patrimoine/${
					specificDate.toISOString().split("T")[0]
				}`
			);
			const data = await response.json();
			setPatrimoineValeur(data.valeur);
		} catch (error) {
			console.error(
				"Erreur lors de la récupération de la valeur du patrimoine:",
				error
			);
		}
	};

	return (
		<Container className="mb-5">
			<h1 className="my-5 fw-normal text-secondary">Patrimony</h1>
			<Row className="mb-3">
				<Col>
					<label className="fs-5 fw-bold">Start date :</label>
					<DatePicker selectedDate={startDate} onDateChange={setStartDate} />
				</Col>
				<Col>
					<label className="fs-5 fw-bold">End date :</label>
					<DatePicker selectedDate={endDate} onDateChange={setEndDate} />
				</Col>
				<Col>
					<label className="fs-5 fw-bold">Unit of time :</label>
					<Form.Group controlId="timeUnitSelect">
						<Form.Control
							as="select"
							value={timeUnit}
							onChange={(e) => setTimeUnit(e.target.value)}
						>
							<option value="jour">Day</option>
							<option value="mois">Month</option>
							<option value="année">Year</option>
						</Form.Control>
					</Form.Group>
				</Col>
			</Row>
			<Button
				className="fs-5 px-4 bg-light text-success border border-2 border-success"
				onClick={fetchData}
			>
				Validate
			</Button>
			<div className="mt-4">
				<LineChart data={chartData} />
			</div>

			<Row className="mt-4 w-50 mt-5">
				<Col>
					<label className="fs-5 fw-bold">Select a date :</label>
					<DatePicker
						selectedDate={specificDate}
						onDateChange={setSpecificDate}
					/>
				</Col>
				<Col>
					<Button
						className="bg-light border-2 border-success text-success px-4 py-2 me-1 mt-4"
						onClick={fetchPatrimoineValeur}
					>
						Validate
					</Button>
				</Col>
			</Row>

			<div>
        <span className="fs-5">
          Value of the Patrimony on the selected date{" "}
			<span className="fw-bold">=&gt;</span>
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
