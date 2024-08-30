// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Alert } from 'react-bootstrap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const Patrimoine = () => {
    const [dateDebut, setDateDebut] = useState(null);
    const [dateFin, setDateFin] = useState(null);
    const [jour, setJour] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Valeur du Patrimoine',
                data: [],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
        ],
    });
    const [patrimoineValue, setPatrimoineValue] = useState(null);
    const [error, setError] = useState('');

    const handleValidationClick = async () => {
        if (!dateDebut || !dateFin || !jour) {
            console.error('Please provide all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/patrimoine/range', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'month',
                    startDate: dateDebut.toISOString().split('T')[0],
                    endDate: dateFin.toISOString().split('T')[0],
                    jour: parseInt(jour, 10),
                }),
            });

            const result = await response.json();
            console.log('API Response:', result);

            if (response.ok) {
                if (result.patrimoineOverRange && Array.isArray(result.patrimoineOverRange)) {
                    updateChart(result.patrimoineOverRange);
                } else {
                    console.error('Expected patrimoineOverRange array but got:', result);
                }
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error fetching patrimoine data:', error);
        }
    };

    const handleDateValidationClick = async () => {
        if (!selectedDate) {
            console.error('Please select a date.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/patrimoine/${selectedDate.toISOString().split('T')[0]}`);

            const result = await response.json();
            console.log('API Response for date:', result);

            if (response.ok) {
                setPatrimoineValue(result.totalValue);
                setError('');
            } else {
                setError(result.message);
                setPatrimoineValue(null);
            }
        } catch (error) {
            console.error('Error fetching patrimoine value:', error);
            setError('Error fetching patrimoine value.');
        }
    };

    const updateChart = (data) => {
        console.log('Updating chart with data:', data);

        if (Array.isArray(data)) {
            const labels = data.map((item) => new Date(item.date).toLocaleDateString());
            const values = data.map((item) => item.totalValue);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Valeur du Patrimoine',
                        data: values,
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75,192,192,0.2)',
                        fill: true,
                    },
                ],
            });
        } else {
            console.error('Invalid data format:', data);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className={"text-center"}>Patrimoine économique: statistiques</h2>
            <div className="mb-4">
                <p className={"text-center"}>Sélectionnez une rangée de dates pour obtenir vos statistiques</p>
                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <label>Date Début:</label>
                        <DatePicker
                            selected={dateDebut}
                            onChange={(date) => setDateDebut(date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                        />
                    </div>
                    <div>
                        <label>Date Fin:</label>
                        <DatePicker
                            selected={dateFin}
                            onChange={(date) => setDateFin(date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                        />
                    </div>
                    <div>
                        <label>Jour:</label>
                        <input
                            type="number"
                            value={jour}
                            onChange={(e) => setJour(e.target.value)}
                            className="form-control"
                            placeholder="Jour"
                        />
                    </div>
                </div>
                <Button onClick={handleValidationClick} variant="primary">
                    Valider
                </Button>
            </div>

            <div className="chart-container m-auto">
                <Line data={chartData}/>
            </div>

            <div className="mb-4 mt-lg-5">
                <h3 className={"text-center"}>Valeur de votre patrimoine</h3>
                <p className={"text-center"}>Sélectionnez une date :</p>
                <div className="mb-4">
                    <div className="mb-3">
                        <label>Date:</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                        />
                    </div>
                    <Button onClick={handleDateValidationClick} variant="primary">
                        Valider Date
                    </Button>
                </div>

                {patrimoineValue !== null && (
                    <Alert variant="success">
                        Valeur du patrimoine à la date du {selectedDate ? selectedDate.toLocaleDateString() : 'sélectionnée'} : {patrimoineValue}
                    </Alert>
                )}

                {error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default Patrimoine;
