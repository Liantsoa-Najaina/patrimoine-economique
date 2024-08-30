// eslint-disable-next-line no-unused-vars
import React from 'react';
import {useState} from "react";
import { Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';

const PatrimoinePage = () => {
    const [dateDebut, setDateDebut] = useState(new Date());
    const [dateFin, setDateFin] = useState(new Date());
    const [selectedJour, setSelectedJour] = useState(1);
    const [patrimoineData, setPatrimoineData] = useState([]);
    const [singleDate, setSingleDate] = useState(new Date());
    const [singleDateValue, setSingleDateValue] = useState(null);

    const handleValidateRange = async () => {
        // Fetch Patrimoine by Range using API
        const response = await fetch('http://localhost:3000/patrimoine/range', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'month',
                startDate: dateDebut.toISOString().split('T')[0],
                endDate: dateFin.toISOString().split('T')[0],
                jour: selectedJour,
            }),
        });

        const data = await response.json();
        setPatrimoineData(data.patrimoineOverRange);
    };

    const handleValidateSingleDate = async () => {
        // Fetch Patrimoine value at single date using API
        const response = await fetch(`http://localhost:3000/patrimoine/${singleDate.toISOString().split('T')[0]}`);
        const data = await response.json();
        setSingleDateValue(data.totalValue);
    };

    return (
        <div>
            <h2>Patrimoine</h2>
            <Form>
                <Row>
                    <Col>
                        <Form.Group controlId="formDateDebut">
                            <Form.Label>Date Début</Form.Label>
                            <DatePicker selected={dateDebut} onChange={setDateDebut} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formDateFin">
                            <Form.Label>Date Fin</Form.Label>
                            <DatePicker selected={dateFin} onChange={setDateFin} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formJour">
                            <Form.Label>Jour</Form.Label>
                            <Form.Control as="select" value={selectedJour} onChange={(e) => setSelectedJour(Number(e.target.value))}>
                                {[...Array(31).keys()].map((n) => (
                                    <option key={n + 1} value={n + 1}>{n + 1}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Button onClick={handleValidateRange}>Validate</Button>
            </Form>
            <div>
                {patrimoineData.length > 0 && (
                    <Line
                        data={{
                            labels: patrimoineData.map((item) => item.date.split('T')[0]),
                            datasets: [
                                {
                                    label: 'Valeur Patrimoine',
                                    data: patrimoineData.map((item) => item.totalValue),
                                    fill: false,
                                    backgroundColor: 'rgb(75, 192, 192)',
                                    borderColor: 'rgba(75, 192, 192, 0.2)',
                                },
                            ],
                        }}
                    />
                )}
            </div>
            <Form>
                <Form.Group controlId="formSingleDate">
                    <Form.Label>Date</Form.Label>
                    <DatePicker selected={singleDate} onChange={setSingleDate} />
                </Form.Group>
                <Button onClick={handleValidateSingleDate}>Validate</Button>
            </Form>
            {singleDateValue !== null && <div>Valeur Patrimoine: {singleDateValue}</div>}
        </div>
    );
};

export default PatrimoinePage;
