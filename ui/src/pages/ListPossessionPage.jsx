// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Flux from "../../../models/possessions/Flux.js";

const PossessionListPage = () => {
    const [possessions, setPossessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/possession');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const possessions = await response.json();
                setPossessions(possessions);
            } catch (error) {
                console.error('Error fetching possessions:', error);
            }
        };



        fetchData();
    }, []);

    const handleCreate = () => {
        navigate('/possession/create');
    };

    const handleEdit = (libelle) => {
        navigate(`/possession/${libelle}/update`);
    };

    const handleClose = async (libelle) => {
        try {
            const response = await fetch(`http://localhost:3000/possession/${libelle}/close`, { method: 'POST' });
            const result = await response.json();
            if (response.ok) {
                setPossessions(possessions.filter(possession => possession.libelle !== libelle));
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error closing possession:', error);
        }
    };

    return (
        <div className="container mt-4">
            <Button onClick={handleCreate} variant="primary" className="mb-4">
                Create Possession
            </Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Libelle</th>
                    <th>Valeur</th>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Taux</th>
                    <th>Valeur Actuelle</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {possessions.map((possession) => (
                    <tr key={possession.libelle}>
                        <td>{possession.libelle}</td>
                        <td>{possession.valeur}</td>
                        <td>{possession.dateDebut}</td>
                        <td>{possession.dateFin}</td>
                        <td>{possession.tauxAmortissement}</td>
                        <td>{possession instanceof Flux ? possession.valeurConstante : possession.valeur}</td>
                        <td>
                            <Button onClick={() => handleEdit(possession.libelle)} variant="warning" className="mr-2">
                                Edit
                            </Button>
                            <Button onClick={() => handleClose(possession.libelle)} variant="danger">
                                Close
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default PossessionListPage;
