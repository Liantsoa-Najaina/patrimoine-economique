import Table from 'react-bootstrap/Table';
import {useEffect, useState} from "react";
import Possession from "../../../models/possessions/Possession.js"
import CalculerPatrimoine from "./CalculerPatrimoine.jsx";


let arrayPossesions = [];
function TableauPossessions({ } ) {
    const [possessions, setPossessions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('../../public/data/data.json');
                const data = await response.json();
                setPossessions(data.find(item => item.model === "Patrimoine").data.possessions);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData().catch(error => console.error("Error in fetchData:", error));
    }, []);

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Libellé</th>
                <th>Valeur initiale</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Amortissement</th>
                <th>Valeur actuelle</th>
            </tr>
            </thead>
            <tbody>
            {possessions.map((possession, index) => {
                const valeur = new Possession(
                    possession.possesseur, possession.libelle, possession.valeur, new Date(possession.dateDebut), new Date(possession.dateFin), possession.tauxAmortissement
                );
                arrayPossesions.push(valeur);
                return (
                    <tr key={index}>
                        <td>{valeur.libelle}</td>
                        <td>{valeur.valeur}</td>
                        <td>{new Date(valeur.dateDebut).toLocaleDateString()}</td>
                        <td>{'null'}</td>
                        <td>{(valeur.tauxAmortissement !== null) ? valeur.tauxAmortissement : 0}</td>
                        <td>{valeur.getValeur(new Date()).toFixed(2)}</td>
                    </tr>
                )
            })}
            </tbody>
        </Table>
    );
}

export default TableauPossessions;
export {arrayPossesions};
