import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function CalculerPatrimoine() {
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [date, setDate] = useState(getCurrentDate());

    const handleCalculate = () => {
        console.log(`Calculating patrimoine for ${date}`);
        // Your calculation logic goes here
    };

    return (
        <>
            <Form>
                <Form.Group controlId="formDate">
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Form.Group>
            </Form>
            <br/>
            <Button variant="primary" onClick={handleCalculate}>
                Validate
            </Button>
            <br/>
        </>
    );
}

export default CalculerPatrimoine;
