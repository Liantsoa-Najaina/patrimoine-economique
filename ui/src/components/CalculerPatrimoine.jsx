import {useEffect, useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import Patrimoine from "../../../models/Patrimoine.js";
import {arrayPossesions} from "./TableauPossessions.jsx";

function CalculerPatrimoine() {
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [date, setDate] = useState(getCurrentDate());
    const [DateFinal, SetDateFinal] = useState('...');
    const [valeurPatrimoine, setValeurPatrimoine] = useState('');

    useEffect(() => {
        // Calculate and set the default value when the component mounts
        const calculateDefaultValue = () => {
            const patrimoine = new Patrimoine("John Doe", arrayPossesions.slice(0, 7));
            const result = patrimoine.getValeur(new Date());
            return isNaN(result) ? '' : result.toFixed(2);
        };

        setValeurPatrimoine(calculateDefaultValue());
    }, [DateFinal]);

    const handleInputChange = (e) => {
        setDate(e.target.value);
    };

    const handleButtonClick = () => {
        SetDateFinal(date);
        setValeurPatrimoine(calculerValeur());
    };


    const calculerValeur = () => {
        console.log(`Calcul patrimoine ${DateFinal}`);
        const patrimoine = new Patrimoine("John Doe", arrayPossesions.slice(0,7));
        let result = patrimoine.getValeur(new Date(DateFinal));
        if (isNaN(result)){
            return '';
        }
        return result.toFixed(2);
    };

    return (
        <>
            <Form>
                <Form.Group controlId="formDate">
                    <Form.Label>Choisissez une date</Form.Label>
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={handleInputChange}
                    />
                </Form.Group>
            </Form>
            <br/>
            <p>Validez pour obtenir la valeur de votre patrimoine économique</p>
            <Button variant="primary" onClick={handleButtonClick}>
                Valider
            </Button>
            <br/>
            <br/>
            <Form.Group controlId="formValeurPatrimoine">
                <Form.Control
                    type="text"
                    value={`${valeurPatrimoine} Ariary`}
                    readOnly
                    tabIndex="-1"
                    className="w-max"
                />
            </Form.Group>
            </>
    );
}

export default CalculerPatrimoine;
