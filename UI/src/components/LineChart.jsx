// eslint-disable-next-line no-unused-vars
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

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip
);

const LineChart = ({ data }) => {
	const chartData = {
		labels: data.map((d) => d.date),
		datasets: [
			{
				label: "Valeur du Patrimoine",
				data: data.map((d) => d.valeur),
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
		animation: {
			onProgress: function (animation) {
				const chartInstance = animation.chart;
				const ctx = chartInstance.ctx;
				const chartData = chartInstance.data;
				const datasets = chartData.datasets;
				datasets.forEach((dataset) => {
					const meta = chartInstance.getDatasetMeta(dataset.index);
					meta.data.forEach((element) => {
						const { x, y } = element;
						element.hidden = false;
						ctx.save();
						ctx.beginPath();
						ctx.arc(x, y, 0, 0, 2 * Math.PI);
						ctx.fillStyle = "rgb(100,159,227)";
						ctx.fill();
						ctx.restore();
					});
				});
			},
			onComplete: function (animation) {
				const chartInstance = animation.chart;
				const ctx = chartInstance.ctx;
				const datasets = chartInstance.data.datasets;
				datasets.forEach((dataset) => {
					const meta = chartInstance.getDatasetMeta(dataset.index);
					meta.data.forEach((element) => {
						const { x, y } = element;
						ctx.save();
						ctx.beginPath();
						ctx.arc(x, y, 4, 0, 2 * Math.PI);
						ctx.fillStyle = "rgb(100,159,227)";
						ctx.fill();
						ctx.restore();
					});
				});
			},
		},
	};

	return (
		<div className="chart-container" style={{ height: "400px" }}>
			<Line data={chartData} options={options} />
		</div>
	);
};

export default LineChart;
