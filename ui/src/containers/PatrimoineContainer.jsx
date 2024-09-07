import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartComponent from '../components/ChartComponent';
import PatrimoineDatePicker from '../components/PatrimoineDatePicker';

const PatrimoineContainer = () => {
	const [chartData, setChartData] = useState({});
	const [dateRange, setDateRange] = useState({
		dateDebut: '',
		dateFin: '',
		jour: '',
		date: ''
	});

	useEffect(() => {
		if (dateRange.dateDebut && dateRange.dateFin && dateRange.jour) {
			fetchChartData();
		}
	}, [dateRange.dateDebut, dateRange.dateFin, dateRange.jour]);

	const fetchChartData = async () => {
		try {
			const response = await axios.post('/patrimoine/range', {
				startDate: dateRange.dateDebut,
				endDate: dateRange.dateFin,
				jour: dateRange.jour
			});
			const data = response.data.values;
			setChartData({
				labels: data.map(item => item.date),
				datasets: [
					{
						label: 'Valeur du Patrimoine',
						data: data.map(item => item.totalValue),
						borderColor: 'rgba(75,192,192,1)',
						backgroundColor: 'rgba(75,192,192,0.2)'
					}
				]
			});
		} catch (error) {
			console.error('Error fetching chart data:', error);
		}
	};

	const handleDateChange = (e) => {
		const { name, value } = e.target;
		setDateRange(prev => ({ ...prev, [name]: value }));
	};

	const handleValidate = (e) => {
		e.preventDefault();
		fetchChartData();
	};

	const handleDateValidate = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.get(`/patrimoine/${dateRange.date}`);
			const data = response.data.totalValue;
			setChartData({
				labels: [dateRange.date],
				datasets: [
					{
						label: 'Valeur du Patrimoine',
						data: [data],
						borderColor: 'rgba(75,192,192,1)',
						backgroundColor: 'rgba(75,192,192,0.2)'
					}
				]
			});
		} catch (error) {
			console.error('Error fetching patrimoine value:', error);
		}
	};

	return (
		<div>
			<h2>Patrimoine</h2>
			<ChartComponent
				chartData={chartData}
				onDateChange={handleDateChange}
				onValidate={handleValidate}
			/>
			<PatrimoineDatePicker
				onDateChange={handleDateChange}
				onValidate={handleDateValidate}
			/>
		</div>
	);
};

export default PatrimoineContainer;
