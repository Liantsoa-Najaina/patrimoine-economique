import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";

const DatePickerComponent = ({ selectedDate, onDateChange, label }) => {
	return (
		<Form.Group className="mb-3">
			<Form.Label>{label}</Form.Label>
			<DatePicker
				selected={selectedDate}
				onChange={(date) => onDateChange(date)}
				dateFormat="yyyy-MM-dd"
				className="fs-5 px-4 mt-3 btn-sm form-control"
			/>
		</Form.Group>
	);
};

export default DatePickerComponent;
