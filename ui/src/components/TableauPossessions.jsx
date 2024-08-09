import { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import Patrimoine from "../../../models/Patrimoine.js";
import Possession from "../../../models/possessions/Possession.js";
import Flux from "../../../models/possessions/Flux.js";

function TableauPossessions() {
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [date, setDate] = useState(getCurrentDate());
    const [possessions, setPossessions] = useState([]);
    const [valeurPatrimoine, setValeurPatrimoine] = useState('');
    const [totalAssets, setTotalAssets] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('../../public/data/data.json');
                const data = await response.json();
                const possessionsData = data.find(item => item.model === "Patrimoine").data.possessions;
                const possessionInstances = possessionsData.map(possession => {
                    if (possession.libelle === "Alternance" || possession.libelle === "Survie") {
                        return new Flux(
                            possession.possesseur,
                            possession.libelle,
                            0,
                            new Date(possession.dateDebut),
                            null,
                            null,
                            possession.jour,
                            possession.valeurConstante
                        );
                    } else {
                        return new Possession(
                            possession.possesseur, possession.libelle, possession.valeur, new Date(possession.dateDebut), new Date(possession.dateFin), possession.tauxAmortissement
                        );
                    }
                });
                setPossessions(possessionInstances);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData().catch(error => console.error("Error in fetchData:", error));
    }, []);

    const handleInputChange = (e) => {
        setDate(e.target.value);
    };

    const handleButtonClick = () => {
        const patrimoine = new Patrimoine("John Doe", possessions.filter(p => p.libelle !== "Alternance" && p.libelle !== "Survie"));
        const valeurPatrimoine = patrimoine.getValeur(new Date(date));

        const alternance = possessions.find(p => p.libelle === "Alternance");
        const survie = possessions.find(p => p.libelle === "Survie");

        const alternanceValeur = alternance ? alternance.getValeur(new Date(date)) : 0;
        const survieValeur = survie ? survie.getValeur(new Date(date)) : 0;

        const totalAssets = valeurPatrimoine + alternanceValeur + survieValeur;

        setValeurPatrimoine(isNaN(valeurPatrimoine) ? '' : valeurPatrimoine.toFixed(2));
        setTotalAssets(totalAssets.toFixed(2));
    };

    return (
        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Libellé</th>
                    <th>Valeur initiale<br/>(en Ar)</th>
                    <th>Date<br/>Début</th>
                    <th>Date<br/>Fin</th>
                    <th>Amortissement<br/>(en %)</th>
                    <th>Valeur actuelle<br/>(en Ar)</th>
                </tr>
                </thead>
                <tbody>
                {possessions.map((possession, index) => (
                    <tr key={index}>
                        <td>{possession.libelle}</td>
                        <td>{possession instanceof Flux ? possession.valeurConstante : possession.valeur}</td>
                        <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                        <td>{new Date(date).toLocaleDateString()}</td>
                        <td>{(possession.tauxAmortissement !== null) ? possession.tauxAmortissement : 0}</td>
                        <td>{possession.getValeur(new Date(date)).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <br/>
            <Form>
                <Form.Group controlId="formDate">
                    <Form.Label>Sélectionnez une date</Form.Label>
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
            <Form.Group controlId="formTotalAssets">
                <Form.Label>Votre patrimoine économique à cette date vaut  :</Form.Label>
                <Form.Control
                    type="text"
                    value={`${totalAssets} Ariary`}
                    readOnly
                    tabIndex="-1"
                    className="w-max"
                />
            </Form.Group>
        </>
    );
}

export default TableauPossessions;
