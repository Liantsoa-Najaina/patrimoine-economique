import Form from 'react-bootstrap/Form';

function ValeurPatrimoine() {
    return (
        <>
        <Form.Group controlId="formValeurPatrimoine">
            <Form.Label>Votre patrimoine à cette date vaut :</Form.Label>
            <Form.Control
                type="text"
                placeholder="Readonly input here..."
                readOnly
                tabIndex="-1"
                className="w-max"
            />
        </Form.Group>
        </>
    );
}

export default ValeurPatrimoine;