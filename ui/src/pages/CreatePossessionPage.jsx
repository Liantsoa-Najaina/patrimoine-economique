// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreatePossessionPage = () => {
    const [libelle, setLibelle] = useState('');
    const [valeur, setValeur] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [tauxAmortissement, setTauxAmortissement] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/possession/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ libelle, valeur, dateDebut, tauxAmortissement }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Possession ajoutée avec succès');
                navigate('/possession');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error creating possession:', error);
            alert('Erreur lors de la création de la possession.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Créer une Nouvelle Possession</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formLibelle">
                    <Form.Label>Libelle</Form.Label>
                    <Form.Control type="text" value={libelle} onChange={(e) => setLibelle(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formValeur">
                    <Form.Label>Valeur Initiale</Form.Label>
                    <Form.Control type="number" value={valeur} onChange={(e) => setValeur(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formDateDebut">
                    <Form.Label>Date Début</Form.Label>
                    <Form.Control type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formTauxAmortissement">
                    <Form.Label>Taux Amortissement</Form.Label>
                    <Form.Control type="number" value={tauxAmortissement} onChange={(e) => setTauxAmortissement(e.target.value)} required />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Ajouter
                </Button>
            </Form>
        </div>
    );
};

export default CreatePossessionPage;
