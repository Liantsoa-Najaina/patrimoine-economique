// LineChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

const LineChart = ({ data }) => {
	const chartData = {
		labels: data.map((d) => d.date),
		datasets: [
			{
				label: "Valeur du Patrimoine",
				data: data.map((d) => d.totalValue),
				borderColor: "rgb(100,159,227)",
				fill: true,
				tension: 0.4,
			},
		],
	};

	const options = {
		plugins: {
			legend: {
				display: true,
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						return `Valeur: ${context.raw}`;
					},
				},
			},
		},
		responsive: true,
		maintainAspectRatio: false,
	};

	return (
		<div className="chart-container" style={{ height: "350px", width: "100%" }}>
			<Line data={chartData} options={options} />
		</div>
	);
};

export default LineChart;
