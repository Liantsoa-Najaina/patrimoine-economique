// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Possession from "../../../models/possessions/Possession.js";
import { useNavigate } from 'react-router-dom';

function PossessionList() {
    const [possessions, setPossessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalValue, setTotalValue] = useState(0);
    const [totalCurrentValue, setTotalCurrentValue] = useState(0);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedPossession, setSelectedPossession] = useState(null);
    const [updateForm, setUpdateForm] = useState({ libelle: '', dateFin: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/possession");
                const jsonData = await response.json();
                console.log('API Response:', jsonData);

                if (jsonData) {
                    const fetchedPossessions = jsonData;

                    const initialTotalCurrentValue = fetchedPossessions.reduce((sum, pos) => {
                        const possessionInstance = new Possession(
                            pos.possesseur.nom,
                            pos.libelle,
                            pos.valeur,
                            new Date(pos.dateDebut),
                            pos.dateFin ? new Date(pos.dateFin) : null,
                            pos.tauxAmortissement || 0
                        );
                        return sum + (possessionInstance.getValeurApresAmortissement(new Date()) || pos.valeur);
                    }, 0);

                    setPossessions(fetchedPossessions);
                    setTotalCurrentValue(initialTotalCurrentValue);
                } else {
                    console.error("Invalid data structure:", jsonData);
                }
            } catch (error) {
                console.error("Error fetching possessions:", error);
            }
        };

        fetchData();
    }, []);

    const applyDate = () => {
        const updatedPossessions = possessions.map(possession => {
            const possessionInstance = new Possession(
                possession.possesseur.nom,
                possession.libelle,
                possession.valeur,
                new Date(possession.dateDebut),
                possession.dateFin ? new Date(possession.dateFin) : null,
                possession.tauxAmortissement || 0
            );

            const valeurActuelle = possessionInstance.getValeurApresAmortissement(selectedDate);
            return {
                ...possession,
                dateFin: selectedDate.toISOString().split('T')[0],
                valeurActuelle: valeurActuelle
            };
        });

        setPossessions(updatedPossessions);

        const totalCurrent = updatedPossessions.reduce((sum, pos) => sum + (pos.valeurActuelle || pos.valeur), 0);
        setTotalCurrentValue(totalCurrent);

        const total = updatedPossessions.reduce((sum, pos) => sum + (pos.valeurActuelle || pos.valeur), 0);
        setTotalValue(total);
    };

    const handleUpdate = (poss) => {
        setSelectedPossession(poss);
        setUpdateForm({
            libelle: poss.libelle,
            dateFin: poss.dateFin ? new Date(poss.dateFin).toISOString().split('T')[0] : ''
        });
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/possession/${selectedPossession.libelle}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    libelle: updateForm.libelle,
                    dateFin: updateForm.dateFin
                })
            });
            const updatedPossession = await response.json();
            setPossessions(possessions.map(p => p.libelle === updatedPossession.libelle ? updatedPossession : p));
            setShowUpdateModal(false);
        } catch (error) {
            console.error('Error updating possession:', error);
        }
    };

    const handleClose = async (index) => {
        const possessionToClose = possessions[index];
        try {
            await fetch(`http://localhost:5000/possession/${possessionToClose.libelle}/close`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...possessionToClose,
                    dateFin: new Date().toISOString().split('T')[0]
                })
            });
            const updatedPossessions = [...possessions];
            updatedPossessions[index].dateFin = new Date().toISOString().split('T')[0];
            setPossessions(updatedPossessions);
        } catch (error) {
            console.error('Error closing possession:', error);
        }
    };

    const handleCreate = () => {
        navigate('/possession/create');
    };

    return (
        <>
            <br /><br />
            <Button onClick={handleCreate} variant="primary" className="mb-4">Créer une nouvelle possession</Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Possesseur</th>
                    <th>Libelle</th>
                    <th>Valeur initiale</th>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Amortissement</th>
                    <th>Valeur Actuelle</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {possessions.map((poss, index) => (
                    <tr key={index}>
                        <td>{poss.possesseur.nom}</td>
                        <td>{poss.libelle}</td>
                        <td>{poss.valeur}</td>
                        <td>{new Date(poss.dateDebut).toLocaleDateString()}</td>
                        <td>{poss.dateFin ? new Date(poss.dateFin).toLocaleDateString() : "-"}</td>
                        <td>{poss.tauxAmortissement ? `${poss.tauxAmortissement}%` : "-"}</td>
                        <td>{poss.valeurActuelle !== undefined ? poss.valeurActuelle.toFixed(2) : poss.valeur.toFixed(2)}</td>
                        <td>
                            <Button onClick={() => handleClose(index)} variant="info" size="sm" style={{ marginRight: '5px' }}>Fermer</Button>
                            <Button onClick={() => handleUpdate(poss)} variant="warning" size="sm">Mettre à jour</Button>
                        </td>
                    </tr>
                ))}
                <tr className="total-row">
                    <td colSpan="7" className="text-end font-weight-bold">Valeur Totale Actuelle:</td>
                    <td className="font-weight-bold">{totalCurrentValue.toFixed(2)}</td>
                </tr>
                </tbody>
            </Table>

            <div className="date-picker-container">
                <label>Sélectionnez une date: </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                />
                <Button onClick={applyDate} style={{ marginLeft: '10px' }}>Appliquer</Button>
            </div>

            <div className="total-value">
                <h3>Valeur Totale: {totalValue.toFixed(2)}</h3>
            </div>

            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Mettre à jour la possession</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateSubmit}>
                        <Form.Group controlId="formLibelle">
                            <Form.Label>Libelle</Form.Label>
                            <Form.Control
                                type="text"
                                value={updateForm.libelle}
                                onChange={(e) => setUpdateForm({ ...updateForm, libelle: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateFin">
                            <Form.Label>Date Fin</Form.Label>
                            <Form.Control
                                type="date"
                                value={updateForm.dateFin}
                                onChange={(e) => setUpdateForm({ ...updateForm, dateFin: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Sauvegarder
                        </Button>
                        <Button variant="secondary" onClick={() => setShowUpdateModal(false)} style={{ marginLeft: '10px' }}>
                            Annuler
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PossessionList;
