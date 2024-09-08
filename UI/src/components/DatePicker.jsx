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
				className="form-control"
				dateFormat="yyyy-MM-dd"
			/>
		</Form.Group>
	);
};

export default DatePickerComponent;
